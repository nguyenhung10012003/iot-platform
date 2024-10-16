'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icons } from '@repo/ui/components/icons/icons';
import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';

import { toast } from '@repo/ui/components/ui/sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import api from '../../config/api';
import {
  DeviceTemplate,
  DeviceTemplateModel,
} from '../../types/device-template';
import NewDeviceTemplateForm from './NewDeviceTemplateForm';

export default function NewDeviceTemplateDialog() {
  const [open, setOpen] = useState(false);
  const formSchema = z.object({
    model: z.string().min(1),
    description: z.string().optional(),
    year: z.number(),
    deviceType: z.string(),
    image: z.instanceof(File).optional(),
  });

  const form = useForm<DeviceTemplate>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: DeviceTemplate) => {
    const formData = new FormData();
    formData.append('model', data.model);
    formData.append('description', data.description || '');
    formData.append('year', data.year.toString());
    formData.append('deviceType', data.deviceType);
    if (data.image) {
      formData.append('image', data.image);
    }

    try {
      await api.post<DeviceTemplateModel>('/device-template', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Device template created successfully');
    } catch (e) {
      toast.error('Failed to create device template');
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          form.reset();
        }
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button>
          <Icons.plus className="mr-2 h-5 w-5 max-w-[100px]" />
          New Template
        </Button>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogTitle>New Device Template</DialogTitle>
        <DialogDescription>Create new device template</DialogDescription>
        <NewDeviceTemplateForm form={form} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
