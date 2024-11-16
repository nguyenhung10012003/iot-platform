import { Card } from '@repo/ui/components/ui/card';
import { Switch } from '@repo/ui/components/ui/switch';
import { useState } from 'react';
import api from '../../config/api';
import { DeviceModel } from '../../types/device';

export default function DeviceSwitcher({ device }: { device: DeviceModel }) {
  const [checked, setChecked] = useState(device.online);
  if (device.deviceType === 'SENSOR') return;
  return (
    <Card className="px-4 py-4">
      <h2 className="font-semibold mb-2 text-lg">{device.name}</h2>
      <Switch
        checked={checked}
        onCheckedChange={async (e: boolean) => {
          try {
            setChecked(e);
            await api.patch(`/device/${device.id}`, { online: e });
          } catch (e) {
            console.error(e);
            setChecked(!e);
          }
        }}
      />
    </Card>
  );
}
