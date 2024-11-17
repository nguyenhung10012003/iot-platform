'use client';
import { Icons } from '@repo/ui/components/icons/icons';
import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { Label } from '@repo/ui/components/ui/label';
import { toast } from '@repo/ui/components/ui/sonner';
import { Switch } from '@repo/ui/components/ui/switch';
import { useMemo, useState } from 'react';
import { DialogContent } from '../../../../packages/ui/src/components/ui/dialog';
import api from '../../config/api';
import { AutomationModel, ConditionType } from '../../types/automation';
import { DictionaryProps } from '../../types/dictionary';
import { toCronString } from '../../utils/cron';
import ChooseDevice from './ChooseDevice';
import ScheduleChoose from './ScheduleChoose';

type AutomationDialogProps = {
  locationId: string;
  triggerBtn?: React.ReactNode;
  automation?: AutomationModel;
  onSaved?: () => void;
} & DictionaryProps;

export default function AutomationDialog({
  triggerBtn,
  automation,
  onSaved,
  locationId,
  dictionary,
}: AutomationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(automation?.name);
  const [conditionType, setConditionType] = useState<ConditionType | undefined>(
    automation?.condition.type,
  );

  const [minute, setMinute] = useState(0);
  const [hour, setHour] = useState(12);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const handleToggle = (value: number) => {
    if (daysOfWeek.includes(value)) {
      setDaysOfWeek(daysOfWeek.filter((day) => day !== value));
    } else {
      setDaysOfWeek([...daysOfWeek, value]);
    }
  };

  const [choosenDevice, setChoosenDevice] = useState<string | undefined>();
  const [turnOn, setTurnOn] = useState(false);

  const handleOnSaveSchedule = async () => {
    const data = {
      name: name || 'test',
      deviceId: choosenDevice,
      locationId: locationId,
      condition: {
        type: conditionType,
        cronCondition: toCronString(hour, minute, daysOfWeek),
      },
      actions: [
        {
          type: turnOn ? 'TurnOn' : 'TurnOff',
        },
      ],
    };
    try {
      await api.post('automation', data);
      setIsOpen(false);
      toast.success('Automation created successfully');
    } catch (e) {
      console.error(e);
      toast.error('Failed to create automation');
    } finally {
      onSaved?.();
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setConditionType(undefined);
      // setName('');
      // setMinute(0);
      // setHour(12);
      // setDaysOfWeek([]);
      // setChoosenDevice(undefined);
      // setTurnOn(true);
    }
  };

  const formBody = useMemo(() => {
    if (!conditionType)
      return (
        <div className="flex flex-col gap-4">
          <Card
            className="flex p-4 gap-4 items-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
            onClick={() => setConditionType('Schedule')}
          >
            <Icons.clock className="h-14 w-14" />
            <div>
              <h2 className="text-lg font-semibold">Schedule</h2>
              <p className="text-gray-500 text-sm">
                Run this automation on a schedule
              </p>
            </div>
          </Card>
          <Card
            className="flex p-4 gap-4 items-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
            onClick={() => setConditionType('DeviceState')}
          >
            <Icons.cpu className="h-14 w-14" />
            <div>
              <h2 className="text-lg font-semibold">Device State</h2>
              <p className="text-gray-500 text-sm">
                Run this automation based on device state
              </p>
            </div>
          </Card>
          <Card
            className="flex p-4 gap-4 items-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
            onClick={() => setConditionType('Scene')}
          >
            <Icons.command className="h-14 w-14" />
            <div>
              <h2 className="text-lg font-semibold">Scene</h2>
              <p className="text-gray-500 text-sm">
                Run this automation based on a scene
              </p>
            </div>
          </Card>
        </div>
      );
    if (conditionType === 'Schedule') 
      return (
        <div className="mt-4 space-y-4">
        <ScheduleChoose
          minute={minute}
          setMinute={setMinute}
          hour={hour}
          setHour={setHour}
          handleToggle={handleToggle}
        />
        <div className="flex gap-4 w-full flex-col sm:flex-row">
          <div className="flex flex-col gap-2 w-full">
            <Label>Choose device</Label>
            <ChooseDevice
              locationId={locationId}
              defaultValue={automation?.deviceId}
              onChange={(value) => setChoosenDevice(value)}
              dictionary={dictionary}
              deviceTypes={['LIGHT_BULB', 'DOME', 'VALVE']}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Label>Turn on/off</Label>
            <Switch checked={turnOn} onCheckedChange={setTurnOn} />
          </div>
        </div>
      </div>)
    if (conditionType === 'DeviceState') return <div>Device State</div>;
    if (conditionType === 'Scene') return <div>Scene</div>;
  }, [conditionType]);
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerBtn || <Button>Create Automation</Button>}
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {automation ? 'Edit Automation' : 'Create Automation'}
          </DialogTitle>
        </DialogHeader>
        {formBody}
        <DialogFooter>
          <Button variant="secondary" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleOnSaveSchedule()}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
