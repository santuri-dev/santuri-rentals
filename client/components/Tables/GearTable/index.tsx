'use client';

import { QueryOpts } from '@/lib/queryClient';
import { DataTable } from '../../DataTable';
import { Gear } from '@/lib/types';
import { gearColumns } from './columns';
import { request } from '@/lib/axios';
import { useAuth } from '@/hooks/use-auth';
import { SelectActions } from '@/components/DataTable/types';
import { toast } from '@/hooks/use-toast';

const opts: QueryOpts<Gear[]> = {
	initialData: [],
	queryKey: ['gear', 'available'],
	queryFn: async () => {
		const { data } = (await request.get('/gear/available')).data;
		return data;
	},
};

async function requestGear(
	pickupDate: Date,
	returnDate: Date,
	items: number[]
) {
	const { message } = (
		await request.post('/gear/request', { pickupDate, returnDate, items })
	).data;

	return message;
}

export default function GearTable() {
	const { status } = useAuth();
	const selectActions: SelectActions<Gear> | undefined =
		status === 'authenticated'
			? {
					title: 'Items',
					actions: [
						{
							name: 'Request',
							async action(rows, updateLoading) {
								'use server';
								console.log(rows);
								const message = await requestGear(
									new Date(),
									new Date(),
									rows.map((v) => v.id)
								);
								toast({ title: 'Success', description: message });
								updateLoading();
								return Promise.resolve();
							},
						},
					],
			  }
			: undefined;

	return (
		<DataTable
			title=''
			columns={gearColumns}
			opts={opts}
			selectActions={selectActions}
		/>
	);
}
