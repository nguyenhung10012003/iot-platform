import { Injectable } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma.service';
import { CreateJobDto } from './types/create-job.dto';
import { UpdateJobDto } from './types/update-job.dto';

@Injectable()
export class JobService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async createJob(data: CreateJobDto, userId: string) {
    const job = await this.prisma.job.create({
      data: {
        ...data,
        creatorId: userId,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const notification = await this.notificationService.createNotification({
      content: `${user?.name || user.username} <t>assignJob</t>: "${job.title}"`,
      sendToUserId: job.asigneeId,
    })

    await this.notificationService.sendNotificationToUser(job.asigneeId, notification);

    return job;
  }

  async getJobs(data: { locationId?: string; asigneeId?: string }) {
    return this.prisma.job.findMany({
      where: {
        ...data,
      },
      include: {
        asignee: true,
      },
    });
  }

  async updateJob(id: string, data: UpdateJobDto, userId: string) {
    const job = await this.prisma.job.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    if (data.status) {
      if (job.asigneeId === 'userId') {
        const user = await this.prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        const notification = await this.notificationService.createNotification({
          content: `${user?.name || user.username} <t>updateStatusJob</t>: "${job.title}" <t>to</t> "${job.status}"`,
          sendToUserId: job.creatorId,
        })

        await this.notificationService.sendNotificationToUser(job.creatorId, notification);
      } else if (job.creatorId === userId) {
        const user = await this.prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        const notification = await this.notificationService.createNotification({
          content: `${user?.name || user.username} <t>updateStatusJob</t>: "${job.title}" <t>to</t> "${job.status}"`,
          sendToUserId: job.asigneeId,
        })

        await this.notificationService.sendNotificationToUser(job.asigneeId, notification);
      }
    }

    if (data.report) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      const notification = await this.notificationService.createNotification({
        content: `${user?.name || user.username} <t>addReportJob</t>: "${job.title}"`,
        sendToUserId: job.creatorId,
      })

      await this.notificationService.sendNotificationToUser(job.creatorId, notification);
    }

    return job;
  }

  async deleteJob(id: string) {
    return this.prisma.job.delete({
      where: {
        id,
      },
    });
  }
}
