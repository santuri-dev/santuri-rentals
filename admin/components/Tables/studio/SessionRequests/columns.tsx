import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/components/DataTable/data-table-column-header';
import { StudioRequest } from '@/lib/types';
import { calculateDuration, formatDate } from '@/lib/helpers';

export const studioRequestColumns: ColumnDef<StudioRequest>[] = [
	{
		accessorKey: 'User.username',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='User' />
		),
		cell: ({ row }) => {
			return (
				<div className='flex space-x-2'>
					<span className='max-w-[500px] truncate font-medium'>
						{row.original.User.username}
					</span>
				</div>
			);
		},
		enableHiding: false,
	},
	{
		accessorKey: 'type',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Type' />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{row.original.type}</p>;
		},
		enableHiding: false,
		enableSorting: false,
	},
	{
		accessorKey: 'startTime',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Start Time' />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{formatDate(row.original.startTime)}</p>;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'endTime',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='End Time' />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{formatDate(row.original.endTime)}</p>;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'duration',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Duration' />
		),
		cell: ({ row }) => {
			return (
				<p className={`text-sm`}>
					{calculateDuration(row.original.startTime, row.original.endTime)}
				</p>
			);
		},
		enableHiding: false,
		enableSorting: false,
	},
	{
		accessorKey: 'status',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Status' />
		),
		cell: ({ row }) => {
			return <p className={`text-sm`}>{row.original.status}</p>;
		},
		enableHiding: false,
	},
];

// export const courseRowActions: ColumnDef<Course> = {
// 	id: 'actions',
// 	cell: ({ row }) => <CourseRowActions course={row.original} />,
// 	enableHiding: false,
// };
