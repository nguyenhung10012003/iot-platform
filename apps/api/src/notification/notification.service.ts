import { Injectable } from '@nestjs/common';
import { Notification } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { NotificationGateway } from './notification.gateway';

export interface MessageEvent {
  userId: string;
  data: Notification;
}

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  // Gửi tin nhắn tới một userId cụ thể
  sendNotificationToUser(userId: string, message: Notification) {
    this.notificationGateway.sendNotification(userId, message);
  }

  // Gửi tin nhắn tới nhiều userId
  sendNotificationToUsers(userIds: string[], message: Notification) {
    this.notificationGateway.sendNotifications(userIds, message);
  }

  async getNotifications(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        sendToUserId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return notifications;
  }

  async createNotification({
    content,
    link,
    sendToUserId,
  }: {
    content: string;
    sendToUserId: string;
    link?: string;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        content,
        sendToUserId,
        link,
      },
    });

    return notification;
  }

  async markNotificationsAsRead(ids: string[]) {
    await this.prisma.notification.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status: 'READ',
      },
    });
  }
}
