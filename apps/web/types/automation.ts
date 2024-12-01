import { SensorDataType } from './device';

export type ConditionType = 'Schedule' | 'DeviceState' | 'Scene';
export type DeviceStateConditionType =
  | 'equal'
  | 'notEqual'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'between'
  | 'notBetween'
  | 'in'
  | 'notIn';

export type Condition = {
  type: ConditionType;
  cronCondition?: string;
  deviceStateCondition?: {
    dataType: SensorDataType;
    type: DeviceStateConditionType;
    value: string;
  };
};

export type ActionType = 'TurnOn' | 'TurnOff' | 'SendEmail';

export type Action = {
  type: ActionType;
  deviceId?: string;
  toEmail?: string;
  title?: string;
  body?: string;
};

export interface AutomationModel {
  id: string;
  name: string;
  deviceId: string;
  locationId: string;
  condition: Condition;
  actions?: Action[];
}
