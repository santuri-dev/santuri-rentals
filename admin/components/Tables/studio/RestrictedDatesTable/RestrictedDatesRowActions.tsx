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
import type { RestrictedDate } from '@/lib/types';
import { CircleChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { request } from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import Dots from '@/components/Loaders/Dots';
import useLazyQuery from '@/hooks/use-lazy-query';
import { studioRestrictedDatesOpts } from '@/lib/api';

export default function RestrictedDatesRowActions({
	restrictedDate,
}: {
	restrictedDate: RestrictedDate;
}) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { refetch } = useLazyQuery(
		studioRestrictedDatesOpts({ pageIndex: 0, pageSize: 5 })
	);

	async function handleDelete() {
		setLoading(true);

		try {
			const { success, message } = (
				await request.delete(`/studio/restricted-dates/${restrictedDate.id}`)
			).data;
			await refetch();
			toast({ title: success ? 'Success' : 'Error', description: message });
			setOpen(false);
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			toast({ title: 'Error', description: error.response.data.message });
		}

		setLoading(false);
	}

	return (
		<div className='flex items-center gap-2'>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant={'secondary'} size={'icon'} className='h-8 w-8 p-0'>
						<CircleChevronRight className='h-4 w-4 p-0' />
					</Button>
				</DialogTrigger>
				<DialogContent className='max-h-[90vh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle>Delete Restricted Date</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this restricted date? This action
							cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button disabled={loading} onClick={handleDelete} type='submit'>
							{loading ? <Dots /> : 'Delete'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
