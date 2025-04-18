'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { useUser } from '../../hooks/useUser';
import { Job } from '../../types/job';
import { useState } from 'react';
type JobKanbanDialogProps = {
  job: Job;
  trigger: React.ReactNode;
};

export default function JobKanbanDialog({
  job,
  trigger,
}: JobKanbanDialogProps) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{job.title}</DialogTitle>
          <DialogDescription>{job.description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
