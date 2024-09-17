import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { capitalizeFirstLetter } from '@/lib/helpers';
import { Table } from '@tanstack/react-table';
import { EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function ColumnToggleMenu<T>({ table }: { table: Table<T> }) {
	const [open, setOpen] = useState(false);
	const columns = table.getAllLeafColumns();
	const all = columns.length;
	const visible = columns.filter((v) => v.getIsVisible()).length;
	const canToggle =
		table.getAllLeafColumns().filter((v) => v.getCanHide()).length === all;

	return canToggle ? (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					className='flex gap-2 items-center text-sm'
					variant={all - visible ? 'default' : 'outline'}
					size={'sm'}>
					<EyeOff className='h-3 w-3' />
					Columns
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{table
					.getAllLeafColumns()
					.filter((v) => v.getCanHide())
					.map((column) => (
						<div
							key={column.id}
							className='flex items-center justify-between w-full text-sm px-2 py-1 gap-4'>
							<p>{capitalizeFirstLetter(column.id)}</p>
							<Checkbox
								checked={column.getIsVisible()}
								onClick={column.getToggleVisibilityHandler()}
								defaultChecked
							/>
						</div>
					))}
			</DropdownMenuContent>
		</DropdownMenu>
	) : null;
}
