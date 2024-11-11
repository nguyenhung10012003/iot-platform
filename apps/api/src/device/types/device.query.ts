import { IsString } from 'class-validator';
import { GetDeviceTemplateQuery } from 'src/device-template/types/get-device-template.query';

export class DeviceQuery extends GetDeviceTemplateQuery {
  @IsString()
  locationId: string;
}
