'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, addHours, isBefore, setHours, setMinutes } from 'date-fns';
import { toast } from '@/hooks/use-toast';

type TimeOption = string;
type DurationOption = string;

interface TimeSelectorProps {
	selectedTime: TimeOption | null;
	setSelectedTime: (time: TimeOption | null) => void;
	selectedDuration: DurationOption | null;
	setSelectedDuration: (duration: DurationOption | null) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
	selectedTime,
	setSelectedTime,
	selectedDuration,
	setSelectedDuration,
}) => {
	const [openDialog, setOpenDialog] = useState(false);

	const times: TimeOption[] = [
		'12am',
		'1am',
		'2am',
		'3am',
		'4am',
		'5am',
		'6am',
		'7am',
		'8am',
		'9am',
		'10am',
		'11am',
		'12pm',
		'1pm',
		'2pm',
		'3pm',
		'4pm',
		'5pm',
		'6pm',
		'7pm',
		'8pm',
		'9pm',
		'10pm',
		'11pm',
	];
	const durations: DurationOption[] = [
		'1 hr',
		'2 hrs',
		'3 hrs',
		'4 hrs',
		'5 hrs',
		'6 hrs',
		'7 hrs',
		'8 hrs',
		'9 hrs',
		'10 hrs',
		'12 hrs',
		'24 hrs',
	];

	return (
		<div className='flex items-center gap-4 w-full justify-between'>
			<div className='w-full'>
				<label className='text-sm font-medium mb-2 block'>Start Time</label>
				<Dialog open={openDialog} onOpenChange={setOpenDialog}>
					<DialogTrigger asChild>
						<Button
							variant='outline'
							className='w-full justify-start text-left font-normal'>
							<Clock className='mr-2 h-4 w-4' />
							{selectedTime ? selectedTime : 'Select start time'}
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogTitle>Select Time</DialogTitle>
						<DialogDescription>
							Select the time to start your session
						</DialogDescription>
						<ScrollArea className='h-[300px] p-4'>
							<div className='grid grid-cols-4 gap-2'>
								{times.map((time) => (
									<Button
										key={time}
										variant={selectedTime === time ? 'default' : 'outline'}
										className='w-full'
										onClick={() => {
											setSelectedTime(time);
											setOpenDialog(false);
										}}>
										{time}
									</Button>
								))}
							</div>
						</ScrollArea>
					</DialogContent>
				</Dialog>
			</div>
			<div className='w-full'>
				<label className='text-sm font-medium mb-2 block'>Duration</label>
				<Select
					value={selectedDuration || undefined}
					onValueChange={(value: DurationOption) => setSelectedDuration(value)}>
					<SelectTrigger className='w-full'>
						<SelectValue placeholder='Select duration' />
					</SelectTrigger>
					<SelectContent>
						{durations.map((duration) => (
							<SelectItem key={duration} value={duration}>
								{duration}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};

export default function Page() {
	const [date, setDate] = useState<Date>(new Date());
	const [selectedTime, setSelectedTime] = useState<TimeOption | null>(null);
	const [selectedDuration, setSelectedDuration] =
		useState<DurationOption | null>(null);
	const [type, setType] = useState<'dj' | 'recording'>('dj');

	const parseTime = (time: string): { hours: number; minutes: number } => {
		const [timePart, period] = time.match(/(\d+)(am|pm)/i)!.slice(1);
		const hours =
			period.toLowerCase() === 'pm' && timePart !== '12'
				? parseInt(timePart) + 12
				: parseInt(timePart);
		return { hours: hours % 24, minutes: 0 };
	};

	const parseDuration = (duration: string): number => {
		return parseInt(duration);
	};

	function handleSubmit() {
		if (!date || !selectedTime || !selectedDuration) return;

		const currentDate = new Date();
		const { hours, minutes } = parseTime(selectedTime);
		const startTime = setHours(setMinutes(new Date(date), minutes), hours);

		if (isBefore(startTime, currentDate)) {
			toast({
				title: 'Error',
				description: 'The selected start time must be in the future.',
			});
			return;
		}

		const durationHours = parseDuration(selectedDuration);
		const endTime = addHours(startTime, durationHours);

		console.log({
			startTime,
			endTime,
			type,
		});
	}

	return (
		<div className='py-6'>
			<div className='flex flex-col gap-6 pb-6'>
				<h2 className='font-semibold text-lg'>Book a Session</h2>
				<p className='text-sm'>
					Book a studio session by selecting your preferred date, start time,
					and session duration. Choose between the DJ or Recording Studio and
					review the available equipment for each option.
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
						/>
					</div>
				</div>
				<div>
					<div className='mb-4'>
						<h2 className='font-semibold text-lg'>Studio Type</h2>
					</div>
					<div>
						<Tabs defaultValue='dj'>
							<TabsList className='grid w-full grid-cols-2'>
								<TabsTrigger onClick={() => setType('dj')} value='dj'>
									DJ
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
											essential to your session, please ensure you bring your
											own
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
						</Tabs>
					</div>
				</div>
				<div className='mt-6'>
					<Button
						onClick={handleSubmit}
						size='default'
						disabled={!date || !selectedTime || !selectedDuration}>
						Book Session
					</Button>
				</div>
			</div>
		</div>
	);
}
