'use client';

import { QueryOpts } from '@/lib/queryClient';
import { DataTable } from './DataTable';
import { Button } from './ui/button';

const opts: QueryOpts<any[]> = {
	initialData: [],
	queryKey: ['gear', 'available'],
	queryFn: async () => {
		const res = await fetch('http://localhost:8080/api/gear/available');
		const data = await res.json();
		console.log(data);

		return [];
	},
};

export default function GearTable() {
	return (
		<DataTable
			title=''
			columns={[]}
			opts={opts}
			actions={[{ name: 'Action 1', children: <Button>Testing</Button> }]}
			selectActions={[
				{
					name: 'Select',
					action(rows, updateLoading) {
						'use server';
						return Promise.resolve();
					},
				},
			]}
		/>
	);
}
