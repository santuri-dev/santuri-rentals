import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '../ui/checkbox';

const selectColumn = <T extends object>(): ColumnDef<T> => ({
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
});

export default selectColumn;
