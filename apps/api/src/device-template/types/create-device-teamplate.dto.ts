import { Transform, Type } from 'class-transformer';
import { IsArray, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { DeviceType } from './device-type';

export class CreateDeviceTemplateDto {
  @IsString()
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
  @Transform(({ value }) =>
    Array.isArray(value) ? value : [value].filter(Boolean),
  )
  userIds?: string[];
}
