import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IClientOptions, MqttClient, connectAsync } from 'mqtt';
import { SensorData } from 'src/device/types/sensor-data';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MqttService implements OnModuleInit {
  private client: Map<string, MqttClient> = new Map();
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    try {
      const gateways = await this.prisma.gateway.findMany({
        include: {
          devicesConnected: true,
        },
      });

      await Promise.all(
        gateways.map(async (gateway) => {
          const client = await this.createClient(gateway.id, {
            username: gateway.auth?.username,
            password: gateway.auth?.password,
            port: gateway.port,
            host: gateway.host,
            protocol: gateway.port === 1883 ? 'mqtt' : 'mqtts',
          });
          gateway.devicesConnected.forEach((device) => {
            this.subscribe<SensorData>(
              gateway.id,
              device.topic,
              async (topic, message: SensorData) => {
                const newDevice = await this.prisma.device.update({
                  where: { id: device.id },
                  data: {
                    data: {
                      push: {
                        type: message.type,
                        time: message.time,
                        data: message.data,
                      },
                    },
                  },
                });
              },
            );
          });
        }),
      );
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
      Logger.log(`Client id: ${id} Connected`, 'MqttService');

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

  async subscribe<T>(
    id: string,
    topic: string,
    callback?: (topic: string, message: T) => void,
  ) {
    const client = this.client.get(id);
    if (!client) {
      throw new Error('Client not found');
    }
    client.subscribe(topic);
    client.on('message', (topic, message) => {
      console.log(message.toString());
      callback?.(topic, JSON.parse(message.toString()));
    });

    Logger.log(`Client id: ${id} Subscribed to ${topic}`, 'MqttService');
  }

  async onMessage<T>(
    id: string,
    callback: (topic: string, message: T) => void,
  ) {
    const client = this.client.get(id);
    if (!client) {
      throw new Error('Client not found');
    }
    client.on('message', (topic, message) => {
      callback(topic, JSON.parse(message.toString()));
    });
  }

  async unsubscribe(id: string, topic: string) {
    const client = this.client.get(id);
    if (!client) {
      throw new Error('Client not found');
    }
    client.unsubscribe(topic);
    Logger.log(`Client id: ${id} Unsubscribed to ${topic}`, 'MqttService');
  }

  async disconnect(id: string) {
    const client = this.client.get(id);
    if (!client) {
      return;
    }
    client.end();
    this.client.delete(id);
    Logger.log(`Client id: ${id} Disconnected`, 'MqttService');
  }
}
