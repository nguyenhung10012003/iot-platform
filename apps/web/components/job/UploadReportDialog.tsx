import { Button } from '@repo/ui/components/ui/button';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
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
import { Download, Loader2, Trash2 } from 'lucide-react';
import React from 'react';
import { mutate } from 'swr';
import api from '../../config/api';
import { Job } from '../../types/job';
import UploadFileArea from '../UploadFileArea';

type Props = {
  job: Job;
  triggerBtn?: React.ReactNode;
  onUpload?: () => void;
};

/**
 * Component for uploading and managing job reports
 * @param {Props} props - Component props
 * @returns {JSX.Element} UploadReportDialog component
 */
export default function UploadReportDialog({
  job,
  triggerBtn,
  onUpload,
}: Props) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedReports, setSelectedReports] = React.useState<number[]>([]);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleUpload = (files: File[]) => {
    setFiles([...files]);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file as Blob);
      });

      await api.patch(`job/${job.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Report uploaded successfully');
      setFiles([]);
      onUpload?.();
      setIsLoading(false);
      setOpen(false);
    } catch (error) {
      toast.error('Failed to upload report');
      setIsLoading(false);
    }
  };

  const handleOpen = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setFiles([]);
      setSelectedReports([]);
    }
  };

  /**
   * Handles downloading a single report
   * @param {string} reportUrl - URL of the report to download
   */
  const handleDownloadReport = (reportUrl: string) => {
    window.open(reportUrl, '_blank');
  };

  /**
   * Handles downloading multiple selected reports
   */
  const handleBulkDownload = () => {
    selectedReports.forEach((index) => {
      const reportUrl = job.reports?.[index];
      if (reportUrl) {
        window.open(reportUrl.url, '_blank');
      }
    });
  };

  /**
   * Handles deleting multiple selected reports
   */
  const handleBulkDelete = async () => {
    try {
      const reports = job.reports?.filter(
        (_, i) => !selectedReports.includes(i),
      );
      await api.patch(`job/${job.id}`, {
        reports,
      });
      toast.success('Reports deleted successfully');
      mutate(`job/${job.id}`);
      onUpload?.();
      setSelectedReports([]);
    } catch (error) {
      toast.error('Failed to delete reports');
    }
  };

  /**
   * Handles toggling selection of a report
   * @param {number} index - Index of the report to toggle
   */
  const handleToggleReport = (index: number) => {
    setSelectedReports((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleDeleteReports = async (index: number) => {
    const reports = job.reports?.filter((_, i) => i !== index);
    try {
      await api.patch(`job/${job.id}`, {
        reports,
      });
      toast.success('Report deleted successfully');
      mutate(`job/${job.id}`);
      setSelectedReports((prev) => prev.filter((i) => i !== index));
      onUpload?.();
    } catch (error) {
      toast.error('Failed to delete report');
    }
  };

  return (
    <Dialog onOpenChange={handleOpen} open={open}>
      <DialogTrigger asChild>
        {triggerBtn || <Button variant="secondary">Upload Report</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reports for {job.title}</DialogTitle>
          <DialogDescription>
            Manage the reports for this job.
          </DialogDescription>

          <div className="pt-2 flex flex-col gap-4">
            <UploadFileArea
              onChange={handleUpload}
              onDrop={handleUpload}
              value={files}
              accept=".pdf,.doc,.docx"
            />

            <div className="pb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium h-10 flex items-center">Existing Reports</h3>
                {selectedReports.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkDownload}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Selected
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected{' '}
                      {isDeleting && (
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {job.reports &&
                  job.reports.map((report, index) => (
                    <div
                      key={index}
                      className="flex border items-center justify-between p-2 rounded-md hover:bg-gray-100 group"
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedReports.includes(index)}
                          onCheckedChange={() => handleToggleReport(index)}
                        />
                        <span className="text-sm">{report.name}</span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleDownloadReport(report.url)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive/80"
                          onClick={() => handleDeleteReports(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                {job.reports && job.reports.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No reports found for this job.
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleSave}
              disabled={files.length === 0 || isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
