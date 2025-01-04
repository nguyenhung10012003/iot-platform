'use client';

import { Icons } from '@repo/ui/components/icons/icons';
import { Card } from '@repo/ui/components/ui/card';
import { useMemo } from 'react';
import useSWR from 'swr';
import api from '../../config/api';
import { DeviceModel } from '../../types/device';
import { DictionaryProps } from '../../types/dictionary';
import { groupSensorData } from '../../utils/utils';
import Weather from '../charts/WeatherChart';
import DeviceSwitcher from './DeviceSwitcher';
import RadianCardChart from './RadianCardChart';

const fetcher = (url: string) =>
  api.get<any, DeviceModel[]>(url).then((res) => res);
const colors = {
  Temperature: 'hsl(var(--chart-1))',
  Humidity: 'hsl(var(--chart-2))',
  Rainfall: 'hsl(var(--chart-3))',
  Wind: 'hsl(var(--chart-4))',
  SoilMoisture: 'hsl(var(--chart-5))',
};
export default function ChartSection({
  locationId,
  dictionary,
}: { locationId: string } & DictionaryProps) {
  const { data, isLoading } = useSWR(
    `/device?locationId=${locationId}`,
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const chartsData = useMemo(() => groupSensorData(data || []), [data]);
  const { temperature, humidity, rainfall, wind, soilMoisture } =
    useMemo(() => {
      let temperature, humidity, rainfall, wind, soilMoisture;
      if (chartsData) {
        chartsData.forEach(({ type, datas }) => {
          switch (type) {
            case 'Temperature':
              temperature = datas[datas.length - 1]?.data;
              break;
            case 'Humidity':
              humidity = datas[datas.length - 1]?.data;
              break;
            case 'Rainfall':
              rainfall = datas[datas.length - 1]?.data;
              break;
            case 'Wind':
              wind = datas[datas.length - 1]?.data;
              break;
            case 'SoilMoisture':
              soilMoisture = datas[datas.length - 1]?.data;
              break;
          }
        });
      }
      return { temperature, humidity, rainfall, wind, soilMoisture };
    }, [chartsData]);

  return (
    <div className="flex flex-col gap-4 mt-2 pb-4">
      <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 mx-8">
        {data?.map((device) => {
          return <DeviceSwitcher key={device.id} device={device} />;
        })}
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 mx-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RadianCardChart
            chartConfig={{
              value: {
                label: 'Humidity (%)',
              },
            }}
            value={humidity || 0}
            title={
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Humidity</h2>
                <Icons.water className="w-6 h-6" />
              </div>
            }
          />
          <RadianCardChart
            chartConfig={{
              value: {
                label: 'Moisture (%)',
              },
            }}
            value={soilMoisture || 0}
            title={
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Soil Moisture</h2>
                <Icons.soil className="w-6 h-6" />
              </div>
            }
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2  grid-cols-1">
          <Card className="p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Temperature</h2>
              <Icons.temperature className="w-6 h-6" />
            </div>
            <span className="font-semibold">{temperature || 0}</span>
          </Card>
          <Card className="p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Wind</h2>
              <Icons.wind className="w-6 h-6" />
            </div>
            <span className="font-semibold">{wind || 0}</span>
          </Card>
          <Card className="p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Rainfall</h2>
              <Icons.rain className="w-6 h-6" />
            </div>
            <span className="font-semibold">{rainfall || 0}</span>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {chartsData?.map(({ type, datas }) => {
          return (
            <Weather
              key={type}
              datas={datas}
              title={type}
              label={type}
              color={colors[type as keyof typeof colors]}
            />
          );
        })}
      </div>
    </div>
  );
}
