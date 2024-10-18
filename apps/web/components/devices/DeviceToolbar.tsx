'use client';

import { useFilter } from '../../hooks/useFilter';
import FacetedFilter from '../FacetedFilter';
import Searchbox from '../Searchbox';

type DevicetoolbarProps = {
  filter?: boolean;
};

export default function DeviceToolbar({ filter = true }: DevicetoolbarProps) {
  if (!filter) {
    return (
      <Searchbox boxClassName="bg-popover border shadow-sm shadow-primary/20 rounded-md" />
    );
  }
  const options = [
    { label: 'Sensor', value: 'SENSOR' },
    { label: 'Light bulb', value: 'LIGHT_BULB' },
    { label: 'Dome', value: 'DOME' },
    { label: 'Valve', value: 'VALVE' },
  ];
  const { selectedValues, onSelect } = useFilter(options);

  return (
    <div className="flex gap-4">
      <Searchbox boxClassName="bg-popover border shadow-sm shadow-primary/20 rounded-md" />
      <FacetedFilter
        title="Device Type"
        options={options}
        selectedValues={selectedValues}
        onSelect={onSelect}
      />
    </div>
  );
}
