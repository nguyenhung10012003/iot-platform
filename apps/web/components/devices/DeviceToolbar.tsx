'use client';

import { useState } from 'react';
import FacetedFilter from '../FacetedFilter';
import Searchbox from '../Searchbox';
import NewDeviceTemplateDialog from './NewDeviceTemplateDialog';

export default function DeviceToolbar() {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const onSelect = (values: string[] | undefined) => {
    setSelectedValues(values ?? []);
  };
  const options = [
    { label: 'Gateway', value: 'GATEWAY' },
    { label: 'Sensor', value: 'SENSOR' },
    { label: 'Light bulb', value: 'LIGHT_BULB' },
    { label: 'Dome', value: 'DOME' },
    { label: 'Valve', value: 'VALVE' },
  ];

  return (
    <div className="flex w-full justify-between">
      <div className="flex gap-4">
        <Searchbox boxClassName="bg-popover border shadow-sm shadow-primary/20 rounded-md" />
        <FacetedFilter
          title="Device Type"
          options={options}
          selectedValues={selectedValues}
          onSelect={onSelect}
        />
      </div>
      <NewDeviceTemplateDialog />
    </div>
  );
}
