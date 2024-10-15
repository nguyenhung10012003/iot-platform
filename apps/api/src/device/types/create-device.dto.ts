import { DeviceType } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class CreateDeviceDto {
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
  @IsOptional()
  gatewayId?: string;
}
