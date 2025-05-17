import { User } from 'src/services/user/models/user.model';

export type WaterConsumptionSummary = {
  totalPricePerMeter: number;
  totalConsumption: number;
  totalBill: number;
};

export type TenantConsumptionBill = {
  user: User;
  bill: WaterConsumptionSummary;
};
