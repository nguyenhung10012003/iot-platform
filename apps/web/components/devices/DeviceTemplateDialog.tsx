'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icons } from '@repo/ui/components/icons/icons';
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
import {
  DeviceTemplate,
  DeviceTemplateModel,
} from '../../types/device-template';
import { DictionaryProps } from '../../types/dictionary';
import revalidate from '../../utils/action';
import NewDeviceTemplateForm from './DeviceTemplateForm';

export default function DeviceTemplateDialog({
  dictionary,
  template,
  trigerBtn,
}: DictionaryProps & {
  template?: DeviceTemplateModel;
  trigerBtn?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const formSchema = z.object({
    model: z.string({ message: dictionary.fieldIsRequired }),
    description: z.string().optional(),
    year: z.number({ message: dictionary.fieldIsRequired }),
    deviceType: z.string({ message: dictionary.fieldIsRequired }),
    image: z.instanceof(File).optional(),
    userIds: z.array(z.string()).optional(),
  });

  const form = useForm<DeviceTemplate>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: template?.model,
      description: template?.description,
      year: template?.year,
      deviceType: template?.deviceType,
    },
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
    if (data.userIds) {
      data.userIds.forEach((userId) => {
        formData.append('userIds', userId);
      });
    }

    try {
      if (template) {
        await api.patch<DeviceTemplateModel>(
          `/device-template/${template.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        toast.success(dictionary.deviceTemplateUpdated);
      } else {
        await api.post<DeviceTemplateModel>('/device-template', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success(dictionary.deviceTemplateCreatedSuccessfully);
      }
      revalidate('device-templates');
      setOpen(false);
      form.reset();
    } catch (e) {
      if (template) {
        toast.error(dictionary.failedToUpdateDeviceTemplate);
        return;
      }
      toast.error(dictionary.failedToCreateDeviceTemplate);
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
        {trigerBtn || (
          <Button>
            <Icons.plus className="mr-2 h-5 w-5 max-w-[100px]" />
            {dictionary.newDeviceTemplate}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(event) => {
          event.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{dictionary.newDeviceTemplate}</DialogTitle>
          <DialogDescription>
            {dictionary.createNewDeviceTemplate}
          </DialogDescription>
        </DialogHeader>
        <NewDeviceTemplateForm
          form={form}
          onSubmit={onSubmit}
          dictionary={dictionary}
        />
      </DialogContent>
    </Dialog>
  );
}
