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
import useSWR from 'swr';
import api from '../../config/api';
import { PetsPredict } from '../../types/pets-predict';

const fetcher = async (url: string) =>
  api.get<PetsPredict[], any>(url).then((res) => res);
export default function DiseaseDetectHistory() {
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

  const table = useReactTable({
    columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div>
      <h2 className="text-xl font-semibold">Disease Detection History</h2>
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
