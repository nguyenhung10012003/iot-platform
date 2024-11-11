'use client';
import { Icons } from '@repo/ui/components/icons/icons';
import { Button } from '@repo/ui/components/ui/button';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import { Input } from '@repo/ui/components/ui/input';
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
import { DictionaryProps } from '../../types/dictionary';
import { User } from '../../types/user';
import DataTable from '../DataTable';

export default function UserTable({
  dictionary,
  data,
}: DictionaryProps & { data: User[] }) {
  const columns: ColumnDef<User>[] = [
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
            className="p-0 hover:bg-transparent"
          >
            {dictionary.username}
            <Icons.sort className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const user = row.original;
        return <div className="lowercase">{user.username}</div>;
      },
      filterFn: (row, columnId, filterValue) => {
        const user = row.original;
        return user.username.toLowerCase().includes(filterValue.toLowerCase());
      },
      sortingFn: (a, b) => {
        const userA = a.original;
        const userB = b.original;
        return userA.username.localeCompare(userB.username);
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const user = row.original;
        return <div className="capitalize">{user.role}</div>;
      },
    },
    // {
    //   id: 'actions',
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     const user = row.original;
    //     const userId = getCookie('userId');
    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <Icons.more className="h-4 w-4" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuLabel>{dictionary.actions}</DropdownMenuLabel>
    //           <DropdownMenuItem>{dictionary.edit}</DropdownMenuItem>
    //           <DropdownMenuItem
    //             onClick={async () => {
    //               try {
    //                 if (user.id === userId) {
    //                   toast.error(dictionary.youCannotRemoveYourself);
    //                   return;
    //                 }
    //                 await api.delete(`location/user`, {
    //                   data: {
    //                     locationId,
    //                     userId: row.original.user.id,
    //                   },
    //                 });
    //                 mutate();
    //                 toast.success(dictionary.userRemovedFromLocation);
    //               } catch (error) {
    //                 toast.error(dictionary.userRemovedFromLocationFailed);
    //               }
    //             }}
    //           >
    //             {dictionary.delete}
    //           </DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
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
      </div>
      <DataTable table={table} columns={columns} dictionary={dictionary} />
    </div>
  );
}
