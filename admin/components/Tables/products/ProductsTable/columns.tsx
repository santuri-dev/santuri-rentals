import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/DataTable/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types';
import { formatCurrency, truncateText } from '@/lib/helpers';

export const productColumns: ColumnDef<Product>[] = [
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
		accessorKey: 'description',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Description' />
		),
		cell: ({ row }) => {
			return <p>{truncateText(row.original.description, 20)}</p>;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'Category.name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Category' />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{row.original.Category?.name ?? '-'}</p>;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'stock',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Stock' />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{row.original.stock}</p>;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'price',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Price' />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{formatCurrency(row.original.price)}</p>;
		},
		enableHiding: false,
	},
];

// export const gearRowActions: ColumnDef<Gear> = {
// 	id: 'actions',
// 	cell: ({ row }) => <GearRowActions gear={row.original} />,
// 	enableHiding: false,
// };
