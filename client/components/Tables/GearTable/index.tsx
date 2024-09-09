'use client';

import { QueryOpts } from '@/lib/queryClient';
import { DataTable } from '../../DataTable';
import { Gear } from '@/lib/types';
import { gearColumns } from './columns';
import { request } from '@/lib/axios';

const opts: QueryOpts<Gear[]> = {
	initialData: [],
	queryKey: ['gear', 'available'],
	queryFn: async () => {
		const { data } = (await request.get('/gear/available')).data;
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
