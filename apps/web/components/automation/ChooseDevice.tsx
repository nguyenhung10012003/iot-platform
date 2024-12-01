'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import useSWR from 'swr';
import api from '../../config/api';
import { DeviceModel } from '../../types/device';
import { DeviceType } from '../../types/device-template';
import { DictionaryProps } from '../../types/dictionary';

const fetcher = (url: string) =>
  api.get<any, DeviceModel[]>(url).then((res) => res);
export default function ChooseDevice({
  locationId,
  defaultValue,
  onChange,
  value,
  dictionary,
  deviceTypes,
}: {
  locationId: string;
  defaultValue?: string;
  value?: string;
  onChange: (value: string) => void;
  deviceTypes?: DeviceType[];
} & DictionaryProps) {
  const { data } = useSWR(`/device?locationId=${locationId}`, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder="Choose device" defaultValue={defaultValue} />
      </SelectTrigger>
      <SelectContent>
        {data
          ?.filter((device) =>
            deviceTypes?.includes(device.deviceType),
          )
          .map((device) => (
            <SelectItem value={device.id}>{device.name}</SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
