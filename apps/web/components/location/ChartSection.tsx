'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import api from '../../config/api';
import { DeviceModel } from '../../types/device';
import { DictionaryProps } from '../../types/dictionary';
import Weather from '../charts/WeatherChart';

const fetcher = (url: string) =>
  api.get<any, DeviceModel[]>(url).then((res) => res);
export default function ChartSection({
  locationId,
  dictionary,
}: { locationId: string } & DictionaryProps) {
  const { data, isLoading } = useSWR(
    `/device?locationId=${locationId}`,
    fetcher,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const [deviceSelected, setDeviceSelected] = useState<DeviceModel | null>(
    null,
  );

  const chartsData = useMemo(
    () =>
      deviceSelected?.data?.reduce(
        (acc, { type, time, data }) => {
          const existingGroup = acc.find((group) => group.type === type);

          if (existingGroup) {
            existingGroup.datas.push({
              time: new Date(time).toLocaleString(),
              data,
            });
          } else {
            acc.push({
              type,
              datas: [{ time: new Date(time).toLocaleString(), data }],
            });
          }

          return acc;
        },
        [] as { type: string; datas: { data: number; time: string }[] }[],
      ),
    [deviceSelected],
  );

  return (
    <div className="flex flex-col">
      <Select
        onValueChange={(id) =>
          setDeviceSelected(data?.find((device) => device.id === id) || null)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Choose sensor" />
        </SelectTrigger>
        <SelectContent className="max-w-[200px]">
          {data?.map((device) => (
            <SelectItem value={device.id}>{device.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div>
        {chartsData?.map(({ type, datas }) => {
          return <Weather datas={datas} title={type} label={type} />;
        })}
      </div>
    </div>
  );
}
