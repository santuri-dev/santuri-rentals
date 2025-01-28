'use client';

import { DataTable } from '@/components/DataTable';
import { studioRestrictedDatesOpts } from '@/lib/api';
import { restrictedDateColumns, restrictedDateRowActions } from './columns';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import useLazyQuery from '@/hooks/use-lazy-query';
import RestrictedDatesForm from '@/components/Forms/studio/RestrictedDatesForm';

export default function RestrictedDatesTable() {
	const [openDateForm, setOpenDateForm] = useState(false);
	const { refetch } = useLazyQuery(
		studioRestrictedDatesOpts({ pageIndex: 0, pageSize: 5 })
	);

	return (
		<DataTable
			title='Restricted Dates'
			columns={[...restrictedDateColumns, restrictedDateRowActions]}
			opts={(pagination) => studioRestrictedDatesOpts(pagination)}
			actions={[
				{
					name: 'Restrict Dates',
					children: (
						<Dialog open={openDateForm} onOpenChange={setOpenDateForm}>
							<DialogTrigger asChild>
								<Button variant={'secondary'} size={'sm'}>
									Add Restricted Dates <Plus className='h-4 w-4 ml-2' />
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogTitle>Restrict Dates</DialogTitle>
								<DialogDescription>
									Select the dates you would like to restrict bookings.
								</DialogDescription>
								<RestrictedDatesForm
									onSubmit={async () => {
										setOpenDateForm(false);
										await refetch();
									}}
								/>
							</DialogContent>
						</Dialog>
					),
				},
			]}
		/>
	);
}
