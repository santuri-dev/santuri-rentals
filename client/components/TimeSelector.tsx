'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	addHours,
	setHours,
	setMinutes,
	isWithinInterval,
	parseISO,
	isSameHour,
	subMilliseconds,
} from 'date-fns';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useCallback, useState } from 'react';
import { Button } from './ui/button';
import { Clock } from 'lucide-react';
import { parseDuration, parseTime } from '@/lib/helpers';

export type TimeOption = string;
export type DurationOption = string;

interface TimeSelectorProps {
	selectedTime: TimeOption | null;
	setSelectedTime: (time: TimeOption | null) => void;
	selectedDuration: DurationOption | null;
	setSelectedDuration: (duration: DurationOption | null) => void;
	date: Date;
	allocatedSlots: AllocatedSlot[];
}

export interface AllocatedSlot {
	id: number;
	startTime: string;
	endTime: string;
	type: string;
}

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

const TimeSelector: React.FC<TimeSelectorProps> = ({
	selectedTime,
	setSelectedTime,
	selectedDuration,
	setSelectedDuration,
	date,
	allocatedSlots,
}) => {
	const [openDialog, setOpenDialog] = useState(false);

	const isTimeDisabled = useCallback(
		(time: TimeOption) => {
			const { hours, minutes } = parseTime(time);
			const selectedDateTime = setHours(
				setMinutes(new Date(date), minutes),
				hours
			);

			return allocatedSlots.some((slot) => {
				const slotStart = parseISO(slot.startTime);
				const slotEnd = subMilliseconds(parseISO(slot.endTime), 1); // Subtract 1 millisecond to not include the end hour

				// Check if the selected time is within the slot
				return isWithinInterval(selectedDateTime, {
					start: slotStart,
					end: slotEnd,
				});
			});
		},
		[date, allocatedSlots]
	);

	const isDurationDisabled = useCallback(
		(duration: DurationOption) => {
			if (!selectedTime) return false;

			const { hours, minutes } = parseTime(selectedTime);
			const startTime = setHours(setMinutes(new Date(date), minutes), hours);
			const endTime = addHours(startTime, parseDuration(duration));

			return allocatedSlots.some((slot) => {
				const slotStart = parseISO(slot.startTime);
				const slotEnd = parseISO(slot.endTime);

				// Allow selection if the start time is exactly at the end of an existing slot
				if (isSameHour(startTime, slotEnd)) {
					return false;
				}

				// Check for any overlap
				return (
					(startTime < slotEnd && endTime > slotStart) ||
					(startTime >= slotStart && startTime < slotEnd) ||
					(endTime > slotStart && endTime <= slotEnd)
				);
			});
		},
		[selectedTime, date, allocatedSlots]
	);

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
										disabled={isTimeDisabled(time)}
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
							<SelectItem
								key={duration}
								value={duration}
								disabled={isDurationDisabled(duration)}>
								{duration}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};

export default TimeSelector;
