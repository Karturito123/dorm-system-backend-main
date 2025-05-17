import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { TWILIO } from '../../enums/twilio.enum';
import { ConfigService } from '@nestjs/config';
import { UserContactDTO } from 'src/dto/message/send-message.dto';
import { handleServiceError } from 'src/shared/utils/error-handler.util';
@Injectable()
export class MessageService {
  readonly serviceName = 'message-service';
  constructor(private configService: ConfigService) {}

  async sendMessage(contact: UserContactDTO, messageBody: string) {
    const accountSid = this.configService.get<string>('SMS_SERVICE_ACC_SID');
    const authToken = this.configService.get<string>('SMS_SERVICE_AUTH_TOKEN');
    const messagingServiceSid = this.configService.get<string>(
      'SMS_MESSAGING_SERVICE_ID',
    );
    const client = new Twilio(accountSid, authToken);

    try {
      const { mobileNo } = contact;
      const response = await client.messages.create({
        body: messageBody,
        from: TWILIO.SENDER_NO,
        messagingServiceSid,
        to: mobileNo,
      });
      return response.sid;
    } catch (error) {
      handleServiceError(error, `${this.serviceName}-sendMessage`);
    }
  }
}
