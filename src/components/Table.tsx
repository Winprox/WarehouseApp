import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, } from '@tanstack/react-table'; // prettier-ignore
import { HTMLAttributes, forwardRef } from 'react';
import { TItem, cm, formatDateTime, itemFieldTitles } from '../utils';

export type TTable = {
  items: TItem[];
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
  selectedId?: string;
  onSelect?: (id: string) => void;
};

export const Table = forwardRef<HTMLTableElement, TTable>((p, ref) => {
  const { getHeaderGroups, getRowModel } = useReactTable({
    data: p.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div
      {...p.wrapperProps}
      className={cm('overflow-y-auto', p.wrapperProps?.className)}
    >
      <table ref={ref} className='w-full cursor-default'>
        <thead className='sticky top-0 bg-white'>
          {getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th key={header.id} className='text-left'>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={cm(
                row.original.id === p.selectedId &&
                  'bg-primaryLight bg-opacity-50',
                row.original.id !== p.selectedId && 'even:bg-controlStroke'
              )}
              onClick={() => p.onSelect?.(row.original.id)}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

const column = createColumnHelper<TItem>();

const columns = Object.entries(itemFieldTitles).map(([key, title]) => {
  const fieldKey = key as keyof TItem;

  return column.accessor((row) => row[fieldKey], {
    id: title,
    cell: (ctx) => {
      const value = ctx.getValue();

      return fieldKey === 'arrival'
        ? formatDateTime(new Date(value.toString()))
        : value;
    },
  });
});
