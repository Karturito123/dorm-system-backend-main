import { Injectable } from '@nestjs/common';

import { FirebaseService } from 'src/modules/firebase/services/firebase-service/firebase-service';
import { handleServiceError } from 'src/shared/utils/error-handler.util';

@Injectable()
export class WaterPriceSettingService {
  readonly serviceName = 'water-setting-service';
  constructor(private firebase: FirebaseService) {}

  async getLatestPrice() {
    try {
      const snapshot = await this.firebase
        .initCollection('water_price_settings')
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get();

      const latestPrice = snapshot.docs[0].data()['price'];

      return latestPrice;
    } catch (error) {
      handleServiceError(error, `${this.serviceName}-get-years`);
    }
  }
}
