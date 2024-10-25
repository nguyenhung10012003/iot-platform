import { User } from './user';

export type JobForm = {
  title: string;
  description?: string;
  asigneeId?: string;
};

export type JobCreated = {
  title: string;
  description?: string;
  asigneeId?: string;
  locationId: string;
};

export type Job = {
  id: string;
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  report?: string;
  description?: string;
  locationId: string;
  asigneeId?: string;
  asignee?: User;
  createdAt: Date;
  updatedAt: Date;
};
