import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Condition {
  @IsString()
  type: 'Schedule' | 'DeviceState' | 'Scene';

  @IsString()
  @IsOptional()
  cronCondition?: string;

  @IsObject()
  @IsOptional()
  deviceStateCondition?: {
    dataType: 'Temperature' | 'Humidity' | 'Rainfall' | 'Wind' | "SoilMoisture";
    type:
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
    value: string;
  };
}

class Action {
  @IsString()
  type: 'TurnOn' | 'TurnOff' | 'SendEmail';
  @IsOptional()
  @IsString()
  deviceId?: string;
  @IsOptional()
  @IsString()
  toEmail?: string;
  @IsOptional()
  @IsString()
  title?: string;
  @IsOptional()
  @IsString()
  body?: string;
}

export class CreateAutomationDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsString()
  locationId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Condition)
  condition: Condition;

  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => Action)
  @IsOptional()
  actions?: Action[];
}
