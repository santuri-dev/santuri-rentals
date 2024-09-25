import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/DataTable/data-table-column-header';
import { GearCheckout } from '@/lib/types';
import { formatDate } from '@/lib/helpers';
import RequestPreview from './RequestPreview';

export const gearRequestColumns: ColumnDef<GearCheckout>[] = [
	{
		accessorKey: 'User.username',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='User' />
		),
		cell: ({ row }) => {
			return (
				<div className='flex space-x-2'>
					<span className='max-w-[500px] truncate font-medium'>
						{row.original.User.username}
					</span>
				</div>
			);
		},
		enableHiding: false,
	},
	{
		accessorKey: 'User.email',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Email' />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{row.original.User.email}</p>;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'pickupDate',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Pickup' />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{formatDate(row.original.pickupDate)}</p>;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'returnDate',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Return' />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{formatDate(row.original.returnDate)}</p>;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Requested On' />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{formatDate(row.original.createdAt)}</p>;
		},
		enableHiding: false,
	},
	{
		id: 'actions',
		cell: ({ row }) => <RequestPreview gearCheckout={row.original} />,
		enableHiding: false,
	},
];
