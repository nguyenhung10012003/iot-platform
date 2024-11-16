import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateDeviceDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsOptional()
  topic?: string;
  @IsOptional()
  online?: boolean;
}