'use client';
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
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { useDragDrop } from '../../../../packages/ui/src/hooks/use-drag-drop';
import { DeviceTemplate, deviceTypes } from '../../types/device-template';
import { DictionaryProps } from '../../types/dictionary';
import { useState } from 'react';
import { User } from '../../types/user';

type NewDeviceTemplateFormProps = {
  onSubmit: (data: DeviceTemplate) => void;
  form: UseFormReturn<DeviceTemplate>;
};

export default function NewDeviceTemplateForm({
  form,
  onSubmit,
  dictionary
}: NewDeviceTemplateFormProps & DictionaryProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1970 },
    (_, i) => currentYear - i,
  );
  const [users, setUsers] = useState<User[]>([]);

  const onDrop = (files: File[]) => {
    form.setValue('image', files[0]);
  };

  const [{ dragActive }, { handleDrag, handleDrop }] = useDragDrop(onDrop);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="model">{dictionary.modelName}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={dictionary.enterModelName}
                  id="model"
                  autoComplete={'false'}
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
              <FormLabel htmlFor="description">{dictionary.description}</FormLabel>
              <FormControl>
                <Textarea
                  id="description"
                  placeholder={dictionary.enterModelDescription}
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
            name="year"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{dictionary.year}</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(+value)}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={dictionary.selectYear} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deviceType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{dictionary.deviceType}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={dictionary.typeOfTheDevice} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {deviceTypes.map((deviceType) => (
                      <SelectItem key={deviceType} value={deviceType}>
                        {deviceType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel htmlFor="dropzone-file">
                <FormControl>
                  <div
                    className={`flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer ${
                      dragActive
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-300 bg-gray-50'
                    } hover:bg-gray-100`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Icons.upload
                        className="w-10 h-10 mb-3 text-gray-400"
                        aria-hidden="true"
                      />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">{dictionary.clickToUpload}</span>{' '}
                        {dictionary.orDragAndDrop}
                      </p>
                    </div>
                    <Input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                      {...rest}
                    />
                    {value && (
                      <div className="text-sm text-gray-500">
                        Selected file: {value.name}
                      </div>
                    )}
                  </div>
                </FormControl>
              </FormLabel>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {dictionary.save}
        </Button>
      </form>
    </Form>
  );
}
