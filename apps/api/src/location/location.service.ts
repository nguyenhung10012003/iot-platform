import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { AddUserToLocationDto } from './types/add-user-location.dto';
import { RemoveUserFromLocationDto } from './types/remove-user-location.dto';

@Injectable()
export class LocationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async getLocations(args: Prisma.LocationFindManyArgs) {
    return this.prisma.location.findMany(args);
  }

  async getJoinedLocations(userId: string) {
    const userLocation = await this.prisma.userLocation.findMany({
      where: { userId },
      select: { location: true },
    });
    return userLocation.map((ul) => ul.location);
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

  async addUserToLocation(data: AddUserToLocationDto) {
    return this.prisma.$transaction(async (prisma) => {
      const user = await this.userService.createUser({
        ...data,
        role: 'EMPLOYEE',
      });
      return prisma.userLocation.create({
        data: {
          role: 'EMPLOYEE',
          userId: user.id,
          locationId: data.locationId,
        },
      });
    });
  }

  async getUserLocations(args: Prisma.UserLocationFindManyArgs) {
    return this.prisma.userLocation.findMany(args);
  }

  async removeUserFromLocation(data: RemoveUserFromLocationDto) {
    return this.prisma.$transaction([
      this.prisma.userLocation.delete({
        where: {
          userId_locationId: {
            userId: data.userId,
            locationId: data.locationId,
          },
        },
      }),
      this.prisma.user.delete({ where: { id: data.userId } }),
    ]);
  }

  async deleteLocation(where: Prisma.LocationWhereUniqueInput) {
    return this.prisma.$transaction([
      this.prisma.area.deleteMany({ where: { locationId: where.id } }),
      this.prisma.location.delete({ where }),
    ]);
  }
}
