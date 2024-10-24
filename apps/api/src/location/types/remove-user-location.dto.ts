import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class RemoveUserFromLocationDto {
  @IsString({ message: (value) => `${value.value} is not a valid location id` })
  @Type(() => String)
  locationId: string;
  @IsString()
  @Type(() => String)
  userId: string;
}
