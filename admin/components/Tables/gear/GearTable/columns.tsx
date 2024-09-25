import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/DataTable/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import GearRowActions from './GearRowActions';
import { Gear } from '@/lib/types';

export const gearColumns: ColumnDef<Gear>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Item' />
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
		accessorKey: 'status',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Status' />
		),
		cell: ({ row }) => {
			return <Badge className={`text-xs`}>{row.original.status}</Badge>;
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
];

export const gearRowActions: ColumnDef<Gear> = {
	id: 'actions',
	cell: ({ row }) => <GearRowActions gear={row.original} />,
	enableHiding: false,
};
