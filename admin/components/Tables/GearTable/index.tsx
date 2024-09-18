'use client';

import { DataTable } from '../../DataTable';
import { gearColumns } from './columns';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { gearTableOpts } from '@/lib/api';
import GearForm from '@/components/Forms/gear/GearForm';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

export default function GearTable() {
	const [open, setOpen] = useState(false);
	const { refetch } = useQuery(gearTableOpts);

	return (
		<>
			<DataTable
				title=''
				columns={gearColumns}
				opts={gearTableOpts}
				actions={[
					{
						name: 'Add Gear',
						children: (
							<Dialog open={open} onOpenChange={setOpen}>
								<DialogTrigger asChild>
									<Button variant={'secondary'} size={'sm'}>
										Add Gear <Plus className='h-4 w-4 ml-2' />
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogTitle>Gear Form</DialogTitle>
									<DialogDescription>
										Enter the details of the item. This can also be edited
										later.
									</DialogDescription>
									<GearForm
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
		</>
	);
}
