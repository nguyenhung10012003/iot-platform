import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Device } from '../../types/device';
import { LocationModel } from '../../types/location';
import SelectLocation from '../location/SelectLocation';

type NewDeviceFormProps = {
  form: UseFormReturn<Device>;
};

export default function NewDeviceForm({ form }: NewDeviceFormProps) {
  const [location, setLocation] = useState<LocationModel | undefined>();
  return (
    <Form {...form}>
      <form className="space-y-3" autoComplete="off">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Device name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter device name" id="name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="serialNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="serialNumber">Serial number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter serial number"
                  id="serialNumber"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormItem className="w-full flex flex-col">
            <FormLabel htmlFor="locationId" className="mb-2 mt-1">
              Location
            </FormLabel>
            <SelectLocation onSelect={setLocation} />
          </FormItem>

          {location && (
            <FormField
              control={form.control}
              name="areaId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel htmlFor="areaId">Area</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <FormControl>
                        <SelectValue placeholder="Choose area" />
                      </FormControl>
                    </SelectTrigger>
                    <SelectContent>
                      {location.areas?.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </form>
    </Form>
  );
}
