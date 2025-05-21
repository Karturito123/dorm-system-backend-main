import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/modules/firebase/services/firebase-service/firebase-service';
import { handleServiceError } from 'src/shared/utils/error-handler.util';

@Injectable()
export class MetaService {
  readonly serviceName = 'meta-service';
  constructor(private firebase: FirebaseService) {}

  async getYears(): Promise<Array<number>> {
    try {
      const yearsRef = this.firebase.initCollection('meta').doc('years');

      const years = await yearsRef.get();
      const { availableYears } = years.data();

      return availableYears;
    } catch (error) {
      handleServiceError(error, `${this.serviceName}-get-years`);
    }
  }

  async addYear(year: number): Promise<void> {
    try {
      const yearsRef = this.firebase.initCollection('meta').doc('years');

      const years = await yearsRef.get();

      if (years.exists) {
        const { availableYears } = years.data();
        const yearSet = new Set([...availableYears, year]);

        await yearsRef.update({
          availableYears: Array.from(yearSet),
        });
      } else {
        yearsRef.set({
          availableYears: [year],
        });
      }
    } catch (error) {}
  }

  async addTenant(year: number, uid: string): Promise<void> {
    try {
      const tenantPerYearRef = this.firebase
        .initCollection('meta')
        .doc('tenantPerYear');
      const tenantPerYear = await tenantPerYearRef.get();

      if (tenantPerYear.exists) {
        const existingUids = tenantPerYear.data()[year];
        if (existingUids) {
          const newUids = new Set([...existingUids, uid]);
          await tenantPerYearRef.update({
            [year]: Array.from(newUids),
          });
        } else {
          await tenantPerYearRef.update({
            [year]: [uid],
          });
        }
      } else {
        tenantPerYearRef.set({
          [year]: [uid],
        });
      }
    } catch (error) {
      handleServiceError(error, `${this.serviceName}-add-tenant-per-year`);
    }
  }
}
