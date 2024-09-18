import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/DataTable/data-table-column-header';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { GearCheckout } from '@/lib/types';
import { formatDate } from '@/lib/helpers';

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
		cell: () => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Row Actions</span>
							<MoreHorizontal className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='p-0 border'>
						<DropdownMenuItem className='rounded-none'>
							Approve
						</DropdownMenuItem>
						<DropdownMenuItem className='rounded-none'>
							Review / Amend
						</DropdownMenuItem>
						<DropdownMenuItem className='rounded-none'>
							Decline
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		enableHiding: false,
	},
];
