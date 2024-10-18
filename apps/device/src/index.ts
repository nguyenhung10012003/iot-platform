import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import { connectAsync, MqttClient } from 'mqtt';

dotenv.config();

const prisma = new PrismaClient({
  datasourceUrl: process.env.MONGODB_URI,
});

const app: Application = express();
app.use(express.json());

const clients = new Map<string, MqttClient>();

const createMqttClient = async (device: any) => {
  const client = await connectAsync({
    host: device.gateway.host,
    port: device.gateway.port,
    username: device.gateway?.auth?.username,
    password: device.gateway?.auth?.password,
    clientId: device.id,
  });

  client.on('connect', () => {});

  clients.set(device.id, client);
  return client;
};

const connectAllDevices = async (): Promise<void> => {
  const devices = await prisma.device.findMany({
    include: {
      gateway: true,
    },
  });

  await Promise.all(
    devices.map(async (device) => {
      await createMqttClient(device);
    }),
  );
};

const startApp = async (): Promise<void> => {
  try {
    await connectAllDevices();

    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  } catch (error) {
    console.error('Error starting the app:', error);
    process.exit(1);
  }
};

startApp();
