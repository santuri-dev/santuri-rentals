'use client';

import { QueryOpts } from '@/lib/queryClient';
import { DataTable } from '../../DataTable';
import { Gear } from '@/lib/types';
import { gearColumns } from './columns';

const opts: QueryOpts<Gear[]> = {
	initialData: [],
	queryKey: ['gear', 'available'],
	queryFn: async () => {
		const res = await fetch('http://localhost:8080/api/gear/available');
		const { data } = await res.json();
		return data;
	},
};

export default function GearTable() {
	return (
		<DataTable
			title=''
			columns={gearColumns}
			opts={opts}
			selectActions={{
				title: 'Items',
				actions: [
					{
						name: 'Request',
						action(rows, updateLoading) {
							'use server';
							console.log(rows);
							updateLoading();
							return Promise.resolve();
						},
					},
				],
			}}
		/>
	);
}
