import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Notification } from '@prisma/client';

@WebSocketGateway({transports: ['websocket']})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, string>(); // Lưu userId và socketId

  handleConnection(client: Socket) {
    Logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    Logger.debug(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.connectedClients.set(userId, client.id);
    Logger.debug(`User ${userId} registered with socket ${client.id}`);
  }

  sendNotification(userId: string, message: Notification) {
    const socketId = this.connectedClients.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', message);
      Logger.debug(
        `Sent notification to ${userId}: ${JSON.stringify(message)}`,
      );
    } else {
      Logger.debug(`User ${userId} is not connected`);
    }
  }

  sendNotifications(userIds: string[], message: Notification) {
    userIds.forEach((userId) => {
      this.sendNotification(userId, message);
    });
  }
}
