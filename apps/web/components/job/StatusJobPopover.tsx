import { Icons } from '@repo/ui/components/icons/icons';
import { Button } from '@repo/ui/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover';
import { Job, JobStatus } from '../../types/job';
import JobStatusBadge from './JobStatusBadge';

export default function StatusJobPopover({
  job,
  onChange,
}: {
  job: Job;
  onChange: (status: JobStatus) => void;
}) {
  const statuses: JobStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-auto w-auto ml-2">
          <Icons.edit className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2 w-auto items-start px-2 py-3">
        {statuses.map((status) => (
          <Button
            key={status}
            onClick={() => onChange(status)}
            className="w-auto h-auto p-0 bg-transparent hover:bg-transparent"
          >
            <JobStatusBadge status={status} />
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
