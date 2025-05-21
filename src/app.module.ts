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
import { WaterConsumptionController } from './controllers/water-consumption/water-consumption.controller';
import { WaterConsumptionService } from './services/water-consumption/water-consumption.service';
import { RoomService } from './services/rooms/room-service';
import { MetaService } from './services/meta/meta-service';
import { MetaController } from './controllers/meta/meta.controller';
import { WaterPriceSettingService } from './services/water-price-setting/water-price-setting.service';

@Module({
  imports: [ConfigModule.forRoot({ cache: true }), FirebaseModule],
  controllers: [
    AppController,
    UserController,
    NotificationController,
    WaterConsumptionController,
    MetaController,
  ],
  providers: [
    MessageService,
    UserService,
    BillService,
    NotificationService,
    WaterConsumptionService,
    RoomService,
    MetaService,
    WaterPriceSettingService,
  ],
})
export class AppModule {}
