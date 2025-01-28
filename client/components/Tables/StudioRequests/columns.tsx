import type { ColumnDef } from '@tanstack/react-table';
// import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/DataTable/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import type { StudioRequest } from '@/lib/types';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/helpers';
import StudioRequestsRowActions from './StudioRequestsRowActions';

export const studioRequestColumns: ColumnDef<StudioRequest>[] = [
	// {
	// 	id: 'select',
	// 	header: ({ table }) => (
	// 		<Checkbox
	// 			checked={table.getIsAllPageRowsSelected()}
	// 			onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
	// 			aria-label='Select all'
	// 			className='translate-y-[2px]'
	// 		/>
	// 	),
	// 	cell: ({ row }) => (
	// 		<Checkbox
	// 			checked={row.getIsSelected()}
	// 			onCheckedChange={(value) => row.toggleSelected(!!value)}
	// 			aria-label='Select row'
	// 			className='translate-y-[2px]'
	// 		/>
	// 	),
	// 	enableSorting: false,
	// 	enableHiding: false,
	// },
	{
		accessorKey: 'startTime',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Session Time' />
		),
		cell: ({ row }) => {
			return (
				<div className='flex flex-col'>
					<span>{format(new Date(row.original.startTime), 'PPP')}</span>
					<span className='text-muted-foreground text-xs'>
						{format(new Date(row.original.startTime), 'p')} -{' '}
						{format(new Date(row.original.endTime), 'p')}
					</span>
				</div>
			);
		},
		enableHiding: false,
	},
	{
		accessorKey: 'StudioType.name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Studio Type' />
		),
		cell: ({ row }) => {
			return <div>{row.original.StudioType?.name || 'N/A'}</div>;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'status',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Status' />
		),
		cell: ({ row }) => {
			const status = row.original.status.toLowerCase();
			const statusColor =
				{
					pending: 'bg-yellow-100 text-yellow-800',
					approved: 'bg-green-100 text-green-800',
					rejected: 'bg-red-100 text-red-800',
				}[status] || 'bg-gray-100 text-gray-800';

			return (
				<Badge className={`${statusColor} text-xs`}>
					{row.original.status}
				</Badge>
			);
		},
		enableHiding: false,
	},
	{
		accessorKey: 'cost',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Cost' />
		),
		cell: ({ row }) => {
			return <div>{formatCurrency(row.original.cost)}</div>;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Cost' />
		),
		cell: ({ row }) => {
			return <StudioRequestsRowActions studioRequest={row.original} />;
		},
		enableHiding: false,
	},
];
