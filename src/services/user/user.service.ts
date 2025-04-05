import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Timestamp } from 'firebase-admin/firestore';
import { CreateUserDTO, UpdateUserDTO } from 'src/dto/user/user.dto';
import { Role } from 'src/enums/role.enum';

import { FirebaseService } from 'src/modules/firebase/services/firebase-service/firebase-service';
@Injectable()
export class UserService {
  constructor(private firebase: FirebaseService) {}
  errorHandler(error) {
    if (error.code) {
      throw new BadRequestException(`Error: ${error.message}`);
    }

    throw new InternalServerErrorException(
      `User creation failed: ${error.message}`,
    );
  }

  async createUser(user: CreateUserDTO) {
    try {
      const { uid } = await this.firebase.auth.createUser(user);
      const userRef = this.firebase.initCollection('users').doc(uid);

      await userRef.set({
        id: uid,
        ...user,
        role: Role.TENANT,
        isActive: true,
        approved: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      const userData = await userRef.get();
      const { createdAt, updatedAt, ...rest } = userData.data();
      return {
        ...rest,
        createdAt: (createdAt as Timestamp).toDate(),
        updatedAt: (updatedAt as Timestamp).toDate(),
      };
    } catch (error) {
      console.log(error);
      this.errorHandler(error);
    }
  }

  async updateUser(user: UpdateUserDTO) {
    try {
      const { uid } = await this.firebase.auth.updateUser(user.id, {
        ...user,
      });
      const userRef = this.firebase.initCollection('users').doc(uid);
      await userRef.update({
        ...user,
        updatedAt: Timestamp.now(),
      });
      const userData = await userRef.get();
      const { createdAt, updatedAt, ...rest } = userData.data();

      return {
        ...rest,
        createdAt: (createdAt as Timestamp).toDate(),
        updatedAt: (updatedAt as Timestamp).toDate(),
      };
    } catch (error) {
      this.errorHandler(error);
    }
  }
}
