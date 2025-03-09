import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { NotificationService } from "./notification.service";
import { NotificationController } from "./notification.controller";
import { NotificationGateway } from "./notification.gateway";

@Module({
  controllers: [NotificationController],
  providers: [PrismaService, NotificationService, NotificationGateway],
  exports: [NotificationService],
})
export class NotificationModule {}