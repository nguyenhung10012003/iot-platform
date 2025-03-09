import { Injectable } from '@nestjs/common';
import { Notification } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  private clients = new Map<string, Array<any>>();

  addClient(userId: string, res: any) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, []);
    }
    this.clients.get(userId).push(res);
  }

  removeClient(userId: string, res: any) {
    if (this.clients.has(userId)) {
      this.clients.set(
        userId,
        this.clients.get(userId).filter((client) => client !== res),
      );
      if (this.clients.get(userId).length === 0) {
        this.clients.delete(userId);
      }
    }
  }

  async sendNotificationToUser(userId: string, notification: Notification) {
    if (this.clients.has(userId)) {
      this.clients.get(userId).forEach((res) => {
        res.write(`data: ${JSON.stringify(notification)}\n\n`);
      });
    }
  }

  async getNotifications(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        sendToUserId: userId,
      },
    });

    return notifications;
  }

  async createNotification({
    content,
    sendToUserId,
  }: {
    content: string;
    sendToUserId: string;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        content,
        sendToUserId,
      },
    });

    return notification;
  }
}
