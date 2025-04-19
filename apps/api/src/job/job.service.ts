import { Injectable, Logger } from '@nestjs/common';
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
      content: `${user?.name || user.username} {{assignJob}}: "${job.title}"`,
      sendToUserId: job.asigneeId,
    });

    this.notificationService.sendNotificationToUser(
      job.asigneeId,
      notification,
    );

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
      orderBy: {
        order: 'asc',
        // createdAt: 'asc',
      },
    });
  }

  async updateJob(id: string, data: UpdateJobDto, userId: string) {
    const oldJob = await this.prisma.job.findUnique({
      where: {
        id,
      },
    });
    const job = await this.prisma.job.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
      include: {
        location: true,
      }
    });

    if (data.status) {
      if (job.asigneeId === userId) {
        const user = await this.prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        const notification = await this.notificationService.createNotification({
          content: `${user?.name || user.username} {{updateStatusJob}}: "${job.title}" {{to}} "${job.status}"`,
          sendToUserId: job.creatorId,
          link: `/locations/${job.location.id}?tab=jobs`,
        });

        Logger.debug(`Notification: ${JSON.stringify(notification)}`);

        this.notificationService.sendNotificationToUser(
          job.creatorId,
          notification,
        );
      } else if (job.creatorId === userId) {
        const user = await this.prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        const notification = await this.notificationService.createNotification({
          content: `${user?.name || user.username} {{updateStatusJob}}: "${job.title}" {{to}} "${job.status}"`,
          sendToUserId: job.asigneeId,
          link: `/locations/${job.location.id}?tab=jobs`,
        });

        this.notificationService.sendNotificationToUser(
          job.asigneeId,
          notification,
        );
      }

      return job;
    }

    if (data.reports) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      const notification = await this.notificationService.createNotification({
        content: `${user?.name || user.username} {{addReportJob}}: "${job.title}"`,
        sendToUserId: job.creatorId,
        link: `/locations/${job.location.id}?tab=jobs`,
      });

      this.notificationService.sendNotificationToUser(
        job.creatorId,
        notification,
      );

      return job;
    }

    if (data.asigneeId !== oldJob.asigneeId) {
      const [oldAssignee, newAssignee, employer] = await Promise.all([
        this.prisma.user.findUnique({
          where: {
        id: oldJob.asigneeId,
          },
        }),
        this.prisma.user.findUnique({
          where: {
        id: job.asigneeId,
          },
        }),
        this.prisma.user.findUnique({
          where: {
        id: userId,
          },
        }),
      ]);

      const [notification, notification2] = await Promise.all([
        this.notificationService.createNotification({
          content: `${employer.name || employer.username} {{changeJob}} "${job.title}" {{to}} ${newAssignee.name || newAssignee.username}`,
          sendToUserId: oldJob.asigneeId,
          link: `/locations/${job.location.id}?tab=jobs`,
        }),
        this.notificationService.createNotification({
          content: `${employer.name || employer.username} {{changeJob}} "${job.title}" {{to}} {{you}}`,
          sendToUserId: job.asigneeId,
          link: `/locations/${job.location.id}?tab=jobs`,
        }),
      ]);

      await Promise.all([
        this.notificationService.sendNotificationToUser(
          oldJob.asigneeId,
          notification,
        ),
        this.notificationService.sendNotificationToUser(
          job.asigneeId,
          notification2,
        ),
      ]);
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
