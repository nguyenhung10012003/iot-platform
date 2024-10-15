import { CommonModule } from '@app/common';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from '@app/common/strategies';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DeviceTemplateModule } from './device-template/device-template.module';
import { DeviceModule } from './device/device.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [CommonModule, UserModule, AuthModule, DeviceTemplateModule, DeviceModule, LocationModule],
  controllers: [AppController],
  providers: [AppService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AppModule {}
