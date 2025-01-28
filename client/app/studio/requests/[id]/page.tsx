'use client';

import { format, differenceInHours, differenceInMinutes } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { StudioRequest } from '@/lib/types';
import { request } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import {
	Clock,
	Music2,
	DollarSign,
	Package,
	CircleChevronLeft,
} from 'lucide-react';
import { formatCurrency } from '@/lib/helpers';
import Link from 'next/link';

export default function Page({ params }: { params: { id: string } }) {
	const { data, isLoading } = useQuery<StudioRequest>({
		queryKey: ['studio_requests', params.id],
		async queryFn() {
			const { data } = (await request.get(`/studio/requests/${params.id}`))
				.data;
			return data;
		},
	});

	if (isLoading) return <StudioRequestSkeleton />;
	if (!data) return <div>No data found</div>;

	const statusColor =
		{
			pending: 'bg-yellow-400 text-yellow-900 border border-yellow-500',
			approved: 'bg-green-400 text-green-900 border border-green-500',
			rejected: 'bg-red-400 text-red-900 border border-red-500',
		}[data.status.toLowerCase()] ||
		'bg-gray-400 text-gray-900 border border-green-500';

	const sessionDuration = differenceInHours(
		new Date(data.endTime),
		new Date(data.startTime)
	);
	const extraMinutes =
		differenceInMinutes(new Date(data.endTime), new Date(data.startTime)) % 60;

	return (
		<div className='py-8 px-4 md:px-0'>
			<div className='pb-4'>
				<Link
					className='flex items-center hover:text-blue-500'
					href={'/studio/requests'}>
					<CircleChevronLeft className='h-5 w-5 mr-2' />
					Requests
				</Link>
			</div>
			<Card className='overflow-hidden'>
				<CardHeader className={`${statusColor} border-0 p-6`}>
					<div className='flex flex-col md:flex-row md:items-center md:justify-between'>
						<div>
							<CardTitle className='text-2xl md:text-3xl font-bold mb-2'>
								Studio Request #{data.id}
							</CardTitle>
							<p className='text-sm md:text-base opacity-75'>
								Created on {format(new Date(data.createdAt), 'PPP')}
							</p>
						</div>
						<Badge
							className={`text-sm md:text-base uppercase shadow-xl ${statusColor}`}>
							{data.status}
						</Badge>
					</div>
				</CardHeader>
				<CardContent className='p-6'>
					<div className='grid md:grid-cols-2 gap-8'>
						<div>
							<h3 className='text-xl font-semibold mb-4'>Session Details</h3>
							<div className='space-y-4'>
								<div className='flex justify-between items-center'>
									<div className='flex gap-2 items-center'>
										<Clock className='w-5 h-5 mr-2 text-gray-500' />
										<p className='font-medium'>Session Time</p>
									</div>
									<div className='text-end'>
										<p className='text-sm text-gray-600'>
											{format(new Date(data.startTime), 'PPp')} -{' '}
											{format(new Date(data.endTime), 'p')}
										</p>
										<p className='text-sm text-gray-600'>
											Duration: {sessionDuration}h{' '}
											{extraMinutes > 0 ? `${extraMinutes}m` : ''}
										</p>
									</div>
								</div>
								<div className='flex justify-between items-center'>
									<div className='flex gap-2 items-center'>
										<Music2 className='w-5 h-5 mr-2 text-gray-500' />
										<p className='font-medium'>Studio Type</p>
									</div>
									<p className='text-sm text-gray-600'>
										{data.StudioType?.name || 'N/A'}
									</p>
								</div>
								<div className='flex justify-between items-center'>
									<div className='flex gap-2 items-center'>
										<DollarSign className='w-5 h-5 mr-2 text-gray-500' />
										<p className='font-medium'>Cost</p>
									</div>
									<p className='text-sm text-gray-600'>
										{formatCurrency(data.cost)}
									</p>
								</div>
								<div className='flex justify-between items-center'>
									<div className='flex gap-2 items-center'>
										<Package className='w-5 h-5 mr-2 text-gray-500' />
										<p className='font-medium'>Gear Items</p>
									</div>
									<p className='text-sm text-gray-600'>
										{data.gearItems && data.gearItems.length > 0
											? `${data.gearItems.length} items requested`
											: 'No gear items requested'}
									</p>
								</div>
							</div>
						</div>
						<div>
							<h3 className='text-xl font-semibold mb-4'>User Information</h3>
							<div className='flex items-center space-x-4 mb-4'>
								<Avatar className='w-16 h-16'>
									<AvatarImage src={data.User?.image || ''} />
									<AvatarFallback className='text-2xl'>
										{data.User?.username?.charAt(0).toUpperCase() || 'U'}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className='font-medium text-lg'>{data.User?.username}</p>
									<p className='text-sm text-gray-600'>{data.User?.email}</p>
								</div>
							</div>
							<div className='bg-gray-100 p-4 rounded-lg'>
								<h4 className='font-medium mb-2'>Session Timeline</h4>
								<div className='relative pt-1'>
									<div className='flex mb-2 items-center justify-between'>
										<div>
											<span className='text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-200 text-green-800'>
												Start
											</span>
										</div>
										<div className='text-right'>
											<span className='text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-red-200 text-red-800'>
												End
											</span>
										</div>
									</div>
									<div className='overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200'>
										<div
											style={{ width: '100%' }}
											className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500'></div>
									</div>
									<div className='flex justify-between text-xs text-gray-600'>
										<span>{format(new Date(data.startTime), 'p')}</span>
										<span>{format(new Date(data.endTime), 'p')}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function StudioRequestSkeleton() {
	return (
		<div className='py-8 px-4 md:px-0'>
			<div className='pb-4'>
				<Skeleton className='flex items-center h-8 w-32 hover:text-blue-500' />
			</div>
			<Card>
				<CardHeader className='p-6'>
					<Skeleton className='h-8 w-3/4 mb-2' />
					<Skeleton className='h-4 w-1/2' />
				</CardHeader>
				<CardContent className='p-6'>
					<div className='grid md:grid-cols-2 gap-8'>
						<div className='flex flex-col justify-between'>
							{[...Array(5)].map((_, i) => (
								<div key={i} className='flex justify-between items-center'>
									<div className='flex gap-2 items-center'>
										<Skeleton className='w-5 h-5 mr-2' />
										<Skeleton className='h-4 w-24' />
									</div>
									<Skeleton className='h-3 w-32' />
								</div>
							))}
						</div>
						<div>
							<div className='flex items-center space-x-4 mb-4'>
								<Skeleton className='w-16 h-16 rounded-full' />
								<div className='space-y-2'>
									<Skeleton className='h-4 w-32' />
									<Skeleton className='h-3 w-48' />
								</div>
							</div>
							<Skeleton className='h-32 w-full' />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
