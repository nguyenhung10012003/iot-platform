'use client';
import { Badge } from '@repo/ui/components/ui/badge';
import { Input } from '@repo/ui/components/ui/input';
import { Column, KanbanBoard } from '@repo/ui/components/ui/kanban';
import { Separator } from '@repo/ui/components/ui/separator';
import { toast } from '@repo/ui/components/ui/sonner';
import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import JobDialog from '../../../../../../components/job/JobDialog';
import UploadReportDialog from '../../../../../../components/job/UploadReportDialog';
import { UserAvatarGroup } from '../../../../../../components/user/UserAvatarGroup';
import api from '../../../../../../config/api';
import useDebounce from '../../../../../../hooks/useDebounce';
import { useUser } from '../../../../../../hooks/useUser';
import { Job, JobCreated, JobStatus } from '../../../../../../types/job';
const fetcher = async (url: string) =>
  api.get<any, Job[]>(url).then((res) => res);

interface JobKanbanBoardProps {
  locationId: string;
  dictionary: any;
}

const JobItem = ({ job }: { job: Job }) => {
  const { user } = useUser();

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col px-3 py-3 gap-1">
        <div className="flex justify-between gap-2">
          <h4 className="text-lg font-medium line-clamp-1 text-ellipsis cursor-pointer w-full">
            {job.title}
          </h4>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 text-ellipsis">
          {job.description}
        </p>
      </div>
      <Separator className="my-1" />
      <div className="flex gap-2 justify-between px-3 py-2">
        <UserAvatarGroup
          users={job.asignee ? [job.asignee] : []}
          maxAvatars={3}
          size="sm"
        />
        <div className="flex gap-2">
          <UploadReportDialog
            job={job}
            triggerBtn={
              <div className="flex gap-1 items-center">
                <FileText className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">
                  {job.reports?.length || 0}
                </span>
              </div>
            }
            onUpload={() => mutate(`job?locationId=${job.locationId}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default function JobKanbanBoard({
  locationId,
  dictionary,
}: JobKanbanBoardProps) {
  const { data, isLoading, error, mutate } = useSWR(
    `job?locationId=${locationId}`,
    fetcher,
  );

  const [columns, setColumns] = useState<Column[]>([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (data) {
      const jobByStatus = data.reduce(
        (acc, job) => {
          if (job.title.toLowerCase().includes(debouncedSearch.toLowerCase())) {
            acc[job.status] = [...(acc[job.status] || []), job];
          }
          return acc;
        },
        {} as Record<JobStatus, Job[]>,
      );

      setColumns([
        {
          id: 'PENDING',
          title: 'Pending',
          header: (
            <div className="flex items-center gap-2 justify-between rounded-md p-2 bg-amber-100">
              <div className="flex gap-1 items-center ">
                <span className="text-md font-semibold text-amber-800">
                  Pending
                </span>
                <Badge
                  className={`bg-amber-300 rounded-full px-1.5 py-0.5 text-xs font-medium text-amber-800 border-none hover:bg-amber-400`}
                >
                  {jobByStatus.PENDING?.length || 0}
                </Badge>
              </div>
            </div>
          ),
          items:
            jobByStatus.PENDING?.map((job) => ({
              id: job.id,
              columnId: job.status,
              content: <JobItem job={job} />,
            })) || [],
        },
        {
          id: 'IN_PROGRESS',
          title: 'In Progress',
          header: (
            <div className="flex items-center gap-2 justify-between rounded-md p-2 bg-blue-100">
              <div className="flex gap-1 items-center ">
                <span className="text-md font-semibold text-blue-800">
                  In Progress
                </span>
                <Badge
                  className={`bg-blue-300 rounded-full px-1.5 py-0.5 text-xs font-medium text-blue-800 border-none hover:bg-blue-400`}
                >
                  {jobByStatus.IN_PROGRESS?.length || 0}
                </Badge>
              </div>
            </div>
          ),
          items:
            jobByStatus.IN_PROGRESS?.map((job) => ({
              id: job.id,
              columnId: job.status,
              content: <JobItem job={job} />,
            })) || [],
        },
        {
          id: 'COMPLETED',
          title: 'Completed',
          header: (
            <div className="flex items-center gap-2 justify-between rounded-md p-2 bg-green-100">
              <div className="flex gap-1 items-center ">
                <span className="text-md font-semibold text-green-800">
                  Completed
                </span>
                <Badge
                  className={`bg-green-300 rounded-full px-1.5 py-0.5 text-xs font-medium text-green-800 border-none hover:bg-green-400`}
                >
                  {jobByStatus.COMPLETED?.length || 0}
                </Badge>
              </div>
            </div>
          ),
          items:
            jobByStatus.COMPLETED?.map((job) => ({
              id: job.id,
              columnId: job.status,
              content: <JobItem job={job} />,
            })) || [],
        },
        {
          id: 'CANCELLED',
          title: 'Cancelled',
          header: (
            <div className="flex items-center gap-2 justify-between rounded-md p-2 bg-red-100">
              <div className="flex gap-1 items-center ">
                <span className="text-md font-semibold text-red-800">
                  Cancelled
                </span>
                <Badge
                  className={`bg-red-300 rounded-full px-1.5 py-0.5 text-xs font-medium text-red-800 border-none hover:bg-red-400`}
                >
                  {jobByStatus.CANCELLED?.length || 0}
                </Badge>
              </div>
            </div>
          ),
          items:
            jobByStatus.CANCELLED?.map((job) => ({
              id: job.id,
              columnId: job.status,
              content: <JobItem job={job} />,
            })) || [],
        },
      ]);
    }
  }, [data, debouncedSearch]);

  const handleOnSaveJob = async (jobData: JobCreated) => {
    try {
      if (!data) return;

      // Get all jobs in PENDING status from the current data
      const pendingJobs: Job[] = data.filter(
        (job: Job) => job.status === 'PENDING',
      );

      // Calculate new order based on first job's order in PENDING column
      const newOrder = pendingJobs[0] ? pendingJobs[0].order - 1 : 0;

      await api.post('job', {
        ...jobData,
        order: newOrder,
      });
      mutate();
    } catch (error) {
      toast.error('Failed to create job');
      throw error;
    }
  };

  const handleOnDragEnd = async (event: {
    itemId: string | number;
    newColumnId: string | number;
    oldColumnId: string | number;
    newPosition: number;
  }) => {
    try {
      const { itemId, newColumnId, newPosition } = event;

      // Find the job being moved
      const jobToUpdate = data?.find((job) => job.id === itemId);
      if (!jobToUpdate) return;

      // Get all jobs in the new column
      const jobsInNewColumn =
        data?.filter((job) => job.status === newColumnId) || [];

      // Calculate new order
      let newOrder: number;

      if (newPosition === 0) {
        // First position - use current order
        newOrder = jobToUpdate.order;
      } else if (newPosition === jobsInNewColumn.length) {
        // Last position - use last job's order + 1
        const lastJob = jobsInNewColumn[newPosition - 1];
        if (!lastJob) return;
        newOrder = lastJob.order + 1;
      } else {
        // Middle position - use average of adjacent jobs
        const prevJob = jobsInNewColumn[newPosition - 1];
        const nextJob = jobsInNewColumn[newPosition];
        if (!prevJob || !nextJob) return;
        newOrder = (prevJob.order + nextJob.order) / 2;
      }

      // Update the job
      await api.patch(`job/${itemId}`, {
        reports: jobToUpdate.reports,
        status: newColumnId,
        order: newOrder,
      });

      // Refresh the data
      mutate();
    } catch (error) {
      toast.error('Failed to update job position');
      console.error('Error updating job:', error);
    }
  };
  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder={`Filter jobs...`}
          className="max-w-sm"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
        />
        <JobDialog
          locationId={locationId}
          onSave={handleOnSaveJob}
          dictionary={dictionary}
        />
      </div>
      <KanbanBoard
        columns={columns}
        setColumns={setColumns}
        handleDragEnd={handleOnDragEnd}
      />
    </div>
  );
}
