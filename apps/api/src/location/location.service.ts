import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { SchedulerService } from 'src/scheduler/scheduler.service';
import { UserService } from 'src/user/user.service';
import { AddUserToLocationDto } from './types/add-user-location.dto';
import { RemoveUserFromLocationDto } from './types/remove-user-location.dto';

@Injectable()
export class LocationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly schedulerService: SchedulerService,
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
    const location = await this.prisma.location.create({
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

    if (location?.setting?.wateringMode) {
      this.schedulerService.addCronJob(
        `watering-${location.id}`,
        '* * */3 * * *',
        async () => {
          console.log('Watering plants');
        },
      );
    }

    return location;
  }

  async updateLocation(id: string, data: Prisma.LocationUncheckedUpdateInput) {
    const location = await this.prisma.location.update({
      where: { id },
      data,
    });

    if (location?.setting?.wateringMode) {
      this.schedulerService.addCronJob(
        `watering-${location.id}`,
        '* * */3 * * *',
        async () => {
          console.log('Watering plants');
        },
      );
    } else {
      this.schedulerService.removeCronJob(`watering-${location.id}`);
    }

    return location;
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
    return this.prisma.location.delete({ where });
  }
}
