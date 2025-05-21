import { Injectable } from '@nestjs/common';

import { FirebaseService } from 'src/modules/firebase/services/firebase-service/firebase-service';
import { handleServiceError } from 'src/shared/utils/error-handler.util';
import { Room } from './models/room.model';

@Injectable()
export class RoomService {
  readonly serviceName = 'room-service';
  constructor(private firebase: FirebaseService) {}

  async getRoom(id: string): Promise<Room> {
    try {
      const doc = await this.firebase.initCollection('rooms').doc(id).get();

      return doc.data() as Room;
    } catch (error) {
      handleServiceError(error, `${this.serviceName}-get-room`);
    }
  }
}
