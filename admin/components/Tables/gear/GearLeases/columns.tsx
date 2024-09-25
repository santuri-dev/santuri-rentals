import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/DataTable/data-table-column-header';
import { GearLease } from '@/lib/types';
import { formatDate } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';

export const gearLeaseColumns: ColumnDef<GearLease>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Name' />
		),
		cell: ({ row }) => {
			return (
				<div className='flex space-x-2'>
					<span className='max-w-[500px] truncate font-medium'>
						{row.original.name}
					</span>
				</div>
			);
		},
		enableHiding: false,
	},
	{
		accessorKey: 'serialNumber',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Serial Number' />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{row.original.serialNumber}</p>;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'condition',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Condition' />
		),
		cell: ({ row }) => {
			return <Badge className={`text-xs`}>{row.original.condition}</Badge>;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'GearCheckout.User.username',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='User' />
		),
		cell: ({ row }) => {
			return (
				<p className={`text-sm`}>{row.original.GearCheckout.User.username}</p>
			);
		},
		enableHiding: true,
	},
	{
		accessorKey: 'GearCheckout.User.email',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Email' />
		),
		cell: ({ row }) => {
			return (
				<p className={`text-sm`}>{row.original.GearCheckout.User.email}</p>
			);
		},
		enableHiding: false,
	},
	{
		accessorKey: 'pickupDate',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Pickup' />
		),
		cell: ({ row }) => {
			return (
				<p className={`text-sm`}>
					{formatDate(row.original.GearCheckout.pickupDate)}
				</p>
			);
		},
		enableHiding: false,
	},
	{
		accessorKey: 'returnDate',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Return' />
		),
		cell: ({ row }) => {
			return (
				<p className={`text-sm`}>
					{formatDate(row.original.GearCheckout.returnDate)}
				</p>
			);
		},
		enableHiding: false,
	},
];
