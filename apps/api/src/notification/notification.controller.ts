import { AccessTokenGuard } from '@app/common/guards';
import { AuthenticatedRequest } from '@app/common/types';
import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { Notification } from '@prisma/client';
import { Response } from 'express';
import { NotificationService } from './notification.service';

@Controller('notifications')
@UseGuards(AccessTokenGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Sse(':userId')
  sendEvent(
    @Param('userId') userId: string,
    @Res() res: Response,
    @Req() req: AuthenticatedRequest,
  ): void {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    this.notificationService.addClient(userId, res);

    req.on('close', () => {
      this.notificationService.removeClient(userId, res);
    });
  }

  @Get()
  async getNotifications(
    @Req() req: AuthenticatedRequest,
  ): Promise<Notification[]> {
    return this.notificationService.getNotifications(req.user.userId);
  }
}
