import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { DeviceService } from './device.service';
import { AccessTokenGuard } from '@app/common/guards';
import { CreateDeviceDto } from './types/create-device.dto';
import { AuthenticatedRequest } from '@app/common/types';

@Controller('device')
@UseGuards(AccessTokenGuard)
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  async createDevice(@Body() data: CreateDeviceDto) {
    return this.deviceService.createDevice(data);
  }

  @Get()
  async getDevices(@Req() req: AuthenticatedRequest) {
    //TODO: Implement this method
  }
}
