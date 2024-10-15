import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) {}

  async getLocations(args: Prisma.LocationFindManyArgs) {
    return this.prisma.location.findMany(args);
  }

  async createLocation(
    data: Prisma.LocationCreateInput | Prisma.LocationUncheckedCreateInput,
  ) {
    return this.prisma.location.create({ data, include: { areas: true } });
  }

  async deleteLocation(where: Prisma.LocationWhereUniqueInput) {
    return this.prisma.$transaction([
      this.prisma.area.deleteMany({ where: { locationId: where.id } }),
      this.prisma.location.delete({ where }),
    ]);
  }
}
