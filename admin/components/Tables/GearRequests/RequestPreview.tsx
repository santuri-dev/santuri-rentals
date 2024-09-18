import { Gear, GearCheckout } from '@/lib/types';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { request } from '@/lib/axios';
import useLazyQuery from '@/hooks/use-lazy-query';
import PreviewTable from './PreviewTable';
import Spinner2 from '@/components/Loaders/Spinner2';

export default function RequestPreview({
	gearCheckout,
}: {
	gearCheckout: GearCheckout;
}) {
	const [open, setOpen] = useState(false);
	const { data, enable, isFetching } = useLazyQuery<Gear[]>({
		initialData: [],
		queryKey: ['gear', 'requests', ...gearCheckout.items],
		queryFn: async () => {
			const { data } = (
				await request.post('/gear/bulk', { ids: gearCheckout.items })
			).data;

			return data;
		},
		enabled: open,
	});

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				if (v) enable();
				setOpen(v);
			}}>
			<DialogTrigger asChild>
				<Button size={'sm'} variant={'secondary'}>
					View
					<Eye className='h-4 w-4 p-0 ml-2' />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Requested Items</DialogTitle>
					<DialogDescription>
						Here is a list of the items that have been requested
					</DialogDescription>
				</DialogHeader>
				{isFetching ? (
					<div className='flex w-full items-center justify-center'>
						<Spinner2 />
					</div>
				) : (
					<PreviewTable gearItems={data} />
				)}
			</DialogContent>
		</Dialog>
	);
}
