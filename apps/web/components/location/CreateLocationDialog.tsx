'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { toast } from '@repo/ui/components/ui/sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import api from '../../config/api';
import { Location, LocationModel } from '../../types/location';
import revalidate from '../../utils/action';
import CreateLocationForm from './CreateLocationForm';

type CreateLocationDialogProps = {
  onCreate?: (location: LocationModel) => void;
  triggerBtn?: React.ReactNode;
};

export default function CreateLocationDialog({
  triggerBtn,
  onCreate,
}: CreateLocationDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const formSchema = z.object({
    name: z.string(),
    address: z.string(),
    image: z.instanceof(File).optional(),
  });

  const form = useForm<Location>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: Location) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('address', data.address);
      if (data.image) {
        formData.append('image', data.image);
      }

      const res = await api.post<any, LocationModel>('/location', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onCreate && onCreate(res);
      await revalidate('locations');
      toast.success('Location created successfully');
      setOpen(false);
    } catch (e) {
      toast.error('Failed to create location');
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerBtn ? triggerBtn : <Button>Create Location</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Location</DialogTitle>
          <DialogDescription>
            Fill in the form to create a new location
          </DialogDescription>
        </DialogHeader>
        <CreateLocationForm form={form} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
