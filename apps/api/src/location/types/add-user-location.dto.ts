import { IsString } from 'class-validator';

export class AddUserToLocationDto {
  @IsString()
  locationId: string;
  @IsString()
  username: string;
  @IsString()
  password: string;
}
