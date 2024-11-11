import { AccessTokenGuard } from '@app/common/guards';
import { AuthenticatedRequest } from '@app/common/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './types/create-device.dto';
import { DeviceQuery } from './types/device.query';

@Controller('device')
@UseGuards(AccessTokenGuard)
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  async createDevice(@Body() data: CreateDeviceDto) {
    return this.deviceService.createDevice(data);
  }

  @Get()
  async getDevices(
    @Req() req: AuthenticatedRequest,
    @Query() query: DeviceQuery,
  ) {
    //TODO: Implement this method
    return this.deviceService.getDeviceByLocation({
      userId: req.user.userId,
      locationId: query.locationId,
    });
  }

  @Delete(':id')
  async deleteDevice(@Param('id') id: string) {
    return this.deviceService.deleteDevice(id);
  }
}
