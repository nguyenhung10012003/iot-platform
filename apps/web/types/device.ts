import { DeviceTemplateModel, DeviceType } from './device-template';

export type Device = {
  name: string;
  serialNumber: string;
  templateId: string;
  deviceType: DeviceType;
  areaId: string;
  gatewayId: string;
  topic: string;
};

type SensorData = {
  type: 'Temperature' | 'Humidity' | 'Rainfall' | 'Wind' | 'SoilMoisture';
  time: number;
  data: number;
};

export interface DeviceModel {
  id: string;
  name: string;
  serialNumber: string;
  templateId: string;
  online: boolean;
  template: DeviceTemplateModel;
  gatewayId?: string;
  areaId: string;
  deviceType: DeviceType;
  topic: string;
  data?: SensorData[];
}
