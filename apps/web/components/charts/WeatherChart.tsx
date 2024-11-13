'use client';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  CartesianGrid, Line, LineChart, XAxis, YAxis,
} from '@repo/ui/components/ui/chart';
import {  } from 'recharts';

export default function WeatherChart({title, datas, label, color} : {title: string, label: string, color?: string, datas: {time: string, data: number}[]}) {

  const chartConfig = {
    data: {
      label: label,
      color: color || 'hsl(var(--chart-1))',
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center gap-4 m-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
        <LineChart data={datas} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          {/* <ChartLegend content={<ChartLegendContent />} /> */}
          <Line
            dataKey={'data'}
            type="monotone"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
