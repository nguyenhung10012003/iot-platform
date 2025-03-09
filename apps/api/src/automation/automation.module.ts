import { Module } from '@nestjs/common';
import { MqttModule } from 'src/mqtt/mqtt.module';
import { PrismaService } from 'src/prisma.service';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { AutomationController } from './automation.controller';
import { AutomationService } from './automation.service';
import { MailerService } from 'src/mailer.service';
import { IrrigationModule } from 'src/irrigation/irrigation.module';

@Module({
  imports: [SchedulerModule, MqttModule, IrrigationModule],
  controllers: [AutomationController],
  providers: [AutomationService, PrismaService, MailerService],
})
export class AutomationModule {}
