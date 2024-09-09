import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/DataTable/data-table-column-header';
import { Badge } from '@/components/ui/badge';
// import {
// 	DropdownMenu,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Button } from '@/components/ui/button';
// import { MoreHorizontal } from 'lucide-react';
import { Gear } from '@/lib/types';

export const gearColumns: ColumnDef<Gear>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
				className='translate-y-[2px]'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label='Select row'
				className='translate-y-[2px]'
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
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
	// {
	// 	id: 'actions',
	// 	cell: () => {
	// 		return (
	// 			<DropdownMenu>
	// 				<DropdownMenuTrigger asChild>
	// 					<Button variant='ghost' className='h-8 w-8 p-0'>
	// 						<span className='sr-only'>Open menu</span>
	// 						<MoreHorizontal className='h-4 w-4' />
	// 					</Button>
	// 				</DropdownMenuTrigger>
	// 				<DropdownMenuContent align='end' className='p-0 border'>
	// 					<DropdownMenuItem className='rounded-none'>
	// 						Request Item
	// 					</DropdownMenuItem>
	// 					<DropdownMenuItem className='rounded-none'>
	// 						View Details
	// 					</DropdownMenuItem>
	// 				</DropdownMenuContent>
	// 			</DropdownMenu>
	// 		);
	// 	},
	// 	enableHiding: false,
	// },
];
