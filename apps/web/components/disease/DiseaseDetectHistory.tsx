'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/ui/table';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import api from '../../config/api';
import { PetsPredict } from '../../types/pets-predict';
import { Icons } from '@repo/ui/components/icons/icons';
import { Button } from '@repo/ui/components/ui/button';
import { toast } from '@repo/ui/components/ui/sonner';

const fetcher = async (url: string) =>
  api.get<PetsPredict[], any>(url).then((res) => res);
export default function DiseaseDetectHistory({canDelete}: {canDelete?: boolean}) {
  const { id: locationId } = useParams<{ id: string }>();
  const { data, isLoading, error } = useSWR(
    `pets-predict?locationId=${locationId}`,
    fetcher,
  );

  const columns: ColumnDef<PetsPredict>[] = [
    {
      id: 'createdAt',
      header: 'Time',
      cell: ({ row }) => (
        <span>{new Date(row.original.createdAt).toLocaleString()}</span>
      ),
    },
    {
      id: 'image',
      header: () => <div className="w-24 text-center">Image</div>,
      cell: ({ row }) => (
        <img
          src={row.original.image}
          alt="Preview"
          className="w-24 h-24 object-cover"
        />
      ),
    },
    {
      id: 'result',
      header: 'Result',
      cell: ({ row }) => <span>{row.original.result}</span>,
    },
  ];

  if (canDelete) {
    columns.push({
      id: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size='icon'
          onClick={async () => {
            try {
              await api.delete(`/pets-predict/${row.original.id}`);
              mutate(`pets-predict?locationId=${locationId}`);
              toast.success('Deleted successfully');
            } catch (error) {
              console.error(error);
            }
          }}
        >
          <Icons.delete className='w-5 h-5'/>
        </Button>
      ),
    });
  }

  const table = useReactTable({
    columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Disease Detection History</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
