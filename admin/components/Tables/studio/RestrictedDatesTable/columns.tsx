import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/DataTable/data-table-column-header';
import { RestrictedDate } from '@/lib/types';
import { formatDate } from '@/lib/helpers';
import RestrictedDatesRowActions from './RestrictedDatesRowActions';

export const restrictedDateColumns: ColumnDef<RestrictedDate>[] = [
	{
		accessorKey: 'date',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Date' />
		),
		cell: ({ row }) => {
			return <p className='text-sm'>{formatDate(row.original.date)}</p>;
		},
		enableHiding: false,
	},
];

export const restrictedDateRowActions: ColumnDef<RestrictedDate> = {
	id: 'actions',
	cell: ({ row }) => (
		<RestrictedDatesRowActions restrictedDate={row.original} />
	),
	enableHiding: false,
};
