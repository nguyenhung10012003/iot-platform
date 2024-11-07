'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { toast } from '@repo/ui/components/ui/sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import api from '../../config/api';
import { DictionaryProps } from '../../types/dictionary';
import AddUserForm from './AddUserForm';

export default function AddUserLocationDialog({
  locationId,
  onAddUser,
  dictionary,
}: {
  locationId: string;
  onAddUser: () => void;
} & DictionaryProps) {
  const [open, setOpen] = useState(false);

  const handleAddUser = async (data: {
    username: string;
    password: string;
  }) => {
    try {
      await api.post('location/user', {
        locationId: locationId,
        username: data.username,
        password: data.password,
      });
      onAddUser();
      toast.success(dictionary.userAddedToLocation);
      setOpen(false);
    } catch (error: any) {
      switch (error.error) {
        case 'DUPLICATE':
          toast.error(
            `${dictionary.failedToAddUser}. ${dictionary.usernameAlreadyExists}`,
          );
          break;
        default:
          toast.error(dictionary.failedToAddUser);
          break;
      }
    }
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    form.reset();
  };

  const formSchema = z.object({
    username: z
      .string({ message: dictionary.filedIsRequired })
      .min(4, { message: dictionary.usernameMustBeAtLeast4Characters })
      .max(48, { message: dictionary.usernameMustBeAtMost48Characters }),
    password: z
      .string({ message: dictionary.filedIsRequired })
      .min(6, { message: dictionary.passwordMustBeAtLeast6Characters })
      .max(32, { message: dictionary.passwordMustBeAtMost32Characters }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>{dictionary.addUser}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dictionary.addNewUser}</DialogTitle>
          <DialogDescription>
            {dictionary.createNewUserForLocation}
          </DialogDescription>
        </DialogHeader>
        <AddUserForm form={form} onSubmit={handleAddUser} dictionary={dictionary}/>
        <DialogFooter>
          <Button onClick={form.handleSubmit(handleAddUser)}>{dictionary.add}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
