import { AccessTokenGuard } from '@app/common/guards';
import { AuthenticatedRequest } from '@app/common/types';
import {
  Body,
  Controller,
  Get,
  Logger,
  MessageEvent,
  Param,
  Patch,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { Notification } from '@prisma/client';
import { map, Observable } from 'rxjs';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async getNotifications(
    @Req() req: AuthenticatedRequest,
  ): Promise<Notification[]> {
    return this.notificationService.getNotifications(req.user.userId);
  }

  @Patch('/mark-as-read')
  @UseGuards(AccessTokenGuard)
  async markAsRead(@Body() body: { ids: string[] }): Promise<void> {
    await this.notificationService.markNotificationsAsRead(body.ids);
  }
}
