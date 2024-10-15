import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class LocationQuery {
  @IsOptional()
  @Type(() => Boolean)
  includeArea?: boolean;
}
