import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateDeviceDto } from './types/create-device.dto';

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  async getDevices(args: Prisma.DeviceFindManyArgs) {
    return this.prisma.device.findMany(args);
  }

  async getDeviceById(id: string) {
    return this.prisma.device.findUnique({
      where: { id },
    });
  }

  async getDeviceByLocation({userId, locationId}:{userId: string, locationId: string}) {
    const location = await this.prisma.location.findUnique({
      where: {
        id: locationId,
      },
      include: {
        areas: {
          include: {
            devices: true,
          },
        }
      }
    })

    return location?.areas.flatMap(area => area.devices) || [];
  }

  async createDevice(data: CreateDeviceDto) {
    return this.prisma.device.create({
      data: {
        ...data,
        topic: data.topic || `device/${data.serialNumber}`,
      },
    });
  }

  async updateDevice(id: string, data: Prisma.DeviceUpdateInput) {
    return this.prisma.device.update({
      where: { id },
      data,
    });
  }

  async deleteDevice(id: string) {
    return this.prisma.device.delete({
      where: { id },
    });
  }
}
