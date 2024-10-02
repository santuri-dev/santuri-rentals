import { useState } from 'react';
import { CustomSelectedRows, SelectActions } from './types';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { CursorArrowIcon } from '@radix-ui/react-icons';
import Spinner2 from '@/components/Loaders/Spinner2';
import { Button } from '@/components/ui/button';

export default function SelectActionsMenu<T>({
	selectedRows,
	selectActions,
	clearSelection,
}: {
	selectedRows: CustomSelectedRows<T>;
	selectActions: SelectActions<T>;
	clearSelection: () => void;
}) {
	const [loading, setLoading] = useState<Array<string>>([]);
	const [open, setOpen] = useState(false);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger disabled={selectedRows.length === 0} asChild>
				<Button
					className='flex gap-2 items-center text-sm'
					variant={'outline'}
					size={'sm'}>
					<CursorArrowIcon className='h-3 w-3' />
					{`${selectActions.title} (${selectedRows.length})`}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{selectActions.actions.map(({ action, name }, idx) => (
					<DropdownMenuItem
						onClick={async (e) => {
							e.preventDefault();
							setLoading([...loading, name]);
							await action(
								selectedRows.map((r) => r.row),
								() =>
									setLoading((prev) => {
										return prev.filter((item) => item !== name);
									})
							);
							clearSelection();
						}}
						disabled={
							selectedRows.length === 0 || (loading && loading.includes(name))
						}
						key={`${name}~${idx}`}
						className='min-w-[150px] flex justify-between items-center'>
						{name}
						{loading && loading.includes(name) ? <Spinner2 /> : null}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
