import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/DataTable/data-table-column-header';
import { Course } from '@/lib/types';
import { calculateDuration, formatCurrency, formatDate } from '@/lib/helpers';
import CourseRowActions from './CourseRowActions';

export const courseColumns: ColumnDef<Course>[] = [
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
		accessorKey: 'location',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Location' disabled={true} />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{row.original.location}</p>;
		},
		enableHiding: false,
		enableSorting: false,
	},
	{
		accessorKey: 'applicationDeadline',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Application Deadline' />
		),
		cell: ({ row }) => {
			return (
				<p className={`text-sm`}>
					{formatDate(row.original.applicationDeadline)}
				</p>
			);
		},
		enableHiding: false,
	},
	{
		accessorKey: 'duration',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Duration' disabled={true} />
		),
		cell: ({ row }) => {
			return (
				<p className={`text-sm`}>
					{calculateDuration(row.original.startDate, row.original.endDate)}
				</p>
			);
		},
		enableHiding: false,
		enableSorting: false,
	},
	{
		accessorKey: 'startDate',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Start Date' />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{formatDate(row.original.startDate)}</p>;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'endDate',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='End Date' />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{formatDate(row.original.endDate)}</p>;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'cost',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Cost' />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{formatCurrency(row.original.cost)}</p>;
		},
		enableHiding: false,
	},
];

export const courseRowActions: ColumnDef<Course> = {
	id: 'actions',
	cell: ({ row }) => <CourseRowActions course={row.original} />,
	enableHiding: false,
};
