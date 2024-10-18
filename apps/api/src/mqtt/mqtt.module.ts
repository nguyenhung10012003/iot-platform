import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MqttService } from './mqtt.service';

@Module({
  controllers: [],
  providers: [MqttService, PrismaService],
  exports: [MqttService],
})
export class MqttModule {}
