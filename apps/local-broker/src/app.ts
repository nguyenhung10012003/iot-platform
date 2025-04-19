import aedes, { Client, Subscription } from 'aedes';
import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import mqtt, { MqttClient } from 'mqtt';
import net from 'net';
import path from 'path';
import QRCode from 'qrcode';

const HTTP_PORT = 3002;
const MQTT_PORT = 1883;
const app = express();
const aedesServer = new aedes();

// Dữ liệu cảm biến mới nhất
interface SensorData {
  time: number;
  data: string | number;
}

const latestSensorData: Record<string, SensorData> = {};

// --- 1) HTTP server ---
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/qr-data', async (_req: Request, res: Response) => {
  const data = {
    host: 'localhost',
    port: 1883,
    clientId: 'esp8266',
  };
  try {
    const qr = await QRCode.toDataURL(JSON.stringify(data));
    res.json({ qr, url: JSON.stringify(data) });
  } catch {
    res.status(500).json({ error: 'Không tạo được mã QR' });
  }
});

const getLatestHandler: RequestHandler = (
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (!Object.keys(latestSensorData).length) {
    res.status(204).send();
    return;
  }
  res.json(latestSensorData);
};

app.get('/latest', getLatestHandler);

app.listen(HTTP_PORT, () => {
  console.log(`🟢 Express server tại http://localhost:${HTTP_PORT}`);
});

// --- 2) MQTT broker ---
const mqttServer = net.createServer(aedesServer.handle);
mqttServer.listen(MQTT_PORT, () => {
  console.log(`⚙️ Aedes MQTT broker lắng nghe cổng ${MQTT_PORT}`);
});

// --- 3) MQTT client ---
const mqttClient: MqttClient = mqtt.connect(`mqtt://localhost:${MQTT_PORT}`);

mqttClient.on('connect', () => {
  console.log('🔗 MQTT client kết nối thành công!');
  mqttClient.subscribe('esp8266/sensor', (err) => {
    if (err) console.error('❌ Subscribe lỗi:', err);
    else console.log('📡 Đang lắng nghe topic esp8266/sensor');
  });
});

mqttClient.on('message', (topic: string, message: Buffer) => {
  try {
    const { type, time, data } = JSON.parse(message.toString());
    if (type && time && data !== undefined) {
      latestSensorData[type] = { time, data };
      console.log(
        `✅ ${type}: ${data} @ ${new Date(time * 1000).toLocaleString()}`,
      );
      aedesServer.publish(
        {
          topic: `esp8266/sensor`,
          payload: JSON.stringify({ time, data }),
          cmd: 'publish',
          qos: 0,
          dup: false,
          retain: false,
        },
        () => {},
      );
    } else {
      console.warn('⚠️ Payload thiếu trường:', message.toString());
    }
  } catch (e) {
    console.error('❌ JSON không hợp lệ:', message.toString());
  }
});

// --- 4) Sự kiện MQTT broker ---
aedesServer
  .on('client', (client: Client) => {
    console.log(`👤 Client kết nối: ${client?.id}`);
  })
  .on('subscribe', (subscriptions: Subscription[], client: Client) => {
    subscriptions.forEach((sub) => {
      console.log(`📥 Client ${client?.id} subscribed to topic ${sub.topic}`);

      // Check if client subscribed to their connection confirmation topic
      if (sub.topic === `gateway/connected/${client?.id}`) {
        const welcomeMessage = {
          type: 'gateway/connected',
          time: Math.floor(Date.now() / 1000),
          data: {
            clientId: client?.id,
            status: 'connected',
            message: 'Gateway connected successfully',
          },
        };

        // Add 1 second delay before sending confirmation
        setTimeout(() => {
          aedesServer.publish(
            {
              topic: `gateway/connected/${client?.id}`,
              payload: JSON.stringify(welcomeMessage),
              qos: 0,
              retain: false,
              cmd: 'publish',
              dup: false,
            },
            () => {
              console.log(
                `📤 Gửi welcome message đến gateway/connected/${client?.id}`,
              );
            },
          );
        }, 1000);
      }
    });
  })
  .on('clientDisconnect', (client: Client) => {
    console.log(`❌ Client ngắt kết nối: ${client?.id}`);
  });

// aedesServer.on(
//   'publish' as any,
//   (packet: AedesPublishPacket, client?: Client): void => {
//     if (client) {
//       const { topic, payload } = packet;
//       const message = payload.toString();
//       console.log(
//         `📨 Nhận publish từ ${client.id}: topic=${topic}, message=${message}`,
//       );

//       try {
//         const data = JSON.parse(message);
//         console.log('📦 Payload:', data);
//       } catch {
//         console.warn('⚠️ Không phải JSON:', message);
//       }
//     }
//   },
// );
