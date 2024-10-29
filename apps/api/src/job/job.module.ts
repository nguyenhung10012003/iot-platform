import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { PrismaService } from 'src/prisma.service';
import { AwsS3Service } from 'src/s3/aws-s3.service';

@Module({
  controllers: [JobController],
  providers: [JobService, PrismaService, AwsS3Service],
})
export class JobModule {}
