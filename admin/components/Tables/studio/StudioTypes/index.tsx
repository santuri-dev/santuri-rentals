'use client';

import { DataTable } from '@/components/DataTable';
import { studioRowActions, studioTypesColumns } from './columns';
import { studioTypesOpts } from '@/lib/api';
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
import StudioForm from '@/components/Forms/studio/StudioForm';
import useLazyQuery from '@/hooks/use-lazy-query';
import RestrictedDatesForm from '@/components/Forms/studio/RestrictedDatesForm';

export default function StudioTypesTable() {
	const [openStudioForm, setOpenStudioForm] = useState(false);
	const [openDateForm, setOpenDateForm] = useState(false);
	const { refetch } = useLazyQuery(
		studioTypesOpts({ pageIndex: 0, pageSize: 5 })
	);

	return (
		<DataTable
			title=''
			columns={[...studioTypesColumns, studioRowActions]}
			opts={studioTypesOpts}
			actions={[
				{
					name: 'Add Studio',
					children: (
						<Dialog open={openStudioForm} onOpenChange={setOpenStudioForm}>
							<DialogTrigger asChild>
								<Button variant={'secondary'} size={'sm'}>
									Add Studio <Plus className='h-4 w-4 ml-2' />
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogTitle>Studio Form</DialogTitle>
								<DialogDescription>
									Enter the details of the studio. This can also be edited
									later.
								</DialogDescription>
								<StudioForm
									onSubmit={async () => {
										setOpenStudioForm(false);
										await refetch();
									}}
								/>
							</DialogContent>
						</Dialog>
					),
				},
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
