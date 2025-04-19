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
import { Textarea } from '@repo/ui/components/ui/textarea';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DictionaryProps } from '../../types/dictionary';
import { GatewayForm } from '../../types/gateway';
import { LocationModel } from '../../types/location';
import SelectLocation from '../location/SelectLocation';

type NewGatewayFormProps = {
  form: UseFormReturn<GatewayForm>;
};

export default function NewGatewayForm({
  form,
  dictionary,
}: NewGatewayFormProps & DictionaryProps) {
  const [location, setLocation] = useState<LocationModel | undefined>();
  return (
    <Form {...form}>
      <form className="space-y-3" autoComplete="off">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">{dictionary.gatewayName}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={dictionary.enterGatewayName}
                  id="name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="description">
                {dictionary.description}
              </FormLabel>
              <FormControl>
                <Textarea
                  id="description"
                  placeholder={dictionary.enterGatewayDescription}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="host"
            render={({ field }) => (
              <FormItem className="w-3/4">
                <FormLabel htmlFor="host">{dictionary.host}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={dictionary.enterGatewayHost}
                    id="host"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="port"
            render={({ field }) => (
              <FormItem className="w-1/4">
                <FormLabel htmlFor="port">{dictionary.port}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="1883"
                    id="port"
                    defaultValue={1883}
                    onChange={(e) => field.onChange(+e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor="username">
                  {dictionary.gatewayUsername}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={dictionary.enterGatewayUsername}
                    id="username"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor="port">
                  {dictionary.gatewayPassword}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder={dictionary.enterGatewayPassword}
                    id="password"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4">
          <FormItem className="w-1/2 flex flex-col">
            <FormLabel htmlFor="locationId" className="mb-2 mt-1">
              {dictionary.locations}
            </FormLabel>
            <SelectLocation onSelect={setLocation} />
          </FormItem>

          <FormField
            control={form.control}
            name="areaId"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel htmlFor="areaId">{dictionary.area}</FormLabel>
                <Select onValueChange={field.onChange} disabled={!location}>
                  <SelectTrigger>
                    <FormControl>
                      <SelectValue placeholder={dictionary.selectArea} />
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
      </form>
    </Form>
  );
}
