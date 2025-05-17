import { Injectable } from '@nestjs/common';
import { Timestamp } from 'firebase-admin/firestore';
import { CreateUserDTO, UpdateUserDTO } from 'src/dto/user/user.dto';
import { Role } from 'src/enums/role.enum';

import { FirebaseService } from 'src/modules/firebase/services/firebase-service/firebase-service';
import { handleServiceError } from 'src/shared/utils/error-handler.util';
import { User } from './models/user.model';
@Injectable()
export class UserService {
  readonly serviceName = 'user-service';
  constructor(private firebase: FirebaseService) {}

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
      handleServiceError(error, `${this.serviceName}-create`);
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
      handleServiceError(error, `${this.serviceName}-update`);
    }
  }

  async getUsers(): Promise<User[]> {
    const users = [];
    const snapshot = await this.firebase
      .initCollection('users')
      .where('isActive', '==', true)
      .where('role', '==', Role.TENANT)
      .get();
    snapshot.forEach((doc) => users.push(doc.data()));
    return users;
  }
}
