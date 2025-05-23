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
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { toast } from '@repo/ui/components/ui/sonner';
import { Switch } from '@repo/ui/components/ui/switch';
import { useMemo, useState } from 'react';
import { DialogContent } from '../../../../packages/ui/src/components/ui/dialog';
import api from '../../config/api';
import {
  Action,
  AutomationModel,
  ConditionType,
  DeviceStateConditionType,
} from '../../types/automation';
import { SensorDataType } from '../../types/device';
import { parseCron, toCronString } from '../../utils/cron';
import AddActionDialog from './AddActionDialog';
import ChooseDevice from './ChooseDevice';
import ScheduleChoose from './ScheduleChoose';

type AutomationDialogProps = {
  locationId: string;
  triggerBtn?: React.ReactNode;
  automation?: AutomationModel;
  onSaved?: () => void;
}

export default function AutomationDialog({
  triggerBtn,
  automation,
  onSaved,
  locationId,
}: AutomationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(automation?.name);
  console.log(name);
  const [conditionType, setConditionType] = useState<ConditionType | undefined>(
    automation?.condition.type,
  );
  const [deviceStateConditionType, setDeviceStateConditionType] = useState<
    DeviceStateConditionType | undefined
  >(automation?.condition.deviceStateCondition?.type);
  const [deviceStateValue, setDeviceStateValue] = useState<string | undefined>(
    automation?.condition.deviceStateCondition?.value,
  );

  const [time, setTime] = useState(
    parseCron(automation?.condition.cronCondition || '0 12 * * *'),
  );
  const handleToggle = (value: number) => {
    if (time.days.includes(value)) {
      setTime({ ...time, days: time.days.filter((day) => day !== value) });
    } else {
      setTime({ ...time, days: [...time.days, value] });
    }
  };

  const [choosenDevice, setChoosenDevice] = useState<string | undefined>(
    automation?.deviceId,
  );
  const [actions, setActions] = useState<Action[]>(automation?.actions || []);
  const [dataType, setDataType] = useState<SensorDataType | undefined>(
    automation?.condition.deviceStateCondition?.dataType,
  );

  const handleOnSaveSchedule = async () => {
    let data;
    switch (conditionType) {
      case 'Schedule':
        data = {
          name: name || 'test',
          deviceId: choosenDevice,
          locationId: locationId,
          condition: {
            type: conditionType,
            cronCondition: toCronString(time.hour, time.minute, time.days),
          },
          actions: actions,
        };
        break;
      case 'DeviceState':
        data = {
          name: name || 'Automation',
          deviceId: choosenDevice,
          locationId: locationId,
          condition: {
            type: conditionType,
            deviceStateCondition: {
              dataType: dataType,
              type: deviceStateConditionType,
              value: deviceStateValue,
            },
          },
          actions: actions,
        };
        break;
      case 'Scene':
        data = {
          name: name || 'Automation',
          locationId: locationId,
          condition: {
            type: conditionType,
          },
          actions: actions,
        };
        break;
    }
    try {
      if (automation) {
        await api.patch(`automation/${automation.id}`, data);
        toast.success('Automation updated successfully');
      } else {
        await api.post('automation', data);
        toast.success('Automation created successfully');
      }
      setIsOpen(false);
    } catch (e) {
      console.error(e);
      toast.error('Failed to create/update automation');
    } finally {
      onSaved?.();
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setConditionType(automation?.condition.type);
      setName(automation?.name);
      setTime(parseCron(automation?.condition.cronCondition || '0 12 * * *'));
      setChoosenDevice(automation?.deviceId);
      setActions(automation?.actions || []);
      setDeviceStateValue(automation?.condition.deviceStateCondition?.value);
      setDeviceStateConditionType(
        automation?.condition.deviceStateCondition?.type,
      );
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
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <ScheduleChoose
            minute={time.minute}
            setMinute={(value) => setTime({ ...time, minute: value })}
            hour={time.hour}
            setHour={(value) => setTime({ ...time, hour: value })}
            handleToggle={handleToggle}
          />
          {/* <div className="flex gap-4 w-full flex-col sm:flex-row">
            <div className="flex flex-col gap-2 w-full">
              <Label>Choose device</Label>
              <ChooseDevice
                locationId={locationId}
                defaultValue={automation?.deviceId}
                onChange={(value) => setChoosenDevice(value)}
                deviceTypes={['LIGHT_BULB', 'DOME', 'VALVE']}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label>Turn on/off</Label>
              <Switch
                checked={actions.length > 0 && actions[0]?.type === 'TurnOn'}
                onCheckedChange={(checked) =>
                  checked
                    ? setActions([{ type: 'TurnOn' }])
                    : setActions([{ type: 'TurnOff' }])
                }
              />
            </div>
          </div> */}
          <div className="space-y-2">
            <Label>Actions</Label>
            {actions.map((action, index) => (
              <Card
                key={index}
                className="py-2 px-3 shadow-sm flex justify-between items-center"
              >
                <p>{action.type}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-1 h-8 w-8 rounded-full"
                  onClick={() => {
                    setActions((prev) => prev.filter((_, i) => i !== index));
                  }}
                >
                  <Icons.close className="w-5 h-5" />
                </Button>
              </Card>
            ))}
          </div>

          <AddActionDialog
            trigger={
              <Button className="w-full text-secondary-foreground bg-transparent border-2 border-dashed hover:bg-primary-foreground">
                Add Action
              </Button>
            }
            onAdd={(action) => {
              console.log(action);
              if (action) setActions((prev) => [...prev, action]);
            }}
            actionFilters={[
              {
                type: 'SendEmail',
                label: 'Send Email',
                description: 'Send an email',
              },
              {
                type: 'TurnOn',
                label: 'Turn On Device',
                description: 'Turn on the device',
              },
              {
                type: 'TurnOff',
                label: 'Turn Off Device',
                description: 'Turn off the device',
              },
              {
                type: 'Watering',
                label: 'Watering',
                description: 'Watering the plant',
              },
            ]}
          />
        </div>
      );
    if (conditionType === 'DeviceState')
      return (
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => {
                console.log(e.target.value);
                setName(e.target.value);
              }}
            />
          </div>
          <div className="flex gap-2 w-full justify-between items-center">
            <Label>Choose device</Label>
            <ChooseDevice
              value={choosenDevice}
              locationId={locationId}
              onChange={(value) => setChoosenDevice(value)}
              deviceTypes={['SENSOR']}
            />
          </div>
          <div className="flex gap-4 w-full flex-col sm:flex-row">
            <div className="flex flex-col gap-2 w-full">
              <Label>Choose Data Type</Label>
              <Select
                value={dataType}
                onValueChange={(value: SensorDataType) => setDataType(value)}
              >
                <SelectTrigger>
                  <SelectValue
                    defaultValue={dataType}
                    placeholder="Choose Data Type"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Temperature">Temperature</SelectItem>
                  <SelectItem value="Humidity">Humidity</SelectItem>
                  <SelectItem value="Rainfall">Rainfall</SelectItem>
                  <SelectItem value="Wind">Wind</SelectItem>
                  <SelectItem value="SoilMoisture">Soil Moisture</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label>Condition</Label>
              <Select
                onValueChange={(value: DeviceStateConditionType) =>
                  setDeviceStateConditionType(value)
                }
                value={deviceStateConditionType}
              >
                <SelectTrigger>
                  <SelectValue defaultValue={deviceStateConditionType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equal">Equal</SelectItem>
                  <SelectItem value="notEqual">Not Equal</SelectItem>
                  <SelectItem value="greaterThan">Greater Than</SelectItem>
                  <SelectItem value="lessThan">Less Than</SelectItem>
                  <SelectItem value="greaterThanOrEqual">
                    Greater Than or Equal
                  </SelectItem>
                  <SelectItem value="lessThanOrEqual">
                    Less Than or Equal
                  </SelectItem>
                  <SelectItem value="between">Between</SelectItem>
                  <SelectItem value="notBetween">Not Between</SelectItem>
                  <SelectItem value="in">In</SelectItem>
                  <SelectItem value="notIn">Not In</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-[100px]">
              <Label>Value</Label>
              <Input
                value={deviceStateValue}
                onChange={(e) => setDeviceStateValue(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Actions</Label>
            {actions.map((action, index) => (
              <Card
                key={index}
                className="py-2 px-3 shadow-sm flex justify-between items-center"
              >
                <p>{action.type}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-1 h-8 w-8 rounded-full"
                  onClick={() => {
                    setActions((prev) => prev.filter((_, i) => i !== index));
                  }}
                >
                  <Icons.close className="w-5 h-5" />
                </Button>
              </Card>
            ))}
          </div>

          <AddActionDialog
            trigger={
              <Button className="w-full text-secondary-foreground bg-transparent border-2 border-dashed hover:bg-primary-foreground">
                Add Action
              </Button>
            }
            onAdd={(action) => {
              console.log(action);
              if (action) setActions((prev) => [...prev, action]);
            }}
            actionFilters={[
              {
                type: 'SendEmail',
                label: 'Send Email',
                description: 'Send an email',
              },
              {
                type: 'TurnOn',
                label: 'Turn On Device',
                description: 'Turn on the device',
              },
              {
                type: 'TurnOff',
                label: 'Turn Off Device',
                description: 'Turn off the device',
              },
              {
                type: 'Watering',
                label: 'Watering',
                description: 'Watering the plant',
              }
            ]}
          />
        </div>
      );
    if (conditionType === 'Scene')
      return (
        <div className="flex gap-4 w-full  flex-col">
          <div>
            <Label className="mb-2">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Actions</Label>
            {actions.map((action, index) => (
              <Card
                key={index}
                className="py-2 px-3 shadow-sm flex justify-between items-center"
              >
                <p>{action.type}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-1 h-8 w-8 rounded-full"
                  onClick={() => {
                    setActions((prev) => prev.filter((_, i) => i !== index));
                  }}
                >
                  <Icons.close className="w-5 h-5" />
                </Button>
              </Card>
            ))}
          </div>
          <AddActionDialog
            trigger={
              <Button className="w-full text-secondary-foreground bg-transparent border-2 border-dashed hover:bg-primary-foreground">
                Add Action
              </Button>
            }
            onAdd={(action) => {
              console.log(action);
              if (action) setActions((prev) => [...prev, action]);
            }}
            actionFilters={[
              {
                type: 'TurnOn',
                label: 'Turn On Device',
                description: 'Turn on the device',
              },
              {
                type: 'TurnOff',
                label: 'Turn Off Device',
                description: 'Turn off the device',
              },
              {
                type: 'Watering',
                label: 'Watering',
                description: 'Watering the plant',
              }
            ]}
            allowAI={false}
          />
        </div>
      );
  }, [conditionType, actions, time, choosenDevice, deviceStateValue, name]);
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
