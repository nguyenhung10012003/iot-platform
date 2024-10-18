import { Injectable, Logger } from '@nestjs/common';
import { IClientOptions, MqttClient, connectAsync } from 'mqtt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MqttService {
  private client: Map<string, MqttClient> = new Map();
  constructor(private readonly prisma: PrismaService) {
    try {
      const gateways = prisma.gateway.findMany({
        include: {
          devicesConnected: true,
        },
      });
      gateways.then(async (gateways) => {
        await Promise.all(
          gateways.map(async (gateway) => {
            const client = await this.createClient(gateway.id, {
              username: gateway.auth?.username,
              password: gateway.auth?.password,
              port: gateway.port,
              host: gateway.host,
            });
            gateway.devicesConnected.forEach((device) => {
              this.subscribe(gateway.id, device.topic);
            });
          }),
        );
      });
    } catch (e) {
      Logger.error(e, 'MqttService');
    }
  }

  async createClient(id: string, options?: IClientOptions) {
    try {
      const client = await connectAsync({
        ...options,
        clientId: id,
        connectTimeout: 3000,
      });

      this.client.set(id, client);

      return client;
    } catch (e: any) {
      throw e;
    }
  }

  getClient(id: string) {
    return this.client.get(id);
  }

  async publish(id: string, topic: string, message: string) {
    const client = this.client.get(id);
    if (!client) {
      throw new Error('Client not found');
    }
    client.publish(topic, message);
  }

  async subscribe(id: string, topic: string) {
    const client = this.client.get(id);
    if (!client) {
      throw new Error('Client not found');
    }
    client.subscribe(topic);
  }

  async unsubscribe(id: string, topic: string) {
    const client = this.client.get(id);
    if (!client) {
      throw new Error('Client not found');
    }
    client.unsubscribe(topic);
  }

  async disconnect(id: string) {
    const client = this.client.get(id);
    if (!client) {
      throw new Error('Client not found');
    }
    client.end();
    this.client.delete(id);
  }
}
