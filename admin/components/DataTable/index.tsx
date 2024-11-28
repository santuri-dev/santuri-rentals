'use client';

import {
	ColumnDef,
	ColumnFiltersState,
	PaginationState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from './data-table-pagination';
import { ReactNode, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/Loaders/Spinner';
import { ReloadIcon } from '@radix-ui/react-icons';
import { QueryOpts } from '@/lib/queryClient';
import SelectActionsMenu from './select-actions-menu';
import useSelectedRows from './useSelectedRows';
import ColumnToggleMenu from './column-toggle-menu';
import { SelectActions } from './types';
import { PaginatedResponse } from '@/lib/types';

interface DataTableProps<TData, TValue> {
	title: string;
	columns: ColumnDef<TData, TValue>[];
	opts: (
		paginationState: PaginationState
	) => QueryOpts<PaginatedResponse<TData>>;
	actions?: { name: string; children: ReactNode }[];
	selectActions?: SelectActions<TData>;
}

export function DataTable<TData, TValue>({
	title,
	columns,
	opts,
	actions,
	selectActions,
}: DataTableProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);

	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 5,
	});

	const {
		data: queryData,
		isFetching,
		refetch,
	} = useQuery({ ...opts(pagination), placeholderData: keepPreviousData });

	const data = Array.isArray(queryData) ? queryData : queryData?.data || [];

	const table = useReactTable({
		data,
		columns,
		rowCount: queryData.pagination.count,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		manualPagination: true,
	});

	const { selectedRows } = useSelectedRows(
		['selected', ...opts(pagination).queryKey.map((v: unknown) => v as string)],
		table,
		rowSelection
	);

	const tableRows = table.getRowModel().rows;

	return (
		<div className='space-y-4'>
			<h1 className='text-lg'>{title}</h1>
			<div className='w-full flex justify-between gap-4'>
				<div className='flex gap-2 items-center'>
					<ColumnToggleMenu table={table} />
					{selectActions ? (
						<SelectActionsMenu
							selectActions={selectActions}
							selectedRows={selectedRows}
						/>
					) : null}
					{actions?.map(({ children, name }) => (
						<div key={name}>{children}</div>
					))}
				</div>
				<Button
					variant={'outline'}
					size={'sm'}
					className='w-[70px]'
					disabled={isFetching}
					onClick={() => refetch()}>
					{isFetching ? <Spinner size='28' /> : <ReloadIcon />}
				</Button>
			</div>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className='first:rounded-tl-md last:rounded-tr-md'>
											{!header.isPlaceholder
												? flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )
												: null}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{tableRows.length ? (
							tableRows.map((row, idx) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className={`${
												tableRows.length - 1 === idx
													? 'first:rounded-bl-md last:rounded-br-md'
													: ''
											}`}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
}
