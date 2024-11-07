'use client';
import { Icons } from '@repo/ui/components/icons/icons';
import { Button } from '@repo/ui/components/ui/button';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import { Input } from '@repo/ui/components/ui/input';
import { Skeleton } from '@repo/ui/components/ui/skeleton';
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
import api from '../../config/api';
import { DictionaryProps } from '../../types/dictionary';
import { UserLocation } from '../../types/user';
import UserTable from '../DataTable';
import AddUserLocationDialog from '../user/AddUserLocationDialog';

const fetcher = async (url: string) =>
  api.get<any, UserLocation[]>(url).then((res) => res);
export default function UserLocationTable({
  locationId,
  dictionary,
}: {
  locationId: string;
} & DictionaryProps) {
  const { data, isLoading, error, mutate } = useSWR(
    `location/user?locationId=${locationId}`,
    fetcher,
  );

  const columns: ColumnDef<UserLocation>[] = [
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
      accessorKey: 'username',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0 hover:bg-none"
          >
            {dictionary.username}
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const userLocation = row.original;
        return <div className="lowercase">{userLocation.user.username}</div>;
      },
      filterFn: (row, columnId, filterValue) => {
        const userLocation = row.original;
        return userLocation.user.username
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      },
      sortingFn: (a, b) => {
        const userLocationA = a.original;
        const userLocationB = b.original;
        return userLocationA.user.username.localeCompare(
          userLocationB.user.username,
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const userLocation = row.original;
        return <div className="capitalize">{userLocation.role}</div>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original.user;
        const userId = getCookie('userId');
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
              <DropdownMenuItem>{dictionary.edit}</DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    if (user.id === userId) {
                      toast.error(dictionary.youCannotRemoveYourself);
                      return;
                    }
                    await api.delete(`location/user`, {
                      data: {
                        locationId,
                        userId: row.original.user.id,
                      },
                    });
                    mutate();
                    toast.success(dictionary.userRemovedFromLocation);
                  } catch (error) {
                    toast.error(dictionary.userRemovedFromLocationFailed);
                  }
                }}
              >
                {dictionary.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState({});
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

  if (isLoading) return <Skeleton className="w-full h-40" />;
  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder={dictionary.filterName}
          className="max-w-sm"
          value={
            (table.getColumn('username')?.getFilterValue() as string) || ''
          }
          onChange={(event) => {
            table.getColumn('username')?.setFilterValue(event.target.value);
          }}
        />
        <AddUserLocationDialog
          dictionary={dictionary}
          locationId={locationId}
          onAddUser={() => mutate()}
        />
      </div>
      <UserTable table={table} columns={columns} dictionary={dictionary} />
    </div>
  );
}
