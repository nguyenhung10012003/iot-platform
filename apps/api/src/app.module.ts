import { CommonModule } from '@app/common';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from '@app/common/strategies';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AutomationModule } from './automation/automation.module';
import { DeviceTemplateModule } from './device-template/device-template.module';
import { DeviceModule } from './device/device.module';
import { GatewayModule } from './gateway/gateway.module';
import { JobModule } from './job/job.module';
import { LocationModule } from './location/location.module';
import { MqttModule } from './mqtt/mqtt.module';
import { UserModule } from './user/user.module';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    CommonModule,
    UserModule,
    AuthModule,
    DeviceTemplateModule,
    DeviceModule,
    LocationModule,
    GatewayModule,
    MqttModule,
    JobModule,
    AutomationModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, AccessTokenStrategy, RefreshTokenStrategy, MailerService],
})
export class AppModule {}
