import { IsOptional, IsString } from "class-validator";

export class CreateLocationDto {
  @IsString()
  name: string;
  @IsString()
  address: string;
  @IsString()
  @IsOptional()
  areaName?: string;
}