export type DeviceTemplate = {
  model: string;
  description?: string;
  year: number;
  deviceType: DeviceType;
  image?: File;
};

export interface DeviceTemplateModel {
  id: string;
  model: string;
  description?: string;
  year: number;
  deviceType: DeviceType;
  image?: string;
}

export type DeviceType = 'SENSOR' | 'LIGHT_BULB' | 'DOME' | 'VALVE';

export const deviceTypes: DeviceType[] = [
  'SENSOR',
  'LIGHT_BULB',
  'DOME',
  'VALVE',
];
