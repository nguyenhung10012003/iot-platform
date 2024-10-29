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
import React from 'react';
import api from '../../config/api';
import { Job } from '../../types/job';
import UploadFileArea from '../UploadFileArea';

type Props = {
  job: Job;
  triggerBtn?: React.ReactNode;
};

export default function UploadReportDialog({ job, triggerBtn }: Props) {
  const [file, setFile] = React.useState<File | null>(null);
  const [open, setOpen] = React.useState(false);
  const handleUpload = (file: File) => {
    setFile(file);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file as Blob);

      await api.patch(`job/${job.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Report uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload report');
    }
  };

  const handleOpen = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setFile(null);
    }
  };
  return (
    <Dialog onOpenChange={handleOpen} open={open}>
      <DialogTrigger asChild>
        {triggerBtn || <Button variant="secondary">Upload Report</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload report for job</DialogTitle>
          <DialogDescription>
            Drag and drop the report file here or click to select a file.
          </DialogDescription>

          <UploadFileArea
            onChange={handleUpload}
            onDrop={handleUpload}
            value={file}
            accept=".pdf,.doc,.docx"
          />

          <DialogFooter>
            <Button onClick={handleSave} disabled={!file}>
              Save
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
