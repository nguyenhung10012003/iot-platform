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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { GatewayForm } from '../../types/gateway';
import NewGatewayForm from './NewGatewayForm';

export default function NewGatewayDialog() {
  const formSchema = z.object({
    name: z.string(),
    host: z.string(),
    port: z.number().int().default(1883),
    description: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    areaId: z.string(),
  });

  const form = useForm<GatewayForm>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: GatewayForm) => {
    console.log(data);
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
        <Button>
          <Icons.plus className="w-5 h-5 mr-2" />
          New Gateway
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new gateway</DialogTitle>
          <DialogDescription>
            Fill out the form to create your new gateway
          </DialogDescription>
        </DialogHeader>

        <NewGatewayForm form={form} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>

          <Button
            type="submit"
            form="new-gateway-form"
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
