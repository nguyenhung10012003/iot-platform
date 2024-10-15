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

  async getDeviceByUser(userId: string) {
    //TODO: Implement this method
  }

  async createDevice(data: CreateDeviceDto) {
    return this.prisma.device.create({ data });
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
