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
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Job, JobCreated, JobForm as JobFormType } from '../../types/job';
import JobForm from './JobForm';
import { DictionaryProps } from '../../types/dictionary';

type JobDialogProps = {
  job?: Job;
  trigger?: React.ReactNode;
  locationId: string;
  onSave: (job: Job | JobCreated) => void;
};

export default function JobDialog({
  job,
  onSave,
  locationId,
  trigger,
  dictionary,
}: JobDialogProps & DictionaryProps) {
  const formSchema = z.object({
    title: z.string({message: dictionary.fieldIsRequired}),
    description: z.string().optional(),
    asigneeId: z.string({message: dictionary.fieldIsRequired}),
  });

  const form = useForm<JobFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: job?.title,
      description: job?.description || '',
      asigneeId: job?.asigneeId,
    },
  });

  const onSubmit = (data: JobFormType) => {
    try {
      if (job) {
        onSave({
          ...job,
          ...data,
        });
      } else {
        onSave({
          ...data,
          locationId: locationId,
        });
      }
      setOpen(false);
    } catch (error) {}
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>{dictionary.createJob}</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{job ? dictionary.editJob : dictionary.createJob}</DialogTitle>
          <DialogDescription>
            {dictionary.fillInJobDetails}
          </DialogDescription>
        </DialogHeader>
        <JobForm form={form} locationId={locationId} dictionary={dictionary} />
        <DialogFooter>
          <Button variant="secondary" onClick={() => handleOpen(false)}>
            {dictionary.cancel}
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)}>{dictionary.save}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
