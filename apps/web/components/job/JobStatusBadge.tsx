import { Badge } from '@repo/ui/components/ui/badge';
import { JobStatus } from '../../types/job';

export default function JobStatusBadge({ status }: { status: JobStatus }) {
  switch (status) {
    case 'PENDING':
      return (
        <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
          Pending
        </Badge>
      );
    case 'IN_PROGRESS':
      return (
        <Badge className="bg-blue-500 text-white hover:bg-blue-600">
          In Progress
        </Badge>
      );
    case 'COMPLETED':
      return (
        <Badge className="bg-green-500 text-white hover:bg-green-600">
          Completed
        </Badge>
      );
  }
}
