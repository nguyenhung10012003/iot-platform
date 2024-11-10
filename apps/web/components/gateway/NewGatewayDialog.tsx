'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Icons } from '@repo/ui/components/icons/icons';
import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogClose,
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
import { GatewayForm } from '../../types/gateway';
import revalidate from '../../utils/action';
import NewGatewayForm from './NewGatewayForm';

export default function NewGatewayDialog({
  dictionary,
  triggerBtn,
}: DictionaryProps & { triggerBtn?: React.ReactNode }) {
  const formSchema = z.object({
    name: z.string({ message: dictionary.fieldIsRequired }),
    host: z.string({ message: dictionary.fieldIsRequired }),
    port: z.number({ message: dictionary.fieldIsRequired }).int().default(1883),
    description: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    areaId: z.string({ message: dictionary.fieldIsRequired }),
  });

  const form = useForm<GatewayForm>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: GatewayForm) => {
    try {
      const res = await api.post<any, { success: boolean }>('/gateway', data);
      if (res.success) {
        toast.success(dictionary.gatewayCreatedSuccessfully);
        setOpen(false);
      } else {
        toast.error(dictionary.canNotConnectToGateway);
      }
      await revalidate('gateways');
    } catch (error: any) {
      switch (error.error) {
        case 'DUPLICATE':
          toast.error(dictionary.gatewayAlreadyConnectedToAnotherLocation);
          break;
        default:
          toast.error(dictionary.errorOccurredWhileCreatingGateway);
      }
    }
  };

  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerBtn || (
          <Button>
            <Icons.plus className="w-5 h-5 mr-2" />
            {dictionary.newGateway}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dictionary.createNewGateway}</DialogTitle>
          <DialogDescription>
            {dictionary.fillOutGatewayDetails}
          </DialogDescription>
        </DialogHeader>

        <NewGatewayForm form={form} dictionary={dictionary} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">{dictionary.cancel}</Button>
          </DialogClose>

          <Button
            type="submit"
            form="new-gateway-form"
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            {dictionary.create}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
