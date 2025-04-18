import { Type } from 'class-transformer';
import { IsArray, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { DeviceType } from './device-type';

export class UpdateDeviceTemplateDto {
  @IsString()
  @IsOptional()
  model: string;
  @IsNumber()
  @Type(() => Number)
  year: number;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsIn(['SENSOR', 'LIGHT_BULB', 'DOME', 'VALVE'])
  deviceType: DeviceType;
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  userIds?: string[];
}
