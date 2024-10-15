import { Type } from 'class-transformer';
import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import { DeviceType } from './device-type';

export class GetDeviceTemplateQuery {
  @IsString()
  @Type(() => String)
  @IsOptional()
  q?: string;
  @IsArray()
  @IsOptional()
  @Type(() => String)
  @IsIn(['GATEWAY', 'SENSOR', 'LIGHT_BULB', 'DOME', 'VALVE'], { each: true })
  deviceType?: DeviceType[];
}
