import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) {}

  async getLocations(args: Prisma.LocationFindManyArgs) {
    return this.prisma.location.findMany(args);
  }

  async createLocation(data: Prisma.LocationUncheckedCreateInput) {
    return this.prisma.location.create({
      data: {
        ...data,
        userLocations: {
          create: {
            role: 'EMPLOYER',
            userId: data.ownerId,
          },
        },
      },
      include: { areas: true },
    });
  }

  async addUserToLocation(data: {
    role: 'EMPLOYEE' | 'EMPLOYER';
    locationId: string;
    username: string;
  }) {
    const userToadd = await this.prisma.user.findUniqueOrThrow({
      where: { username: data.username },
    });
    return this.prisma.userLocation.create({
      data: {
        role: data.role,
        userId: userToadd.id,
        locationId: data.locationId,
      },
    });
  }

  async getUserLocations(args: Prisma.UserLocationFindManyArgs) {
    return this.prisma.userLocation.findMany(args);
  }

  async removeUserFromLocation(where: Prisma.UserLocationWhereUniqueInput) {
    return this.prisma.userLocation.delete({ where });
  }

  async deleteLocation(where: Prisma.LocationWhereUniqueInput) {
    return this.prisma.$transaction([
      this.prisma.area.deleteMany({ where: { locationId: where.id } }),
      this.prisma.location.delete({ where }),
    ]);
  }
}
