import { useState } from 'react';

type Options = { label: string; value: string; icon?: React.ElementType }[];

export function useFilter(options: Options) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const onSelect = (values: string[] | undefined) => {
    setSelectedValues(values ?? []);
  };

  return {
    selectedValues,
    onSelect,
    options,
  };
}
