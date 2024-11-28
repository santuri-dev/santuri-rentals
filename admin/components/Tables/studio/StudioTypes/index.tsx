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

export default function StudioTypesTable() {
	const [open, setOpen] = useState(false);
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
						<Dialog open={open} onOpenChange={setOpen}>
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
										setOpen(false);
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
