import { DeviceType, Prisma } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  @IsOptional()
  topic?: string;
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
