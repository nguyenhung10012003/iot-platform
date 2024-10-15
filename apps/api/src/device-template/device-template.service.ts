import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DeviceTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async getDeviceTemplates(args: Prisma.DeviceTemplateFindManyArgs) {
    return this.prisma.deviceTemplate.findMany(args);
  }

  async getDeviceTemplateById(id: string) {
    return this.prisma.deviceTemplate.findUnique({
      where: { id },
    });
  }

  async createDeviceTemplate(data: Prisma.DeviceTemplateCreateInput) {
    return this.prisma.deviceTemplate.create({ data });
  }

  async updateDeviceTemplate(
    id: string,
    data: Prisma.DeviceTemplateUpdateInput,
  ) {
    return this.prisma.deviceTemplate.update({
      where: { id },
      data,
    });
  }

  async deleteDeviceTemplate(id: string) {
    return this.prisma.deviceTemplate.delete({
      where: { id },
    });
  }
}
