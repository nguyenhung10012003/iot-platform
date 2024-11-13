import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { MqttModule } from 'src/mqtt/mqtt.module';

@Module({
  imports: [MqttModule],
  controllers: [DeviceController],
  providers: [DeviceService, PrismaService],
})
export class DeviceModule {}
