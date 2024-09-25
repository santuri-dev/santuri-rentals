'use client';

import { Input } from '@/components/ui/input';
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
import { request } from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import DatePicker from '@/components/ui/date-picker';
import Editor from '../Editor';

const courseFormSchema = z.object({
	name: z.string().min(1, { message: 'Name cannot be empty' }),
	description: z.string().min(1, { message: 'Description cannot be empty' }),
	location: z.string().min(1, { message: 'Location cannot be empty' }),
	startDate: z.date({ required_error: 'A start date is required' }),
	endDate: z.date({ required_error: 'An end date is required' }),
	duration: z.string().min(1, { message: 'Duration cannot be empty' }),
	applicationDeadline: z.date({
		required_error: 'An application deadline is required',
	}),
	cost: z.coerce.number(),
});

export type CourseFormInput = z.infer<typeof courseFormSchema>;

export default function CourseForm({
	defaultValues,
	onSubmit,
}: {
	defaultValues?: Partial<CourseFormInput> & { id: number };
	onSubmit?: () => Promise<void>;
}) {
	const [submitting, setSubmitting] = useState(false);

	const form = useForm<CourseFormInput>({
		resolver: zodResolver(courseFormSchema),
		mode: 'onChange',
		defaultValues: defaultValues || {
			name: '',
			description: '',
			location: '',
			startDate: new Date(),
			endDate: new Date(),
			duration: '',
			applicationDeadline: new Date(),
			cost: 0,
		},
	});

	async function handleSubmit(data: CourseFormInput) {
		setSubmitting(true);

		if (defaultValues) {
			try {
				await request.put(`/courses/edit/${defaultValues.id}`, data);
				toast({
					title: 'Success',
					description: 'Successfully edited course',
				});
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Something went wrong while editing the course',
				});
			}
		} else {
			try {
				await request.post('/courses', data);
				toast({
					title: 'Success',
					description: 'Successfully added course',
				});
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Something went wrong while adding the course',
				});
			}
		}

		if (onSubmit) await onSubmit();

		setSubmitting(false);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Course Name</FormLabel>
							<FormControl>
								<Input placeholder='Enter course name' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Editor {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='cost'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cost</FormLabel>
							<FormControl>
								<Input placeholder='Enter course cost' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='location'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Location</FormLabel>
							<FormControl>
								<Input placeholder='Enter course location' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className='grid grid-cols-2 gap-4'>
					<FormField
						control={form.control}
						name='startDate'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>Start Date</FormLabel>
								<FormControl>
									<DatePicker
										selected={field.value}
										onChange={field.onChange}
										placeholderText='Select start date'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='endDate'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>End Date</FormLabel>
								<FormControl>
									<DatePicker
										selected={field.value}
										onChange={field.onChange}
										placeholderText='Select end date'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='applicationDeadline'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>Application Deadline</FormLabel>
								<FormControl>
									<DatePicker
										selected={field.value}
										onChange={field.onChange}
										placeholderText='Select deadline'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='duration'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>Duration</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter duration (e.g. 6 weeks)'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button
					variant='default'
					className='w-full'
					disabled={!form.formState.isValid || submitting}
					type='submit'>
					{submitting ? (
						<Dots size='24' />
					) : defaultValues ? (
						'Update Course'
					) : (
						'Add Course'
					)}
				</Button>
			</form>
		</Form>
	);
}
