import { Icons } from '@repo/ui/components/icons/icons';
import { Button } from '@repo/ui/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import useSWR from 'swr';
import api from '../../config/api';
import { LocationModel } from '../../types/location';
import CreateLocationDialog from './LocationDialog';
import { DictionaryProps } from '../../types/dictionary';

type SelectLocationProps = {
  onSelect: (location: LocationModel) => void;
};

const fetcher = (url: string) =>
  api.get<any, LocationModel[]>(url).then((res) => res);
export default function SelectLocation({ onSelect, dictionary }: SelectLocationProps & DictionaryProps) {
  const { data, error, isLoading, mutate } = useSWR(
    '/location?includeArea=true',
    fetcher,
  );

  if (isLoading) {
    return;
  }

  const onValueChange = (value: string) => {
    onSelect(data?.find((location) => location.id === value) as LocationModel);
  };
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Choose location" />
      </SelectTrigger>
      <SelectContent>
        {data?.map((location) => (
          <SelectItem key={location.id} value={location.id}>
            {location.name}
          </SelectItem>
        ))}
        <SelectSeparator />
        <CreateLocationDialog
          dictionary={dictionary}
          onSave={(location) => {
            onSelect(location);
            mutate();
          }}
          triggerBtn={
            <Button
              variant={'secondary'}
              className="w-full h-auto min-h-0 p-0 bg-transparent justify-start px-1"
            >
              <Icons.plus className="w-4 h-4 mr-2" />
              Create locations
            </Button>
          }
        />
      </SelectContent>
    </Select>
  );
}
