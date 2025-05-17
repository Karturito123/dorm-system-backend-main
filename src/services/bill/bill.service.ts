import { Injectable } from '@nestjs/common';
import { Timestamp } from 'firebase-admin/firestore';

import { FirebaseService } from 'src/modules/firebase/services/firebase-service/firebase-service';
import {
  TenantConsumptionBill,
  WaterConsumptionSummary,
} from './models/bill.model';
import { User } from '../user/models/user.model';
import { fromZonedTime } from 'date-fns-tz';
@Injectable()
export class BillService {
  readonly serviceName = 'bill-service';
  constructor(private firebase: FirebaseService) {}

  async getTenantsConsumptionAndBill(
    users: Array<User>,
  ): Promise<Array<TenantConsumptionBill>> {
    const now = Timestamp.now().toDate();

    const userBill = await Promise.all(
      users.map(async (user) => {
        const { id } = user;
        const bill = await this.computeTenantConsumptionAndBill(id, now);
        return {
          user,
          bill,
        };
      }),
    );
    console.log('userBill', userBill);
    const filteredUserWithRecord = await userBill.filter(
      (d) => !!d.bill.totalConsumption,
    );
    return filteredUserWithRecord;
  }

  private async computeTenantConsumptionAndBill(
    uid: string,
    date: Date,
  ): Promise<WaterConsumptionSummary> {
    let totalPricePerMeter = 0;
    let totalConsumption = 0;
    let recordCount = 0;

    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const startOfNextMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      1,
    );

    const startUTCDate = fromZonedTime(startOfMonth, 'Asia/Singapore');
    const endUTCDate = fromZonedTime(startOfNextMonth, 'Asia/Singapore');

    const startTimestamp = Timestamp.fromDate(startUTCDate).toDate();
    const endTimestamp = Timestamp.fromDate(endUTCDate).toDate();

    console.log('startTimestamp', startTimestamp);
    console.log('startUTCDate', startUTCDate);

    const snapshot = await this.firebase
      .initCollection('water_consumption')
      .where('uid', '==', uid)
      .where('timestamp', '>=', startTimestamp)
      .where('timestamp', '<', endTimestamp)
      .get();

    snapshot.forEach((doc) => {
      const data = doc.data();
      totalPricePerMeter += data.pricePerMeter;
      totalConsumption += data.consumption;
      recordCount++;
    });

    const averagePricePerMeter = totalPricePerMeter / recordCount;
    totalPricePerMeter = !isNaN(averagePricePerMeter)
      ? averagePricePerMeter
      : 0;
    const totalBill = averagePricePerMeter * totalConsumption;
    return {
      totalPricePerMeter,
      totalConsumption,
      totalBill: !isNaN(totalBill) ? totalBill : 0,
    };
  }
}
