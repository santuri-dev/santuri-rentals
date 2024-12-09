'use client';

import { useState } from 'react';
import { addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import Dots from '@/components/Loaders/Dots';
import { request } from '@/lib/axios';

const defaultFrom = new Date();
const defaultTo = addDays(new Date(), 1);

const restrictedDatesFormSchema = z.object({
	dateRange: z.object({
		from: z.date(),
		to: z.date().optional(),
	}),
});

type RestrictedDatesFormInput = z.infer<typeof restrictedDatesFormSchema>;

export default function RestrictedDatesForm({
	defaultValues,
	onSubmit,
}: {
	defaultValues?: Partial<RestrictedDatesFormInput>;
	onSubmit?: () => Promise<void>;
}) {
	const [submitting, setSubmitting] = useState(false);

	const form = useForm<RestrictedDatesFormInput>({
		resolver: zodResolver(restrictedDatesFormSchema),
		mode: 'onChange',
		defaultValues: defaultValues || {
			dateRange: {
				from: defaultFrom,
				to: defaultTo,
			},
		},
	});

	async function handleSubmit(data: RestrictedDatesFormInput) {
		setSubmitting(true);
		try {
			await request.post('/studio/restricted-dates', {
				from: data.dateRange.from.toISOString(),
				to: data.dateRange.to ? data.dateRange.to.toISOString() : undefined,
			});
			toast({
				title: 'Success',
				description: 'Date range submitted successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong while submitting the date range',
			});
		}
		if (onSubmit) await onSubmit();
		setSubmitting(false);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name='dateRange'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Date Range</FormLabel>
							<FormControl>
								<DatePickerWithRange
									from={field.value.from}
									to={field.value.to}
									onDateRangeChange={(range: DateRange) => {
										field.onChange({
											from: range.from || defaultFrom,
											to: range.to,
										});
									}}
									className='w-full'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					variant='default'
					className='w-full mt-2'
					disabled={!form.formState.isValid || submitting}
					type='submit'>
					{submitting ? (
						<Dots size='24' />
					) : defaultValues ? (
						'Update Date Range'
					) : (
						'Submit Date Range'
					)}
				</Button>
			</form>
		</Form>
	);
}
