export type DeviceTemplate = {
  model: string;
  description?: string;
  year: number;
  deviceType: DeviceType;
  image?: File;
};

export interface DeviceTemplateResponse {
  id: string;
  model: string;
  description?: string;
  year: number;
  deviceType: DeviceType;
  image?: string;
}

export type DeviceType = 'GATEWAY' | 'SENSOR' | 'LIGHT_BULB' | 'DOME' | 'VALVE';

export const deviceTypes: DeviceType[] = [
  'GATEWAY',
  'SENSOR',
  'LIGHT_BULB',
  'DOME',
  'VALVE',
];
