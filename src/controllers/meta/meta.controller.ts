import { Controller, Get } from '@nestjs/common';
import { MetaService } from 'src/services/meta/meta-service';

@Controller('meta')
export class MetaController {
  constructor(private metaService: MetaService) {}

  @Get('years')
  getYears() {
    return this.metaService.getYears();
  }
}
