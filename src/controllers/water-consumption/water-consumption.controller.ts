import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateWaterConsumptionDTO } from 'src/dto/water-consumption/water-consumption.dto';
import { WaterConsumptionService } from 'src/services/water-consumption/water-consumption.service';

@Controller('water-consumption')
export class WaterConsumptionController {
  constructor(private waterConsumptionService: WaterConsumptionService) {}

  @Post('create')
  createUser(@Body() body: CreateWaterConsumptionDTO) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestException('Request body cannot be empty.');
    }

    return this.waterConsumptionService.createWaterConsumption(body);
  }
}
