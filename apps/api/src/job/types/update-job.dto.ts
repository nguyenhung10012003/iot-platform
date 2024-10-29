import { IsIn, IsOptional, IsString } from 'class-validator';

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
  @IsIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  @IsString()
  @IsOptional()
  report?: string;
}
