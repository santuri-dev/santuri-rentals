'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Dots from '@/components/Loaders/Dots';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

const dateSelectionSchema = z.object({
	dateRange: z
		.object({
			from: z.date(),
			to: z.date(),
		})
		.refine((data) => data.from <= data.to, {
			message: 'Return date must be after pickup date',
			path: ['to'],
		}),
});

type DateSelectionInput = z.infer<typeof dateSelectionSchema>;

interface DateSelectionFormProps {
	onSubmit: (data: { pickupDate: Date; returnDate: Date }) => Promise<void>;
	onCancel: () => void;
}

export default function DateSelectionForm({
	onSubmit,
	onCancel,
}: DateSelectionFormProps) {
	const [submitting, setSubmitting] = useState(false);
	const from = new Date();
	const to = new Date(new Date().setDate(new Date().getDate() + 7));

	const form = useForm<DateSelectionInput>({
		resolver: zodResolver(dateSelectionSchema),
		mode: 'onChange',
		defaultValues: {
			dateRange: {
				from,
				to,
			},
		},
	});

	async function handleSubmit(data: DateSelectionInput) {
		setSubmitting(true);
		await onSubmit({
			pickupDate: data.dateRange.from,
			returnDate: data.dateRange.to,
		});
		setSubmitting(false);
	}

	return (
		<div className='w-full max-w-md space-y-6'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<div className='w-full mb-4 space-y-4'>
						<FormField
							control={form.control}
							name='dateRange'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel>Pickup and Return Dates</FormLabel>
									<FormControl>
										<DatePickerWithRange
											from={from}
											to={to}
											className='w-full'
											onDateRangeChange={(v) => {
												field.onChange(v);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className='flex justify-between space-x-2'>
						<Button variant='outline' onClick={onCancel} type='button'>
							Cancel
						</Button>
						<Button
							variant='default'
							disabled={!form.formState.isValid || submitting}
							type='submit'>
							{submitting ? <Dots size='24' /> : 'Submit'}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
