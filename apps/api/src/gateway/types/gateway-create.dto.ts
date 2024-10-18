import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GatewayCreateDto {
  @IsString()
  name: string;
  @IsString()
  host: string;
  @IsNumber()
  port: number;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsOptional()
  username?: string;
  @IsString()
  @IsOptional()
  password?: string;
  @IsString()
  @IsOptional()
  token?: string;
  @IsString()
  areaId: string;
}
