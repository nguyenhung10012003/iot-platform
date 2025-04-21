import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GatewayCreateDto {
  @IsString()
  name: string;
  @IsString()
  host: string;
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
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
