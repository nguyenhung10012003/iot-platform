import { AccessTokenGuard } from '@app/common/guards';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { IrrigationService } from './irrigation.service';

@Controller('irrigation')
@UseGuards(AccessTokenGuard)
export class IrrigationController {
  constructor(private readonly irrigationService: IrrigationService) {}

  @Get(':locationId')
  async getIrrigationByLocation(@Param('locationId') locationId: string) {
    return this.irrigationService.getIrrigationByLocation({ locationId });
  }
}
