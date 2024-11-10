import { DeviceType } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  topic: string;
  @IsString()
  name: string;
  @IsString()
  serialNumber: string;
  @IsString()
  areaId: string;
  @IsString()
  deviceType: DeviceType;
  @IsString()
  templateId: string;
  @IsString()
  gatewayId: string;
  @IsString()
  @IsOptional()
  description?: string;
}
