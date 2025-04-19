'use client';
import { Icons } from '@repo/ui/components/icons/icons';
import { Badge } from '@repo/ui/components/ui/badge';
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
import { Label } from '@repo/ui/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import useSWR from 'swr';
import { useDragDrop } from '../../../../packages/ui/src/hooks/use-drag-drop';
import api from '../../config/api';
import { DeviceTemplate, deviceTypes } from '../../types/device-template';
import { DictionaryProps } from '../../types/dictionary';
import { User } from '../../types/user';

type NewDeviceTemplateFormProps = {
  onSubmit: (data: DeviceTemplate) => void;
  form: UseFormReturn<DeviceTemplate>;
  usersInTemplate?: User[];
};

const fetcher = (url: string) => api.get<any, User[]>(url).then((res) => res);

export default function NewDeviceTemplateForm({
  form,
  onSubmit,
  dictionary,
  usersInTemplate,
}: NewDeviceTemplateFormProps & DictionaryProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1970 },
    (_, i) => currentYear - i,
  );
  const { data: users } = useSWR('/user', fetcher);
  const [selectedUsers, setSelectedUsers] = useState<User[]>(
    usersInTemplate || [],
  );
  const [searchUser, setSearchUser] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const onDrop = (files: File[]) => {
    form.setValue('image', files[0]);
  };

  useEffect(() => {
    if (searchUser.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchUser]);

  useEffect(() => {
    if (selectedUsers.length > 0) {
      form.setValue(
        'userIds',
        selectedUsers.map((user) => user.id),
      );
    }
  }, [selectedUsers]);

  const onUserSelect = (user: User) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      return;
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchUser('');
    setIsOpen(false);
  };

  const searchedUsers = useMemo(() => {
    if (!users) return [];
    return users?.filter(
      (user) =>
        (user.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchUser.toLowerCase())) &&
        user.role === 'USER',
    );
  }, [users, searchUser]);

  const onRemoveUser = (user: User) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
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
              <FormLabel htmlFor="description">
                {dictionary.description}
              </FormLabel>
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
                  <SelectContent className="w-full max-w-[460px]">
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
        <div className="gap-2 flex flex-col relative">
          <Label>Thêm người dùng</Label>
          {selectedUsers.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {selectedUsers.map((user) => (
                <Badge key={user.id} className="flex items-center gap-2 px-1.5">
                  {user.name || user.username}
                  <X
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => onRemoveUser(user)}
                  />
                </Badge>
              ))}
            </div>
          )}
          <Input
            type="text"
            placeholder="Tên người dùng"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            onFocus={() => setIsOpen(true)}
            // onBlur={() => setIsOpen(false)}
          />
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-10">
              {!searchedUsers?.length && (
                <div className="py-6 text-center text-muted-foreground">
                  No results found.
                </div>
              )}

              {searchedUsers?.length > 0 && (
                <div className="max-h-[220px] overflow-y-auto py-2">
                  <div className="text-xs font-medium text-muted-foreground px-3 py-1.5">
                    Results
                  </div>
                  <ul>
                    {searchedUsers?.map((user) => (
                      <li
                        key={user.id}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
                        onClick={() => onUserSelect(user)}
                      >
                        <div>
                          <p className="font-medium">
                            {user.name || user.username}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
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
                        <span className="font-semibold">
                          {dictionary.clickToUpload}
                        </span>{' '}
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
