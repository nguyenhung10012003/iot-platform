'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const [search, setSearch] = useState('');

  const options = [
    { label: dictionary.sensor, value: 'SENSOR' },
    { label: dictionary.lightBulb, value: 'LIGHT_BULB' },
    { label: dictionary.dome, value: 'DOME' },
    { label: dictionary.valve, value: 'VALVE' },
  ];
  const { selectedValues, onSelect } = useFilter(options);
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) {
      params.set('search', search);
    }
    if (selectedValues.length) {
      params.set('filter', selectedValues.join(','));
    }
    router.push(`?${params.toString()}`);
  }, [selectedValues, search]);

  return (
    <div className="flex gap-4">
      <Searchbox
        boxClassName="bg-popover border shadow-sm shadow-primary/20 rounded-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch('')}
      />
      {filter && (
        <FacetedFilter
          title={dictionary.deviceType}
          options={options}
          selectedValues={selectedValues}
          onSelect={onSelect}
          dictionary={dictionary}
        />
      )}
    </div>
  );
}
