import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IClientOptions, MqttClient, connectAsync } from 'mqtt';
import { SensorData } from 'src/device/types/sensor-data';
import { PrismaService } from 'src/prisma.service';

type MqttServiceClient<T = any> = {
  client: MqttClient;
  callbacks?: { callback: (topic: string, message: T) => Promise<void>; key: string }[];
};

@Injectable()
export class MqttService implements OnModuleInit {
  private client: Map<string, MqttServiceClient> = new Map();
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
          gateway.devicesConnected.forEach(async (device) => {
            await this.subscribe<SensorData>(
              gateway.id,
              device.topic,
              gateway.id,
              async (topic, message: SensorData) => {
                try {
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
                } catch (e) {
                  Logger.error(e, 'MqttService');
                }
              },
            );
          });
          this.onMessage(gateway.id);
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

      this.client.set(id, { client, callbacks: [] });
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
    const { client } = this.client.get(id);
    if (!client) {
      throw new Error('Client not found');
    }
    client.publish(topic, message);
  }

  async subscribe<T>(
    id: string,
    topic: string,
    callbackKey?: string,
    callback?: (topic: string, message: T) => Promise<void>,
  ) {
    const client = this.client.get(id);
    if (!client) {
      throw new Error('Client not found');
    }
    client.client.subscribe(topic);
    if (client.callbacks) {
      client.callbacks.push({ callback: callback, key: callbackKey });
    } else {
      client.callbacks = [{ callback: callback, key: callbackKey }];
    }
    Logger.log(`Client id: ${id} Subscribed to ${topic}`, 'MqttService');
  }

  async onMessage<T>(id: string) {
    const client = this.client.get(id);
    if (!client) {
      throw new Error('Client not found');
    }
    client.client.on('message', async (topic, message) => {
      const callbacks = client.callbacks || [];
      await Promise.all(callbacks.map(async (cb) => {
        await cb.callback(topic, JSON.parse(message.toString()));
      }));
      Logger.debug(
        `Client id: ${id} Received message ${message} from topic: ${topic}`,
        'MqttService',
      );
    });
  }

  async addCallback<T>(
    id: string,
    callbackKey: string,
    callback: (topic: string, message: T) => Promise<void>,
  ) {
    const client = this.client.get(id);
    if (!client) {
      throw new Error('Client not found');
    }
    if (!client.callbacks) {
      client.callbacks = [];
    }
    client.callbacks?.push({ callback, key: callbackKey });
    Logger.debug(
      `Client id: ${id} Added callback with key: ${callbackKey}`,
      'MqttService',
    );
  }

  async removeCallback(id: string, callbackKey: string) {
    const client = this.client.get(id);
    if (!client) {
      throw new Error('Client not found');
    }
    Logger.debug(
      `Client id: ${id} Removed callback with key: ${callbackKey}`,
      'MqttService',
    );
    client.callbacks = client.callbacks?.filter((cb) => cb.key !== callbackKey);
  }

  async unsubscribe(id: string, topic: string) {
    const client = this.client.get(id);
    if (!client) {
      throw new Error('Client not found');
    }
    client.client.unsubscribe(topic);
    client.callbacks = [];
    Logger.log(`Client id: ${id} Unsubscribed to ${topic}`, 'MqttService');
  }

  async disconnect(id: string) {
    const { client } = this.client.get(id);
    if (!client) {
      return;
    }
    client.end();
    this.client.delete(id);
    Logger.log(`Client id: ${id} Disconnected`, 'MqttService');
  }
}
