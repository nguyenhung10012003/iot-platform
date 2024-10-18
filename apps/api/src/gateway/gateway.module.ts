import { Module } from '@nestjs/common';
import { MqttModule } from 'src/mqtt/mqtt.module';
import { PrismaService } from 'src/prisma.service';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';

@Module({
  imports: [MqttModule],
  controllers: [GatewayController],
  providers: [GatewayService, PrismaService],
})
export class GatewayModule {}
