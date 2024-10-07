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
import { StudioRequest } from '@/lib/types';
import { CircleChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { request } from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import useLazyQuery from '@/hooks/use-lazy-query';
import { studioRequestOpts } from '@/lib/api';
import Dots from '@/components/Loaders/Dots';

export default function StudioRequestsRowActions({
	studioRequest,
}: {
	studioRequest: StudioRequest;
}) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { refetch } = useLazyQuery(studioRequestOpts);

	async function handleSubmit() {
		setLoading(true);

		try {
			const { success, message } = (
				await request.post(`/studio/approve/${studioRequest.id}`)
			).data;
			toast({ title: success ? 'Success' : 'Error', description: message });
			await refetch();
			setOpen(false);
		} catch (error) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			toast({ title: 'Error', description: error.message });
		}

		setLoading(false);
	}

	return (
		<div className='flex items-center gap-2'>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button
						disabled={studioRequest.status === 'approved'}
						variant={'secondary'}
						size={'icon'}
						className='h-8 w-8 p-0'>
						<CircleChevronRight className='h-4 w-4 p-0' />
					</Button>
				</DialogTrigger>
				<DialogContent className='max-h-[90vh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle>Approve Studio Session</DialogTitle>
						<DialogDescription>
							You can choose to approve or decline the studio session. If the
							time is conflicting with another, the approval will fail.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button disabled={loading} onClick={handleSubmit} type='submit'>
							{loading ? <Dots /> : 'Approve'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
