import { IsIn, IsString } from 'class-validator';

export class AddUserToLocationDto {
  @IsString()
  @IsIn(['EMPLOYEE', 'EMPLOYER'])
  role: 'EMPLOYEE' | 'EMPLOYER';
  @IsString()
  locationId: string;
  @IsString()
  username: string;
}
