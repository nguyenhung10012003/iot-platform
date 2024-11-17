'use client';
import { Icons } from '@repo/ui/components/icons/icons';
import { Input } from '@repo/ui/components/ui/input';
import { Toggle } from '@repo/ui/components/ui/toggle';

export default function ScheduleChoose({
  minute,
  setMinute,
  hour,
  setHour,
  handleToggle,
}: {
  minute: number;
  setMinute: (value: number) => void;
  hour: number;
  setHour: (value: number) => void;
  handleToggle: (value: number) => void;
}) {
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-4 items-center">
        <span className="font-semibold text-lg">On:</span>
        <div className="flex items-center border-2 rounded-md py-1 px-2">
          <Icons.clock className="w-6 h-6 mr-2" />
          <Input
            id={'hour'}
            type="number"
            min={0}
            max={23}
            placeholder="hh"
            value={hour >= 10 ? `${hour}` : `0${hour}`}
            onChange={(e) => {
              const h = parseInt(e.target.value, 10);
              setHour(h > 23 ? 23 : h);
            }}
            className="h-auto p-0 w-6 text-lg bg-transparent border-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
          />
          <span className="text-lg text-gray-500">:</span>
          <Input
            id={'minute'}
            type="number"
            min={0}
            max={59}
            placeholder="mm"
            value={minute >= 10 ? `${minute}` : `0${minute}` }
            onChange={(e) => {
              const m = parseInt(e.target.value, 10);
              setMinute(m > 59 ? 59 : m);
            }}
            className="h-auto p-0 w-6 text-lg bg-transparent border-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
          />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Toggle
          onClick={(e) => handleToggle(0)}
          className="rounded-full py-1 text-[12px] h-auto"
          variant={'outline'}
        >
          Sunday
        </Toggle>
        <Toggle
          onClick={(e) => handleToggle(1)}
          className="rounded-full py-1 text-[12px] h-auto"
          variant={'outline'}
        >
          Monday
        </Toggle>
        <Toggle
          onClick={(e) => handleToggle(2)}
          className="rounded-full py-1 text-[12px] h-auto"
          variant="outline"
        >
          Tuesday
        </Toggle>
        <Toggle
          onClick={(e) => handleToggle(3)}
          className="rounded-full py-1 text-[12px] h-auto"
          variant="outline"
        >
          Wednesday
        </Toggle>
        <Toggle
          onClick={(e) => handleToggle(4)}
          className="rounded-full py-1 text-[12px] h-auto"
          variant="outline"
        >
          Thursday
        </Toggle>
        <Toggle
          onClick={(e) => handleToggle(5)}
          className="rounded-full py-1 text-[12px] h-auto"
          variant="outline"
        >
          Friday
        </Toggle>
        <Toggle
          onClick={(e) => handleToggle(6)}
          className="rounded-full py-1 text-[12px] h-auto"
          variant="outline"
        >
          Saturday
        </Toggle>
      </div>
    </div>
  );
}
