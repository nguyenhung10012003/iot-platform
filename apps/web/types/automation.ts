import { SensorDataType } from "./device";

export type ConditionType = 'Schedule' | 'DeviceState' | 'Scene';
export type deviceStateConditionType = 'equal' | 'notEqual' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual' | 'between' | 'notBetween' | 'in' | 'notIn';

export type Condition = {
  type: ConditionType;
  cronCondition?: string;
  deviceStateCondition?: {
    dataType: SensorDataType;
    type: deviceStateConditionType;
    value: string;
  };
}

type Action = {
  type: 'TurnOn' | 'TurnOff' | 'SendEmail';
  toEmail?: string;
  title?: string;
  body?: string;
}

export interface AutomationModel {
  id: string;
  name: string;
  deviceId: string;
  locationId: string;
  condition: Condition;
  actions?: Action[];
}