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
import { DataTable } from '@/components/DataTable';
import { gearColumns } from '../GearTable/columns';
import selectColumn from '@/components/DataTable/select-column';

export default function RequestPreview({
	gearCheckout,
}: {
	gearCheckout: GearCheckout;
}) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size={'sm'} variant={'secondary'}>
					View
					<Eye className='h-4 w-4 p-0 ml-2' />
				</Button>
			</DialogTrigger>
			<DialogContent className='min-w-fit'>
				<DialogHeader>
					<DialogTitle>Requested Items</DialogTitle>
					<DialogDescription>
						Here is a list of the items that have been requested
					</DialogDescription>
				</DialogHeader>
				<DataTable
					selectActions={{
						title: 'Select',
						actions: [
							{
								name: 'Approve',
								action: () => {
									return Promise.resolve();
								},
							},
							{
								name: 'Decline',
								action: () => {
									return Promise.resolve();
								},
							},
						],
					}}
					title={''}
					columns={[selectColumn<Gear>(), ...gearColumns]}
					opts={{
						initialData: [],
						queryKey: ['gear', 'requests', ...gearCheckout.items],
						queryFn: async () => {
							const { data } = (
								await request.post('/gear/bulk', { ids: gearCheckout.items })
							).data;

							return data;
						},
					}}
				/>
			</DialogContent>
		</Dialog>
	);
}
