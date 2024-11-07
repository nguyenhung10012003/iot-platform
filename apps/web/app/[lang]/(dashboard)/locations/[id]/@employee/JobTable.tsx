'use client';
import { Icons } from '@repo/ui/components/icons/icons';
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
import { getCookie } from 'cookies-next';
import React from 'react';
import useSWR from 'swr';
import DataTable from '../../../../../../components/DataTable';
import JobStatusBadge from '../../../../../../components/job/JobStatusBadge';
import StatusJobPopover from '../../../../../../components/job/StatusJobPopover';
import UploadReportDialog from '../../../../../../components/job/UploadReportDialog';
import api from '../../../../../../config/api';
import { DictionaryProps } from '../../../../../../types/dictionary';
import { Job } from '../../../../../../types/job';

const fetcher = async (url: string) =>
  api.get<any, Job[]>(url).then((res) => res);

export default function JobTable({
  locationId,
  dictionary,
}: { locationId: string } & DictionaryProps) {
  const userId = getCookie('userId');
  const { data, isLoading, error, mutate } = useSWR(
    `job?locationId=${locationId}&asigneeId=${userId}`,
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
            {dictionary.title}
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
      header: dictionary.status,
      cell: ({ row }) => {
        const job = row.original;
        return (
          <div className="flex">
            <JobStatusBadge status={job.status} />
            <StatusJobPopover
              job={job}
              onChange={(status) => {
                api
                  .patch(`job/${job.id}`, { status })
                  .then(() => {
                    mutate();
                    toast.success(dictionary.statusUpdatedSuccessfully);
                  })
                  .catch(() => {
                    toast.error(dictionary.failedToUpdateStatus);
                  });
              }}
            />
          </div>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        const job = row.original;
        return filterValue.includes(job.status);
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
              <DropdownMenuLabel>{dictionary.actions}</DropdownMenuLabel>
              <UploadReportDialog job={job} />
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
      </div>
      <DataTable table={table} columns={columns} dictionary={dictionary} />
    </div>
  );
}
