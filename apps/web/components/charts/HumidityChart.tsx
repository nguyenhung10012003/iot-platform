'use client';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@repo/ui/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

export default function HumidityChart() {
  const data = [
    { date: '2021-01-01', value30cm: 0.4, value60cm: 0.6, value90cm: 0.8 },
    { date: '2021-01-02', value30cm: 0.6, value60cm: 0.3, value90cm: 0.6 },
    { date: '2021-01-03', value30cm: 0.7, value60cm: 0.5, value90cm: 0.9 },
    { date: '2021-01-04', value30cm: 0.8, value60cm: 0.9, value90cm: 1.2 },
    { date: '2021-01-05', value30cm: 0.5, value60cm: 1.2, value90cm: 0.2 },
    { date: '2021-01-06', value30cm: 0.3, value60cm: 1.6, value90cm: 0.4 },
    { date: '2021-01-07', value30cm: 0.1, value60cm: 1.2, value90cm: 1.1 },
    { date: '2021-01-08', value30cm: 0.2, value60cm: 1.3, value90cm: 1.4 },
  ];

  const chartConfig = {
    value30cm: {
      label: '30cm',
      color: 'hsl(var(--chart-1))',
    },
    value60cm: {
      label: '60cm',
      color: 'hsl(var(--chart-2))',
    },
    value90cm: {
      label: '90cm',
      color: 'hsl(var(--chart-3))',
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center gap-4 m-4">
      <h2 className="text-xl font-semibold">Humidity chart</h2>
      <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
        <LineChart data={data} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis domain={[0, 2]} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            dataKey={'value30cm'}
            type="monotone"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey={'value60cm'}
            type="monotone"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey={'value90cm'}
            type="monotone"
            stroke="hsl(var(--chart-3))"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
