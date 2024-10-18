import { AreaModel } from './location';

export type GatewayForm = {
  name: string;
  host: string;
  port: number;
  description?: string;
  username?: string;
  password?: string;
  areaId: string;
};

export interface GatewayModel {
  id: string;
  name: string;
  host: string;
  port: number;
  description?: string;
  auth?: {
    username?: string;
    password?: string;
    token?: string;
  };
  areaId: string;
  area: AreaModel;
}
