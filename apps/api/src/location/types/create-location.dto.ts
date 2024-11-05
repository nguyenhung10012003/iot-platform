import { Transform } from 'class-transformer';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  name: string;
  @IsString()
  address: string;
  @IsString()
  @IsOptional()
  areaName?: string;
  @IsObject()
  @Transform(({ value }) => JSON.parse(value))
  setting: {
    capacity: number;
    area: number;
    disPerRow: number;
    disPerHole: number;
    fertilizerLevel: number;
    totalHole: number;
    dripRatePerHole: number;
    wateringMode: boolean;
  };
}
