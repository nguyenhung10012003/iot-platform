import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import { Area, Prisma, Location } from '@prisma/client';
import { PredictService } from 'src/predict/predict.service';
import { PrismaService } from 'src/prisma.service';
import { SchedulerService } from 'src/scheduler/scheduler.service';

interface LatestData {
  temperature?: number;
  humidity?: number;
  rainfall?: number;
  wind?: number;
  soilMoisture?: number;
}

@Injectable()
export class IrrigationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly predictService: PredictService,
    private readonly scheduler: SchedulerService,
  ) {}
  // async onModuleInit() {
  //   this.scheduler.addCronJob(
  //     'Check_Irrigation',
  //     CronExpression.EVERY_30_MINUTES,
  //     async () => {
  //       const areas = await this.prisma.area.findMany({
  //         include: { location: true },
  //       });
  //       areas.map(async (area) => {
  //         const devices = await this.prisma.device.findMany({
  //           where: {
  //             areaId: area.id,
  //             deviceType: 'SENSOR',
  //           },
  //         });
  //         const latestData: LatestData = {};
  //         const currentTime = Date.now();
  //         devices.forEach((device) => {
  //           device.data.forEach((data) => {
  //             const key = (data.type.charAt(0).toLowerCase() +
  //               data.type.slice(1)) as keyof LatestData;
  //             const currentLatestTime =
  //               latestData[key] !== undefined ? latestData[key] : -Infinity;

  //             if (
  //               data.time > currentLatestTime &&
  //               currentTime - data.time <= 3600 * 1000
  //             ) {
  //               latestData[key] = data.data;
  //             }
  //           });
  //         });
  //         Logger.debug(
  //           'Latest data: ' + JSON.stringify(latestData),
  //           IrrigationService.name,
  //         );

  //         const predictResult = await this.predictService.predict(latestData);
  //         const irrigationSpeed =
  //           area.location?.setting?.dripRatePerHole *
  //           area.location?.setting?.totalHole;

  //         Logger.debug(
  //           'Predict result: ' + JSON.stringify(predictResult),
  //           IrrigationService.name,
  //         );
  //         if (predictResult?.prediction && irrigationSpeed) {
  //           const amount = predictResult.prediction * 1000;
  //           const time = amount / irrigationSpeed;
  //           await this.prisma.irrigation.create({
  //             data: {
  //               amount: amount,
  //               locationId: area.locationId,
  //               time: time,
  //             },
  //           });
  //           Logger.debug(
  //             'Irrigation scheduled for location: ' + area.locationId,
  //             IrrigationService.name,
  //           );
  //         }
  //       });
  //     },
  //   );
  // }

  async getIrrigations(args: Prisma.IrrigationFindManyArgs) {
    return this.prisma.irrigation.findMany(args);
  }

  async getIrrigationById(id: string) {
    return this.prisma.irrigation.findUnique({
      where: { id },
    });
  }

  async getIrrigationByLocation({ locationId }: { locationId: string }) {
    return this.prisma.irrigation.findMany({
      where: {
        locationId,
      },
    });
  }

  async watering(areas: Area[], location: Location) {
    return areas.map(async (area) => {
      const devices = await this.prisma.device.findMany({
        where: {
          areaId: area.id,
          deviceType: 'SENSOR',
        },
      });
      const latestData: LatestData = {};
      const currentTime = Date.now();
      devices.forEach((device) => {
        device.data.forEach((data) => {
          const key = (data.type.charAt(0).toLowerCase() +
            data.type.slice(1)) as keyof LatestData;
          const currentLatestTime =
            latestData[key] !== undefined ? latestData[key] : -Infinity;

          if (
            data.time > currentLatestTime &&
            currentTime - data.time <= 3600 * 1000
          ) {
            latestData[key] = data.data;
          }
        });
      });
      Logger.debug(
        'Latest data: ' + JSON.stringify(latestData),
        IrrigationService.name,
      );

      const predictResult = await this.predictService.predict(latestData);
      const irrigationSpeed =
        location?.setting?.dripRatePerHole *
        location?.setting?.totalHole;

      Logger.debug(
        'Predict result: ' + JSON.stringify(predictResult),
        IrrigationService.name,
      );
      if (predictResult?.prediction && irrigationSpeed) {
        const amount = predictResult.prediction * 1000;
        const time = amount / irrigationSpeed;
        await this.prisma.irrigation.create({
          data: {
            amount: amount,
            locationId: area.locationId,
            time: time,
          },
        });
        Logger.debug(
          'Irrigation scheduled for location: ' + area.locationId,
          IrrigationService.name,
        );
      }
    });
  }
}
