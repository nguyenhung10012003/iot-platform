import { IsArray, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  title?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsOptional()
  asigneeId?: string;
  @IsString()
  @IsOptional()
  @IsIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  @IsNumber()
  @IsOptional()
  order?: number;
  @IsArray()
  @IsOptional()
  reports?: {
    url: string;
    name: string;
  }[];
}
