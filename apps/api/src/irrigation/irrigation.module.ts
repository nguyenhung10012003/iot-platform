import { Module } from '@nestjs/common';
import { PredictService } from 'src/predict/predict.service';
import { PrismaService } from 'src/prisma.service';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import { IrrigationController } from './irrigation.controller';
import { IrrigationService } from './irrigation.service';

@Module({
  imports: [SchedulerModule],
  controllers: [IrrigationController],
  providers: [PrismaService, IrrigationService, PredictService],
})
export class IrrigationModule {}
