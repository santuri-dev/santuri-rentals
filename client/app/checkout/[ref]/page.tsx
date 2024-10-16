'use client';

import Dots from '@/components/Loaders/Dots';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/hooks/use-cart';
import { fetchOrderOpts } from '@/lib/api';
import { formatCurrency } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Ban, CheckCircle, CircleEllipsis } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function Page({ params: { ref } }: { params: { ref: string } }) {
	const search = useSearchParams();
	const trackingId = search.get('tracking_id');
	const signature = search.get('signature');
	const checkout_id = search.get('checkout_id');

	const { data, isFetching, refetch } = useQuery(
		fetchOrderOpts(ref, checkout_id ?? '', signature ?? '', trackingId ?? '')
	);

	const { clearCart, cart } = useCart();

	if (isFetching && !data) {
		return <Skeleton className='w-full min-h-[75vh]' />;
	}

	if (!data) {
		return (
			<div className='w-full flex-col gap-4 min-h-[50vh] flex items-center justify-center'>
				Something went wrong.
				<Button
					className='ml-2'
					variant='secondary'
					onClick={async () => await refetch()}>
					{isFetching ? <Dots /> : 'Retry'}
				</Button>
			</div>
		);
	}

	if (cart.length > 0 && data.status === 'paid') {
		clearCart();
	}

	return (
		<section className='py-6'>
			<div className='flex flex-col md:flex-row justify-between w-full gap-6'>
				<div className='w-full md:w-1/2 bg-slate-800 py-2 rounded-md border h-fit'>
					<div className='px-4 py-2 flex w-full items-center'>
						<p className='font-semibold'>Order Details</p>
					</div>
					<hr className='border-slate-700' />
					<div className='flex flex-col gap-4 w-full p-4 text-sm md:text:md'>
						<div className='flex w-full justify-between'>
							<p>TRACKING ID</p>
							<p>{trackingId}</p>
						</div>
						<div className='flex w-full justify-between'>
							<p>ORDER REF</p>
							<p>{data.ref}</p>
						</div>
						<div className='flex w-full justify-between'>
							<p>STATUS</p>
							<Badge
								className={cn({
									'bg-blue-500 hover:bg-blue-500': data.status === 'pending',
									'bg-green-500 hover:bg-green-500': data.status === 'paid',
									'bg-red-500 hover:bg-red-500': data.status === 'failed',
									'gap-2': true,
								})}>
								{data.status === 'pending'
									? 'PROCESSING'
									: data.status.toUpperCase()}
								{data.status === 'pending' ? (
									<CircleEllipsis className='h-3 w-3' />
								) : data.status === 'paid' ? (
									<CheckCircle size={16} />
								) : (
									<Ban className='h-3 w-3' />
								)}
							</Badge>
						</div>
						{data.status === 'paid' ? (
							<p className='text-green-500'>
								Please check your email for your receipt.
							</p>
						) : null}
					</div>
				</div>
				<div className='w-full md:w-1/2 bg-slate-800 py-2 rounded-md border'>
					<div className='px-4 py-2 flex w-full items-center'>
						<p className='font-semibold'>Order Summary</p>
					</div>
					<hr className='border-slate-700' />
					<div className='p-4'>
						{data.OrderItem.map(({ Product, id }, idx) => {
							const { name, imagePlaceholder, imageUrl, price } = Product;
							return (
								<div
									key={`${id}~${name}~${idx}`}
									className='flex py-2 justify-between items-center hover:cursor-pointer'>
									<div className='flex justify-between w-full items-center'>
										<div className='flex items-center gap-4'>
											<Image
												alt={`Product ${name} cover image`}
												src={imageUrl ?? ''}
												blurDataURL={imagePlaceholder ?? ''}
												height={64}
												width={64}
												className='rounded-md'
											/>
											<div className='text-sm'>
												<p className='font-semibold text-blue-500'>{name}</p>
											</div>
										</div>
										<div className='flex items-center gap-4'>
											<p className='font-semibold'>{`KES ${price}`}</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
					<hr className='border-slate-700' />
					<div className='text-md md:text-lg w-full flex items-center justify-between font-semibold p-4'>
						<p>
							Total ({data.OrderItem.length}{' '}
							{data.OrderItem.length === 1 ? 'item' : 'items'})
						</p>
						<p>{formatCurrency(data.totalCost)}</p>
					</div>
				</div>
			</div>
		</section>
	);
}
