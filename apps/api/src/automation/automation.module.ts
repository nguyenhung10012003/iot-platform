import { Module } from '@nestjs/common';
import { MqttModule } from 'src/mqtt/mqtt.module';
import { PrismaService } from 'src/prisma.service';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { AutomationController } from './automation.controller';
import { AutomationService } from './automation.service';
import { MailerService } from 'src/mailer.service';

@Module({
  imports: [SchedulerModule, MqttModule],
  controllers: [AutomationController],
  providers: [AutomationService, PrismaService, MailerService],
})
export class AutomationModule {}
