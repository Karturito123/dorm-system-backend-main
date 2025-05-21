import { Injectable } from '@nestjs/common';
import { Timestamp } from 'firebase-admin/firestore';

import { FirebaseService } from 'src/modules/firebase/services/firebase-service/firebase-service';
import { handleServiceError } from 'src/shared/utils/error-handler.util';

import { CreateWaterConsumptionDTO } from 'src/dto/water-consumption/water-consumption.dto';
import { RoomService } from '../rooms/room-service';
import { MetaService } from '../meta/meta-service';
import { WaterPriceSettingService } from '../water-price-setting/water-price-setting.service';

@Injectable()
export class WaterConsumptionService {
  readonly serviceName = 'water-consumption-service';
  constructor(
    private firebase: FirebaseService,
    private roomService: RoomService,
    private metaService: MetaService,
    private waterPriceSettingService: WaterPriceSettingService,
  ) {}

  async createWaterConsumption(waterConsumption: CreateWaterConsumptionDTO) {
    try {
      const { roomId, consumption } = waterConsumption;
      const { uid, name: roomNo } = await this.roomService.getRoom(roomId);
      const pricePerMeter =
        await this.waterPriceSettingService.getLatestPrice();
      const date = new Date();
      const currentYear = date.getFullYear();
      this.metaService.addYear(currentYear);
      this.metaService.addTenant(currentYear, uid);

      await this.firebase.initCollection('water_consumption').add({
        consumption,
        roomNo,
        uid,
        pricePerMeter,
        year: currentYear,
        timestamp: Timestamp.fromDate(date),
      });
    } catch (error) {
      handleServiceError(error, `${this.serviceName}-create`);
    }
  }
}
