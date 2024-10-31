'use client';

import {
	ArrowDownIcon,
	ArrowUpIcon,
	CaretSortIcon,
	EyeNoneIcon,
} from '@radix-ui/react-icons';
import { Column } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
	disabled?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
	disabled = false,
}: DataTableColumnHeaderProps<TData, TValue>) {
	const [open, setOpen] = useState(false);
	if (!title) return null;
	return (
		<div className={cn('flex items-center space-x-2', className)}>
			<DropdownMenu
				open={open}
				onOpenChange={(value) => {
					if (!disabled) {
						setOpen(value);
					}
				}}>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						size='sm'
						className='-ml-1 px-2 h-8 data-[state=open]:bg-accent'>
						<span>{title}</span>
						{column.getCanSort() ? (
							<>
								{column.getIsSorted() === 'desc' ? (
									<ArrowDownIcon className='ml-2 h-4 w-4' />
								) : column.getIsSorted() === 'asc' ? (
									<ArrowUpIcon className='ml-2 h-4 w-4' />
								) : (
									<CaretSortIcon className='ml-2 h-4 w-4' />
								)}
							</>
						) : null}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='start'>
					{column.getCanSort() ? (
						<>
							<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
								<ArrowUpIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
								Asc
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
								<ArrowDownIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
								Desc
							</DropdownMenuItem>
						</>
					) : null}
					{column.getCanHide() ? (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
								<EyeNoneIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
								Hide
							</DropdownMenuItem>
						</>
					) : null}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
