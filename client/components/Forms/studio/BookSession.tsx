'use client';

import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
	format,
	addHours,
	isBefore,
	setHours,
	setMinutes,
	setMilliseconds,
	setSeconds,
	differenceInMinutes,
} from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Discounts, Gear, StudioType } from '@/lib/types';
import { DataTable } from '@/components/DataTable';
import { gearColumns } from '@/components/Tables/GearTable/columns';
import { availableGearOpts } from '@/lib/api';
import { request } from '@/lib/axios';
import Dots from '@/components/Loaders/Dots';
import { useQuery } from '@tanstack/react-query';
import TimeSelector, {
	AllocatedSlot,
	DurationOption,
	TimeOption,
} from '@/components/Forms/studio/TimeSelector';
import { formatCurrency, parseDuration, parseTime } from '@/lib/helpers';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function BookSession() {
	const [date, setDate] = useState<Date>(new Date());
	const [selectedTime, setSelectedTime] = useState<TimeOption | null>(null);
	const [selectedDuration, setSelectedDuration] =
		useState<DurationOption | null>(null);
	const [gearItems, setWorkstationItems] = useState<Gear[]>([]);
	const [type, setType] = useState<StudioType | null>(null);
	const { status, user } = useAuth();
	const [cost, setCost] = useState(0);

	const { data: discounts } = useQuery<Discounts>({
		initialData: { name: '', gearDiscount: 0, studioDiscount: 0 },
		queryKey: ['discounts', user?.role],
		async queryFn() {
			const { data } = (
				await request.get(`/studio/discounts?role=${user?.role}`)
			).data;

			return data[0];
		},
	});

	// Fetch studio types
	const {
		data: studioTypes,
		isFetching,
		refetch: refetchStudioTypes,
	} = useQuery<StudioType[]>({
		initialData: [],
		queryKey: ['studio_types'],
		queryFn: async () => {
			const { data } = (await request.get('/studio/types')).data;
			const sorted = (data as StudioType[]).toSorted(
				(a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0)
			);

			return sorted;
		},
	});

	useEffect(() => {
		if (selectedTime && selectedDuration && type) {
			const currentDate = new Date();
			const { hours, minutes } = parseTime(selectedTime);
			const startTime = setHours(setMinutes(new Date(date), minutes), hours);

			if (isBefore(startTime, currentDate)) {
				toast({
					title: 'Error',
					description: 'The selected start time must be in the future.',
				});
				setLoading(false);
				return;
			}

			const durationHours = parseDuration(selectedDuration);
			const endTime = addHours(startTime, durationHours);

			const selectedStartTime = setMilliseconds(
				setSeconds(setMinutes(new Date(startTime), 0), 0),
				0
			);

			const selectedEndTime = setMilliseconds(
				setSeconds(setMinutes(new Date(endTime), 0), 0),
				0
			);

			const durationInMinutes = differenceInMinutes(
				selectedEndTime,
				selectedStartTime
			);
			const tHours = Math.floor(durationInMinutes / 60);
			const tMinutes = durationInMinutes % 60;

			const tCost = type.pricing * tHours + (type.pricing * tMinutes) / 60;
			const dCost = tCost * (1 - discounts.studioDiscount / 100);
			setCost(dCost);
		}
	}, [date, selectedDuration, selectedTime, type, discounts.studioDiscount]);

	// Set initial type when studioTypes data is available and type is not already set
	useEffect(() => {
		if (studioTypes && studioTypes.length > 0 && !type) {
			setType(studioTypes[0]);
		}
	}, [studioTypes, type]);

	// Fetch allocated slots
	const { data: allocatedSlots, refetch: refetchSlots } = useQuery<
		AllocatedSlot[]
	>({
		initialData: [],
		queryKey: ['allocated_times', date.toISOString()],
		queryFn: async () => {
			const { data } = (
				await request.post('/studio/requests', {
					date: date.toISOString(),
					status: 'approved',
				})
			).data;
			return data;
		},
	});
	const [loading, setLoading] = useState(false);

	function reset() {
		setDate(new Date());
		setSelectedDuration(null);
		setSelectedTime(null);
		setWorkstationItems([]);
		setCost(0);
	}

	async function handleSubmit() {
		setLoading(true);
		if (!date || !selectedTime || !selectedDuration) return;

		const currentDate = new Date();
		const { hours, minutes } = parseTime(selectedTime);
		const startTime = setHours(setMinutes(new Date(date), minutes), hours);

		if (isBefore(startTime, currentDate)) {
			toast({
				title: 'Error',
				description: 'The selected start time must be in the future.',
			});
			setLoading(false);
			return;
		}

		const durationHours = parseDuration(selectedDuration);
		const endTime = addHours(startTime, durationHours);

		try {
			const { message } = (
				await request.post('/studio', {
					startTime: new Date(startTime).toISOString(),
					endTime: new Date(endTime).toISOString(),
					typeId: type?.id,
					...(type?.name === 'workstation' ? { gearItems } : { gearItems: [] }),
				})
			).data;

			toast({ title: 'Success', description: message });
			reset();
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to book the session. Please try again.',
			});
		} finally {
			setLoading(false);
		}
	}

	const handleTypeChange = (id: string) => {
		const selectedType = studioTypes.find((v) => v.id === parseInt(id));
		if (selectedType) {
			setType(selectedType);
		}
	};

	if ((isFetching && studioTypes.length === 0) || (!type && isFetching)) {
		return <Skeleton className='w-full h-[60vh]' />;
	}

	function retry() {
		reset();
		refetchStudioTypes();
		refetchSlots();
	}

	if (!type) {
		return (
			<div className='w-full h-[60vh] flex-col space-y-4 items-center justify-center flex'>
				<p>Something went wrong</p>
				<Button variant={'secondary'} onClick={retry}>
					Retry
				</Button>
			</div>
		);
	}

	return (
		<div className='flex flex-col gap-6 pb-6'>
			<h2 className='font-semibold text-xl'>Book a Session</h2>
			<p className='text-sm'>
				Book a studio session by selecting your preferred date, start time, and
				session duration. Choose between the DJ or Recording Studio and review
				the available equipment for each option.
			</p>
			<div>
				<div className='mb-4'>
					<h2 className='font-semibold text-lg'>Details</h2>
				</div>
				<div className='space-y-4'>
					<div className='gap-2 grid grid-cols-1 md:grid-cols-2 items-center'>
						<div>
							<Label className='text-sm font-medium'>Location</Label>
							<Select disabled={true} defaultValue='the-mall'>
								<SelectTrigger className='mt-2'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='the-mall'>
										The Mall, WestLands, Nairobi
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label className='text-sm font-medium mb-2'>Date</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant={'outline'}
										className={cn(
											'mt-2 w-full justify-start text-left font-normal',
											!date && 'text-muted-foreground'
										)}>
										<CalendarIcon className='mr-2 h-4 w-4' />
										{date ? format(date, 'PPP') : <span>Pick a date</span>}
									</Button>
								</PopoverTrigger>
								<PopoverContent className='w-auto p-0'>
									<Calendar
										fromDate={new Date()}
										mode='single'
										selected={date}
										onSelect={(newDate: Date | undefined) => {
											if (newDate) setDate(newDate);
										}}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>
					</div>
					<TimeSelector
						selectedTime={selectedTime}
						setSelectedTime={setSelectedTime}
						selectedDuration={selectedDuration}
						setSelectedDuration={setSelectedDuration}
						date={date}
						allocatedSlots={allocatedSlots}
					/>
				</div>
			</div>
			<div>
				<div className='mb-4'>
					<h2 className='font-semibold text-lg'>Studio Type</h2>
				</div>
				<div>
					<Select onValueChange={handleTypeChange} value={`${type.id}`}>
						<SelectTrigger className='md:hidden w-full'>
							<SelectValue placeholder='Select Studio Type' />
						</SelectTrigger>
						<SelectContent>
							{studioTypes.map((type) => (
								<SelectItem
									key={`${type.name}~${type.id}`}
									value={`${type.id}`}>
									{type.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Tabs value={`${type.id}`} onValueChange={handleTypeChange}>
						<TabsList className='md:w-full md:grid md:grid-cols-4 hidden'>
							{studioTypes.map(({ id, name }) => (
								<TabsTrigger key={id} value={`${id}`}>
									{name}
								</TabsTrigger>
							))}
						</TabsList>
						{studioTypes.map(({ id, description, name }) =>
							name.toLowerCase() === 'workstation' ? (
								<TabsContent key={id} value={`${id}`}>
									<div className='mt-4 space-y-4'>
										<div
											dangerouslySetInnerHTML={{ __html: description }}
											className='mt-4 space-y-4 leading-relaxed'
										/>
										<DataTable
											title=''
											columns={gearColumns}
											opts={availableGearOpts}
											selectActions={{
												title: 'Items',
												actions: [
													{
														name: 'Request for Session',
														async action(rows, updateLoading) {
															setWorkstationItems(rows);
															updateLoading();
															const itemNames = rows
																.map((row) => row.name)
																.join(', ');
															const readableNames = itemNames.replace(
																/, ([^,]*)$/,
																' and $1'
															);
															toast({
																title: 'Success',
																description: `Successfully added ${readableNames} to request`,
															});
															return Promise.resolve();
														},
													},
												],
											}}
										/>
									</div>
								</TabsContent>
							) : (
								<TabsContent key={id} value={`${id}`}>
									<div className='px-6 list-decimal'>
										<div
											dangerouslySetInnerHTML={{ __html: description }}
											className='mt-4 space-y-4 text-md leading-relaxed list-disc'
										/>
									</div>
								</TabsContent>
							)
						)}
					</Tabs>
				</div>
			</div>
			<div className='mt-6 flex gap-4'>
				{status === 'authenticated' ? (
					<div className='flex items-center gap-2'>
						<Button
							onClick={handleSubmit}
							size='default'
							disabled={!date || !selectedTime || !selectedDuration || loading}>
							{loading ? <Dots /> : `Book Session ${formatCurrency(cost)}`}
						</Button>
						{discounts.studioDiscount ? (
							<p className='text-sm'>{`${discounts.studioDiscount}% discount`}</p>
						) : null}
					</div>
				) : (
					<Button asChild>
						<Link href='/auth/login'>Login to Book</Link>
					</Button>
				)}
			</div>
		</div>
	);
}
