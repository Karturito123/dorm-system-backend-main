import { Injectable } from '@nestjs/common';
import { BillService } from '../bill/bill.service';
import { UserService } from '../user/user.service';
import { notifBillTemplate } from 'src/services/notification/notification-sms.template';
import { MessageService } from '../message/message.service';
import { UserContactDTO } from 'src/dto/message/send-message.dto';
import { handleServiceError } from 'src/shared/utils/error-handler.util';
import { Timestamp } from 'firebase-admin/firestore';
import { FirebaseService } from 'src/modules/firebase/services/firebase-service/firebase-service';

@Injectable()
export class NotificationService {
  readonly serviceName = 'notification-service';
  constructor(
    private billService: BillService,
    private userService: UserService,
    private messageService: MessageService,
    private firebase: FirebaseService,
  ) {}

  private async generateBillNotifications() {
    const users = await this.userService.getUsers();
    const userBills =
      await this.billService.getTenantsConsumptionAndBill(users);
    const notifs = userBills.map((userBill) => {
      const { user } = userBill;
      return {
        user,
        message: notifBillTemplate(userBill),
      };
    });
    console.log('notifs', notifs);
    return notifs;
  }

  async sendAnnouncementMessage(
    userContact: UserContactDTO[],
    messageBody: string,
  ) {
    const result = [];
    const sendToUids = [];
    let messagesRef: FirebaseFirestore.DocumentReference<
      FirebaseFirestore.DocumentData,
      FirebaseFirestore.DocumentData
    >;
    try {
      for (const contact of userContact) {
        const { uid, mobileNo } = contact;
        const sid = await this.messageService.sendMessage(contact, messageBody);
        sendToUids.push(uid);
        result.push({
          status: 'success',
          mobileNo,
          id: sid,
        });
      }
    } catch (error) {
      handleServiceError(error, `${this.serviceName}-announcement`);
    } finally {
      messagesRef = await this.firebase.initCollection('messages').add({
        message: messageBody,
        timestamp: Timestamp.now(),
        uids: sendToUids,
      });
    }

    const messageData = await messagesRef.get();

    return {
      ...messageData.data(),
      timestamp: messageData.createTime.toDate(),
      id: messagesRef.id,
    };
  }

  async sendBillNotification() {
    const notifs = await this.generateBillNotifications();
    const result = [];
    let messagesRef: FirebaseFirestore.DocumentReference<
      FirebaseFirestore.DocumentData,
      FirebaseFirestore.DocumentData
    >;
    try {
      for (const notif of notifs) {
        const { message, user } = notif;
        const { id: uid, mobileNo } = user;
        const contact = {
          uid,
          mobileNo,
        };

        const sid = await this.messageService.sendMessage(contact, message);

        messagesRef = await this.firebase.initCollection('messages').add({
          message: message,
          timestamp: Timestamp.now(),
          uids: [uid],
        });
        const messageData = await messagesRef.get();
        result.push({
          status: 'success',
          mobileNo,
          id: sid,
          timestamp: messageData.createTime.toDate(),
          ...messageData.data(),
        });
      }
    } catch (error) {
      handleServiceError(error, `${this.serviceName}-announcement`);
    }

    return result;
  }
}
