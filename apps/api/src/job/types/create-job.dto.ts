import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  locationId: string;
  @IsString()
  @IsOptional()
  asigneeId?: string;
  @IsNumber()
  @IsOptional()
  order?: number;
}
