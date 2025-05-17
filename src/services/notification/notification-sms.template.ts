import { TenantConsumptionBill } from 'src/services/bill/models/bill.model';

export const notifBillTemplate = (data: TenantConsumptionBill) => {
  const { user, bill } = data;
  const { firstName, lastName } = user;
  const { totalConsumption, totalPricePerMeter, totalBill } = bill;
  return `Hi ${firstName} ${lastName}, your water bill is ready. Total Consumption: ${totalConsumption} m³. Average Price: ₱${totalPricePerMeter} m³. Total Bill: ₱${totalBill} Thank you!`;
};
