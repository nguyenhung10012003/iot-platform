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
import AddUserForm from './AddUserForm';

export default function AddUserLocationDialog({
  locationId,
  onAddUser,
}: {
  locationId: string;
  onAddUser: () => void;
}) {
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
      toast.success('User added to location');
      setOpen(false);
    } catch (error: any) {
      switch (error.error) {
        case 'DUPLICATE':
          toast.error(
            `Failed to add user. Username already exists`,
          );
          break;
        default:
          toast.error('Failed to add user');
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
      .string({ message: 'Field is required' })
      .min(4, { message: 'Username must be at least 4 characters' })
      .max(48, { message: 'Username must be at most 48 characters' }),
    password: z
      .string({ message: 'Field is required' })
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(32, { message: 'Password must be at most 32 characters' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create new user for location
          </DialogDescription>
        </DialogHeader>
        <AddUserForm form={form} onSubmit={handleAddUser} />
        <DialogFooter>
          <Button onClick={form.handleSubmit(handleAddUser)}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
