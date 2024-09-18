'use client';

import { DataTable } from '../../DataTable';
import { Gear } from '@/lib/types';
import { gearColumns } from './columns';
import { useAuth } from '@/hooks/use-auth';
import { SelectActions } from '@/components/DataTable/types';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { gearTableOpts } from '@/lib/api';

export default function GearTable() {
	const { status } = useAuth();
	const [open, setOpen] = useState(false);

	const selectActions: SelectActions<Gear> | undefined =
		status === 'authenticated'
			? {
					title: 'Items',
					actions: [
						{
							name: 'Request',
							async action(rows, updateLoading) {
								'use server';
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
				opts={gearTableOpts}
				selectActions={selectActions}
			/>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogTitle>Select Rental Date</DialogTitle>

					<DialogDescription>
						This will be the date range for your gear rental
					</DialogDescription>
				</DialogContent>
			</Dialog>
		</>
	);
}
