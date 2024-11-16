import { DeviceModel } from '../types/device';

export function groupSensorData(
  devices: DeviceModel[],
): { type: string; datas: { time: string; data: number }[] }[] {
  const groupedData: Record<string, { time: string; data: number }[]> = {};

  devices.forEach((device) => {
    if (device.data) {
      device.data.forEach((sensorData) => {
        if (!groupedData[sensorData.type]) {
          groupedData[sensorData.type] = [];
        }
        groupedData[sensorData.type]?.push({
          time: new Date(sensorData.time).toLocaleString(),
          data: sensorData.data,
        });
      });
    }
  });

  return Object.entries(groupedData).map(([type, datas]) => ({
    type,
    datas,
  }));
}
