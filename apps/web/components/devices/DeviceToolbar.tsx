'use client';

import { useFilter } from '../../hooks/useFilter';
import { DictionaryProps } from '../../types/dictionary';
import FacetedFilter from '../FacetedFilter';
import Searchbox from '../Searchbox';

type DevicetoolbarProps = {
  filter?: boolean;
};

export default function DeviceToolbar({
  filter = true,
  dictionary,
}: DevicetoolbarProps & DictionaryProps) {
  if (!filter) {
    return (
      <Searchbox boxClassName="bg-popover border shadow-sm shadow-primary/20 rounded-md" />
    );
  }
  const options = [
    { label: dictionary.sensor, value: 'SENSOR' },
    { label: dictionary.lightBulb, value: 'LIGHT_BULB' },
    { label: dictionary.dome, value: 'DOME' },
    { label: dictionary.valve, value: 'VALVE' },
  ];
  const { selectedValues, onSelect } = useFilter(options);

  return (
    <div className="flex gap-4">
      <Searchbox boxClassName="bg-popover border shadow-sm shadow-primary/20 rounded-md" />
      <FacetedFilter
        title={dictionary.deviceType}
        options={options}
        selectedValues={selectedValues}
        onSelect={onSelect}
        dictionary={dictionary}
      />
    </div>
  );
}
