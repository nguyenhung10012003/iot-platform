import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { DeviceType } from './device-type';

export class createDeviceTemplateDto {
  @IsString()
  model: string;
  @IsNumber()
  @Type(() => Number)
  year: number;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsIn(['GATEWAY', 'SENSOR', 'LIGHT_BULB', 'DOME', 'VALVE'])
  deviceType: DeviceType;
}
