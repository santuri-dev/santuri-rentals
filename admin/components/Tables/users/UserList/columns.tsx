import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/DataTable/data-table-column-header';
import { User } from '@/lib/types';
import { formatDate } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';

export const userColumns: ColumnDef<User>[] = [
	{
		accessorKey: 'username',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='User' />
		),
		cell: ({ row }) => {
			return (
				<div className='flex space-x-2'>
					<span className='max-w-[500px] truncate font-medium'>
						{row.original.username}
					</span>
				</div>
			);
		},
		enableHiding: false,
	},
	{
		accessorKey: 'email',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Email' />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{row.original.email}</p>;
		},
		enableHiding: false,
		enableSorting: false,
	},
	{
		accessorKey: 'phoneNumber',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Phone Number' />
		),
		cell: ({ row }) => {
			const { phoneNumber } = row.original;
			return <p className={`text-sm`}>{phoneNumber ?? '-'}</p>;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Created At' />
		),
		cell: ({ row }) => {
			const { createdAt } = row.original;
			return (
				<p className={`text-sm`}>{createdAt ? formatDate(createdAt) : '-'}</p>
			);
		},
		enableHiding: false,
	},
	{
		accessorKey: 'role',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Role' />
		),
		cell: ({ row }) => {
			const { Role } = row.original;

			return (
				<Badge variant={'secondary'} className={`text-xs`}>
					{Role?.name ?? '-'}
				</Badge>
			);
		},
		enableHiding: false,
	},
];

// export const studioRequestRowActions: ColumnDef<StudioRequest> = {
// 	id: 'actions',
// 	cell: ({ row }) => <StudioRequestsRowActions studioRequest={row.original} />,
// 	enableHiding: false,
// };
