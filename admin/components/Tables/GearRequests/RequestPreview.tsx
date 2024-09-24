import { Gear, GearCheckout } from '@/lib/types';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, X } from 'lucide-react';
import { request } from '@/lib/axios';
import { DataTable } from '@/components/DataTable';
import { gearColumns } from '../GearTable/columns';
import selectColumn from '@/components/DataTable/select-column';
import { toast } from '@/hooks/use-toast';
import { QueryOpts } from '@/lib/queryClient';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import * as z from 'zod';
import { camelCaseToReadable } from '@/lib/helpers';
import Dots from '@/components/Loaders/Dots';
import { gearRequestOpts } from '@/lib/api';
import useLazyQuery from '@/hooks/use-lazy-query';

function makeQueryOpts(
	gearCheckout: GearCheckout,
	status: string
): QueryOpts<Gear[]> {
	return {
		initialData: [],
		queryKey: ['gear', 'requests', 'status', ...gearCheckout.items],
		queryFn: async () => {
			const { data } = (
				await request.post('/gear/bulk', {
					ids: gearCheckout.items,
					status: status === 'all' ? undefined : status,
				})
			).data;

			return data;
		},
	};
}

const statuses = z.enum(['all', 'available', 'lease', 'class']);

export default function RequestPreview({
	gearCheckout,
}: {
	gearCheckout: GearCheckout;
}) {
	const [status, setStatus] = useState('all');
	const [openDialog, setOpenDialog] = useState(false);
	const [openAction, setOpenAction] = useState(false);
	const [closing, setClosing] = useState(false);
	const opts = makeQueryOpts(gearCheckout, status);

	const { refetch } = useLazyQuery(opts);
	const { refetch: refetchRequests } = useLazyQuery(gearRequestOpts);

	async function handleStatusChange(value: string) {
		setStatus(value);
		setTimeout(async () => {
			await refetch();
		}, 10);
	}

	async function handleCloseRequest() {
		setClosing(true);
		try {
			const { message, success } = (
				await request.post('/gear/requests/close', { id: gearCheckout.id })
			).data;
			if (success) {
				toast({ title: 'Success', description: message });
				setOpenDialog(false);
			} else {
				toast({ title: 'Error', description: message });
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.log('Error occurred: ' + error.message);
		}
		await refetchRequests();
		setClosing(false);
		setOpenAction(false);
	}

	return (
		<Dialog open={openDialog} onOpenChange={setOpenDialog}>
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
					actions={[
						{
							name: 'Status',
							children: (
								<Select
									onValueChange={handleStatusChange}
									defaultValue={status}>
									<SelectTrigger className='h-[32px] text-sm'>
										<SelectValue placeholder='Select Status' />
									</SelectTrigger>
									<SelectContent>
										{statuses._def.values.map((v) => (
											<SelectItem value={v} key={v}>
												{camelCaseToReadable(v)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							),
						},
						{
							name: 'Close Request',
							children: (
								<Dialog onOpenChange={setOpenAction} open={openAction}>
									<DialogTrigger asChild>
										<Button
											size={'sm'}
											variant={'outline'}
											className='bg-destructive/50 hover:bg-destructive border-destructive/50'>
											<>
												Close <X className='h-4 w-4 ml-2' />
											</>
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Are you absolutely sure?</DialogTitle>
											<DialogDescription>
												This action cannot be undone. This will permanently
												delete mark the request as closed.
											</DialogDescription>
										</DialogHeader>
										<DialogFooter>
											<Button
												disabled={closing}
												size={'sm'}
												onClick={handleCloseRequest}>
												{closing ? <Dots /> : 'Confirm'}
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							),
						},
					]}
					selectActions={{
						title: 'Select',
						actions: [
							{
								name: 'Approve',
								action: async (rows, updateLoading) => {
									const { message } = (
										await request.post('/gear/requests/approve', {
											items: rows.map(({ id }) => id),
											checkoutId: gearCheckout.id,
										})
									).data;
									toast({ description: message });
									updateLoading();
									await refetch();
								},
							},
						],
					}}
					title={''}
					columns={[selectColumn<Gear>(), ...gearColumns]}
					opts={opts}
					paginate={false}
				/>
			</DialogContent>
		</Dialog>
	);
}
