'use client';

import React, { useState } from 'react';
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
import { format, addHours, isBefore, setHours, setMinutes } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Gear } from '@/lib/types';
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
import { parseDuration, parseTime } from '@/lib/helpers';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

export default function BookSession() {
	const [date, setDate] = useState<Date>(new Date());
	const [selectedTime, setSelectedTime] = useState<TimeOption | null>(null);
	const [selectedDuration, setSelectedDuration] =
		useState<DurationOption | null>(null);
	const [type, setType] = useState<
		'dj' | 'recording' | 'rehearsals' | 'workstation'
	>('dj');
	const [gearItems, setWorkstationItems] = useState<Gear[]>([]);
	const { data: allocatedSlots } = useQuery<AllocatedSlot[]>({
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
	const { status } = useAuth();

	function reset() {
		setDate(new Date());
		setSelectedDuration(null);
		setSelectedTime(null);
		setWorkstationItems([]);
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
					type,
					...(type === 'workstation' ? { gearItems } : { gearItems: [] }),
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
					<div className='gap-2 grid grid-cols-2 items-center'>
						<div>
							<label className='text-sm font-medium'>Location</label>
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
							<label className='text-sm font-medium mb-2'>Date</label>
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
					<Tabs defaultValue='dj'>
						<TabsList className='grid w-full grid-cols-4'>
							<TabsTrigger onClick={() => setType('dj')} value='dj'>
								DJ
							</TabsTrigger>
							<TabsTrigger
								onClick={() => setType('rehearsals')}
								value='rehearsals'>
								Rehearsal
							</TabsTrigger>
							<TabsTrigger
								onClick={() => setType('workstation')}
								value='workstation'>
								Workstation
							</TabsTrigger>
							<TabsTrigger
								onClick={() => setType('recording')}
								value='recording'>
								Recording
							</TabsTrigger>
						</TabsList>
						<TabsContent value='dj'>
							<div className='mt-4 space-y-4'>
								<h3 className='font-semibold'>DJ Studio Equipment</h3>
								<ul className='list-disc pl-5 space-y-2 text-sm'>
									<li>Space for beginners and a solo mixing session</li>
									<li>Includes a 2-deck Pioneer setup</li>
									<li>Please bring your own headphones</li>
									<li>
										We do not provide a Microphone or XLR in DJ Studios - if
										essential to your session, please ensure you bring your own
									</li>
								</ul>
							</div>
						</TabsContent>
						<TabsContent value='recording'>
							<div className='mt-4 space-y-4'>
								<h3 className='font-semibold'>Recording Studio Equipment</h3>
								<ul className='list-disc pl-5 space-y-2 text-sm'>
									<li>Professional-grade microphones and audio interfaces</li>
									<li>Studio monitors and acoustic treatment</li>
									<li>Digital Audio Workstation (DAW) software</li>
									<li>
										MIDI controllers and synthesizers available upon request
									</li>
								</ul>
							</div>
						</TabsContent>
						<TabsContent value='rehearsals'>
							<div className='mt-4 space-y-4'>
								<h3 className='font-semibold'>Rehearsal Equipment</h3>
								<ul className='list-disc pl-5 space-y-2 text-sm'>
									<li>Professional-grade microphones and audio interfaces</li>
									<li>Studio monitors and acoustic treatment</li>
									<li>Digital Audio Workstation (DAW) software</li>
									<li>
										MIDI controllers and synthesizers available upon request
									</li>
								</ul>
							</div>
						</TabsContent>
						<TabsContent value='workstation'>
							<div className='mt-4 space-y-4'>
								<h3 className='font-semibold'>Workstation Equipment</h3>
								<p className='text-sm'>
									Select Items that you would like to request for your
									workstation
								</p>
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
													'use server';
													setWorkstationItems(rows);
													updateLoading();
													const itemNames = rows
														.map((row) => row.name) // Extract the 'name' property from each object in 'rows'
														.join(', '); // Join the names with a comma and space

													// If there are more than one name, replace the last comma with 'and'
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
					</Tabs>
				</div>
			</div>
			<div className='mt-6 flex gap-4'>
				{status === 'authenticated' ? (
					<Button
						onClick={handleSubmit}
						size='default'
						disabled={!date || !selectedTime || !selectedDuration || loading}>
						{loading ? <Dots /> : 'Book Session'}
					</Button>
				) : (
					<Button asChild>
						<Link href='/auth/login'>Login to Book</Link>
					</Button>
				)}
			</div>
		</div>
	);
}
