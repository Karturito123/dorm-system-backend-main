import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MessageService } from './services/message/message.service';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationController } from './controllers/notification/notification.controller';
import { BillService } from './services/bill/bill.service';
import { NotificationService } from './services/notification/notification.service';

@Module({
  imports: [ConfigModule.forRoot({ cache: true }), FirebaseModule],
  controllers: [AppController, UserController, NotificationController],
  providers: [MessageService, UserService, BillService, NotificationService],
})
export class AppModule {}
