'use client';
import { Icons } from '@repo/ui/components/icons/icons';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { Input } from '@repo/ui/components/ui/input';
import { toast } from '@repo/ui/components/ui/sonner';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';
import useSWR from 'swr';
import api from '../../config/api';
import { Job, JobCreated } from '../../types/job';
import DataTable from '../DataTable';
import CreateJobDialog from '../job/JobDialog';

const fetcher = async (url: string) =>
  api.get<any, Job[]>(url).then((res) => res);

export default function JobTable({ locationId }: { locationId: string }) {
  const { data, isLoading, error, mutate } = useSWR(
    `job?locationId=${locationId}`,
    fetcher,
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const columns: ColumnDef<Job>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 hover:bg-none"
          >
            Title
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const job = row.original;
        return <div className="lowercase">{job.title}</div>;
      },
      filterFn: (row, columnId, filterValue) => {
        const job = row.original;
        return job.title.toLowerCase().includes(filterValue.toLowerCase());
      },
      sortingFn: (a, b) => {
        const jobA = a.original;
        const jobB = b.original;
        return jobA.title.localeCompare(jobB.title);
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const job = row.original;
        return <Badge>{job.status}</Badge>;
      },
      filterFn: (row, columnId, filterValue) => {
        const job = row.original;
        return filterValue.includes(job.status);
      },
    },
    {
      accessorKey: 'asignee',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 hover:bg-none"
          >
            Assign to
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const job = row.original;
        return <div className="lowercase">{job.asignee?.username}</div>;
      },
      sortingFn: (a, b) => {
        const jobA = a.original;
        const jobB = b.original;
        if (!jobA.asignee) return -1;
        if (!jobB.asignee) return 1;
        return jobA.asignee?.username.localeCompare(jobB.asignee?.username);
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const job = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <Icons.more className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <CreateJobDialog
                trigger={
                  <Button
                    variant="ghost"
                    className="w-full h-auto justify-start"
                  >
                    Edit
                  </Button>
                }
                job={job}
                onSave={async (data) => {
                  try {
                    await api.put(`job/${job.id}`, data);
                    mutate();
                    toast.success('Job updated successfully');
                  } catch (error) {
                    toast.error('Failed to update job');
                    throw error;
                  }
                }}
                locationId={locationId}
              />

              <Button
                className="w-full h-auto justify-start"
                variant="ghost"
                onClick={async () => {
                  try {
                    await api.delete(`job/${job.id}`);
                    mutate();
                    toast.success('Job deleted successfully');
                  } catch (error) {
                    toast.error('Failed to delete job');
                  }
                }}
              >
                Delete
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const handleOnSaveJob = async (data: JobCreated) => {
    try {
      await api.post('job', data);
      mutate();
      toast.success('Job created successfully');
    } catch (error) {
      toast.error('Failed to create job');
      throw error;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter job..."
          className="max-w-sm"
          value={(table.getColumn('title')?.getFilterValue() as string) || ''}
          onChange={(event) => {
            table.getColumn('title')?.setFilterValue(event.target.value);
          }}
        />
        <CreateJobDialog locationId={locationId} onSave={handleOnSaveJob} />
      </div>
      <DataTable table={table} columns={columns} />
    </div>
  );
}
