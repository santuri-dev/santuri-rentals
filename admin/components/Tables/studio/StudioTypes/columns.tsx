import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/DataTable/data-table-column-header';
import { StudioType } from '@/lib/types';
import { formatCurrency } from '@/lib/helpers';
import StudioRowActions from './StudioRowActions';

export const studioTypesColumns: ColumnDef<StudioType>[] = [
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
		accessorKey: 'description',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Description' />
		),
		cell: ({ row }) => {
			return (
				<div
					dangerouslySetInnerHTML={{ __html: row.original.description }}
					className={`text-sm line-clamp-2 overflow-ellipsis`}
				/>
			);
		},
		enableHiding: false,
		enableSorting: false,
	},
	{
		accessorKey: 'pricing',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Pricing (Hourly)' />
		),
		cell: ({ row }) => {
			return (
				<p className={`text-sm`}>{formatCurrency(row.original.pricing)}</p>
			);
		},
		enableHiding: false,
	},
];

export const studioRowActions: ColumnDef<StudioType> = {
	id: 'actions',
	cell: ({ row }) => <StudioRowActions studioType={row.original} />,
	enableHiding: false,
};
