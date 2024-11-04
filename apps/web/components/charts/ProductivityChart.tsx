'use client';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
  YAxis,
} from '@repo/ui/components/ui/chart';

export default function ProductivityChart() {
  const data = [
    { date: '2021-01-01', value: 1 },
    { date: '2021-01-02', value: 1.5 },
    { date: '2021-01-03', value: 1 },
    { date: '2021-01-04', value: 1.5 },
    { date: '2021-01-05', value: 1.7 },
    { date: '2021-01-06', value: 1.8 },
    { date: '2021-01-07', value: 2 },
    { date: '2021-01-08', value: 1.2 },
    { date: '2021-01-09', value: 1.3 },
    { date: '2021-01-10', value: 1.5 },
    { date: '2021-01-11', value: 2 },
  ];

  const chartConfig = {
    value: {
      label: 'Productivity (kg/ha)',
      color: 'hsl(var(--chart-2))',
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center gap-4 m-4">
      <h2 className="text-xl font-semibold">Productivity chart</h2>
      <ChartContainer config={chartConfig} className="max-h-[400px] w-full">
        <AreaChart data={data} accessibilityLayer>
          <XAxis dataKey="date" tickLine={false} tickMargin={10} />
          <YAxis dataKey="value" domain={[0, 2.5]} />
          <CartesianGrid vertical={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <defs>
            <linearGradient
              id="colorValueProductivity"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="hsl(var(--chart-2))"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--chart-2))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="value"
            type="natural"
            fill="url(#colorValueProductivity)"
            fillOpacity={0.4}
            stroke="hsl(var(--chart-2))"
            stackId={'a'}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
