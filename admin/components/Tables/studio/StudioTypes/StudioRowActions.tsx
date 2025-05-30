'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { StudioType } from '@/lib/types';
import { Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { studioTypesOpts } from '@/lib/api';
import { request } from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import Dots from '@/components/Loaders/Dots';
import useLazyQuery from '@/hooks/use-lazy-query';
import StudioForm, {
	StudioFormInput,
} from '@/components/Forms/studio/StudioForm';

export default function StudioRowActions({
	studioType,
}: {
	studioType: StudioType;
}) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const { refetch } = useLazyQuery(
		studioTypesOpts({ pageIndex: 0, pageSize: 5 })
	);

	async function handleDelete() {
		setDeleting(true);

		try {
			await request.delete(`/studio/types/${studioType.id}`);
			toast({
				title: 'Success',
				description: `Successfully deleted ${studioType.name}`,
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: `Something went wrong deleting ${studioType.name}`,
			});
		}

		setDeleting(false);
		setDeleteOpen(false);
		await refetch();
	}

	return (
		<div className='flex items-center gap-2'>
			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogTrigger asChild>
					<Button variant={'secondary'} size={'icon'} className='h-8 w-8 p-0'>
						<Edit className='h-4 w-4 p-0' />
					</Button>
				</DialogTrigger>
				<DialogContent className='max-h-[90vh] overflow-y-auto'>
					<DialogTitle>Studio Form</DialogTitle>
					<DialogDescription>
						Enter the details of the item. This can also be edited later.
					</DialogDescription>
					<StudioForm
						defaultValues={{
							...(studioType as StudioFormInput),
							id: studioType.id,
						}}
						onSubmit={async () => {
							setEditOpen(false);
							await refetch();
						}}
					/>
				</DialogContent>
			</Dialog>
			<Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<DialogTrigger asChild>
					<Button variant={'destructive'} size={'icon'} className='h-8 w-8 p-0'>
						<Trash className='h-4 w-4 p-0 text-destructive-foreground' />
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className='mb-4'>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. Are you sure you want to permanently
							delete this item from the database?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							disabled={deleting}
							onClick={handleDelete}
							variant={'destructive'}
							type='submit'>
							{deleting ? <Dots /> : 'Confirm'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
