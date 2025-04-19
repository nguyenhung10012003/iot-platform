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
}: JobDialogProps) {
  const formSchema = z.object({
    title: z.string({message: 'Field is required'}),
    description: z.string().optional(),
    asigneeId: z.string({message: 'Field is required'}),
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
        {trigger || <Button>Create Job</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{job ? 'Edit Job' : 'Create Job'}</DialogTitle>
          <DialogDescription>
            Fill in job details
          </DialogDescription>
        </DialogHeader>
        <JobForm form={form} locationId={locationId} />
        <DialogFooter>
          <Button variant="secondary" onClick={() => handleOpen(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
