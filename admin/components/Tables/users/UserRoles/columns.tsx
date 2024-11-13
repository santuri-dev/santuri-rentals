import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/DataTable/data-table-column-header';
import { UserRole } from '@/lib/types';
import UserRoleRowActions from './UserRolesRowActions';

export const userRolesColumns: ColumnDef<UserRole>[] = [
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
		accessorKey: 'gearDiscount',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Gear Discount' />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{row.original.gearDiscount}%</p>;
		},
		enableHiding: false,
		enableSorting: false,
	},
	{
		accessorKey: 'studioDiscount',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Studio Discount' />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{row.original.studioDiscount}%</p>;
		},
		enableHiding: false,
	},
];

export const userRoleRowActions: ColumnDef<UserRole> = {
	id: 'actions',
	cell: ({ row }) => <UserRoleRowActions role={row.original} />,
	enableHiding: false,
};
