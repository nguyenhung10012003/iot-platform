import { Module } from '@nestjs/common';
import { MqttModule } from 'src/mqtt/mqtt.module';
import { PrismaService } from 'src/prisma.service';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { AutomationController } from './automation.controller';
import { AutomationService } from './automation.service';

@Module({
  imports: [SchedulerModule, MqttModule],
  controllers: [AutomationController],
  providers: [AutomationService, PrismaService],
})
export class AutomationModule {}
