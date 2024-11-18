import { CommonModule } from '@app/common';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from '@app/common/strategies';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { createTransport } from 'nodemailer';
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
    MailerModule.forRoot({
      transport: createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AppModule {}
