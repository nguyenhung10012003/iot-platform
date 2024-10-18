import { Injectable, Logger } from '@nestjs/common';
import { MqttService } from 'src/mqtt/mqtt.service';
import { PrismaService } from 'src/prisma.service';
import { GatewayCreateDto } from './types/gateway-create.dto';

@Injectable()
export class GatewayService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mqttService: MqttService,
  ) {}

  async createGateway(data: GatewayCreateDto) {
    const gateway = await this.prisma.gateway.create({
      data: {
        name: data.name,
        host: data.host,
        port: data.port,
        description: data.description,
        auth: {
          username: data.username,
          password: data.password,
          token: data.token,
        },
        areaId: data.areaId,
      },
    });
    try {
      await this.mqttService.createClient(gateway.id, {
        username: gateway.auth?.username,
        password: gateway.auth?.password,
        port: gateway.port,
        host: gateway.host,
      });
    } catch (e) {
      Logger.error(e, 'GatewayService');
      await this.prisma.gateway.delete({
        where: { id: gateway.id },
      });
      return { success: false, message: 'Failed to connect to the gateway' };
    }

    return { success: true };
  }

  async getGatewaysForUser(userId: string) {
    const location =  await this.prisma.area.findMany({
      where: {
        location: {
          ownerId: userId,
        },
      },
      select: {
        gateways: true,
      },
    });
    return location.map((area) => area.gateways).flat();
  }
}
