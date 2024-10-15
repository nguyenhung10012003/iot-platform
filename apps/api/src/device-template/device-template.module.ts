import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AwsS3Service } from 'src/s3/aws-s3.service';
import { DeviceTemplateController } from './device-template.controller';
import { DeviceTemplateService } from './device-template.service';

@Module({
  controllers: [DeviceTemplateController],
  providers: [DeviceTemplateService, PrismaService, AwsS3Service],
})
export class DeviceTemplateModule {}
