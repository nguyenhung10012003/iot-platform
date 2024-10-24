import { DeviceTemplateModel, DeviceType } from './device-template';

export type Device = {
  name: string;
  serialNumber: string;
  templateId: string;
  deviceType: DeviceType;
  areaId: string;
};

export interface DeviceModel {
  id: string;
  name: string;
  serialNumber: string;
  templateId: string;
  template: DeviceTemplateModel;
  gatewayId?: string;
  areaId: string;
  deviceType: DeviceType;
}
