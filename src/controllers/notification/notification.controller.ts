import { Body, Controller, Post } from '@nestjs/common';
import { SendMessageDTO } from 'src/dto/message/send-message.dto';
import { NotificationService } from 'src/services/notification/notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post('announcement')
  sendAnnouncement(@Body() body: SendMessageDTO) {
    const { userContacts, message } = body;
    return this.notificationService.sendAnnouncementMessage(
      userContacts,
      message,
    );
  }

  @Post('bill')
  sendMessage() {
    return this.notificationService.sendBillNotification();
  }
}
