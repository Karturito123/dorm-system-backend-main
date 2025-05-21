import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';
export class WaterConsumptionDTO {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsNotEmpty()
  @IsNumber()
  consumption: number;
}

export class CreateWaterConsumptionDTO extends OmitType(WaterConsumptionDTO, [
  'id',
] as const) {}
