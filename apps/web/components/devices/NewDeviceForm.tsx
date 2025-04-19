import { Icons } from '@repo/ui/components/icons/icons';
import { Button } from '@repo/ui/components/ui/button';
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
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import useSWR from 'swr';
import api from '../../config/api';
import { Device } from '../../types/device';
import { GatewayModel } from '../../types/gateway';
import { LocationModel } from '../../types/location';
import NewGatewayDialog from '../gateway/NewGatewayDialog';
import SelectLocation from '../location/SelectLocation';

type NewDeviceFormProps = {
  form: UseFormReturn<Device>;
};

const fetcher = (url: string) =>
  api.get<any, GatewayModel[]>(url).then((res) => res);
export default function NewDeviceForm({ form }: NewDeviceFormProps) {
  const [location, setLocation] = useState<LocationModel | undefined>();
  const { data, isLoading } = useSWR(
    location ? `/gateway?locationId=${location?.id}` : `/gateway`,
    fetcher,
  );
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
          <FormItem className="w-1/2 flex flex-col">
            <FormLabel htmlFor="locationId" className="mb-2 mt-1">
              Location
            </FormLabel>
            <SelectLocation
              onSelect={(location) => {
                setLocation(location);
              }}
            />
          </FormItem>

          <FormField
            control={form.control}
            name="areaId"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel htmlFor="areaId">Area</FormLabel>
                <Select onValueChange={field.onChange} disabled={!location}>
                  <SelectTrigger>
                    <FormControl>
                      <SelectValue placeholder="Choose area" />
                    </FormControl>
                  </SelectTrigger>
                  <SelectContent>
                    {location?.areas?.map((area) => (
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
        </div>
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="gatewayId"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel htmlFor="gatewayId">Gateway</FormLabel>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger disabled={!location}>
                    <FormControl>
                      <SelectValue placeholder="Choose gateway" />
                    </FormControl>
                  </SelectTrigger>
                  <SelectContent>
                    {data?.map((gateway) => (
                      <SelectItem key={gateway.id} value={gateway.id}>
                        {gateway.name}
                      </SelectItem>
                    ))}
                    <SelectSeparator />
                    <NewGatewayDialog
                      triggerBtn={
                        <Button
                          variant={'secondary'}
                          className="w-full h-auto min-h-0 p-0 bg-transparent justify-start px-1"
                        >
                          <Icons.plus className="w-4 h-4 mr-2" />
                          New gateway
                        </Button>
                      }
                    />
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="topic">Topic</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter topic" id="topic" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
