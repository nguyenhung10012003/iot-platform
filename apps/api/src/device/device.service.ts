import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { MqttService } from 'src/mqtt/mqtt.service';
import { PrismaService } from 'src/prisma.service';
import { CreateDeviceDto } from './types/create-device.dto';
import { SensorData } from './types/sensor-data';

@Injectable()
export class DeviceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mqtt: MqttService,
  ) {}

  async getDevices(args: Prisma.DeviceFindManyArgs) {
    return this.prisma.device.findMany(args);
  }

  async getDeviceById(id: string) {
    return this.prisma.device.findUnique({
      where: { id },
    });
  }

  async getDeviceByLocation({
    userId,
    locationId,
  }: {
    userId: string;
    locationId: string;
  }) {
    const location = await this.prisma.location.findUnique({
      where: {
        id: locationId,
      },
      include: {
        areas: {
          include: {
            devices: true,
          },
        },
      },
    });

    return location?.areas.flatMap((area) => area.devices) || [];
  }

  async createDevice(data: CreateDeviceDto) {
    const device = await this.prisma.device.create({
      data: {
        ...data,
        topic: data.topic || `device/${data.serialNumber}`,
      },
    });

    if (data.topic) {
      this.mqtt.subscribe(
        data.gatewayId,
        data.topic,
        async (topic, message: SensorData) => {
          await this.prisma.device.update({
            where: { id: device.id },
            data: {
              data: {
                push: {
                  type: message.type,
                  time: message.time,
                  data: message.data,
                },
              },
            },
          });
        },
      );
    }
    return device;
  }

  async updateDevice(id: string, data: Prisma.DeviceUpdateInput) {
    const device = await this.prisma.device.update({
      where: { id },
      data,
    });

    if (data.topic) {
      this.mqtt.subscribe(
        device.gatewayId,
        device.topic,
        (topic, message: SensorData) => {
          this.prisma.device.update({
            where: { id: device.id },
            data: {
              data: {
                push: {
                  type: message.type,
                  time: message.time,
                  data: message.data,
                },
              },
            },
          });
        },
      );
    }
  }

  async deleteDevice(id: string) {
    return this.prisma.device.delete({
      where: { id },
    });
  }
}
