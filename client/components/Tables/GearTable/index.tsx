'use client';

import { QueryOpts } from '@/lib/queryClient';
import { DataTable } from '../../DataTable';
import { Gear } from '@/lib/types';
import { gearColumns } from './columns';
import { request } from '@/lib/axios';
import { useAuth } from '@/hooks/use-auth';
import { SelectActions } from '@/components/DataTable/types';
import { toast } from '@/hooks/use-toast';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import DateSelectionForm from '@/components/Forms/DateSelectionForm';

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
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<Gear[]>([]);

	const selectActions: SelectActions<Gear> | undefined =
		status === 'authenticated'
			? {
					title: 'Items',
					actions: [
						{
							name: 'Request',
							async action(rows, updateLoading) {
								'use server';
								setSelected(rows);
								setOpen(true);
								updateLoading();
								return Promise.resolve();
							},
						},
					],
			  }
			: undefined;

	return (
		<>
			<DataTable
				title=''
				columns={gearColumns}
				opts={opts}
				selectActions={selectActions}
			/>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogTitle>Select Rental Date</DialogTitle>
					<DateSelectionForm
						onCancel={() => {
							setOpen(false);
						}}
						onSubmit={async ({ pickupDate, returnDate }) => {
							const message = await requestGear(
								pickupDate,
								returnDate,
								selected.map((v) => v.id)
							);
							toast({ title: 'Success', description: message });
							setOpen(false);
							setSelected([]);
						}}
					/>
					<DialogDescription>
						This will be the date range for your gear rental
					</DialogDescription>
				</DialogContent>
			</Dialog>
		</>
	);
}
