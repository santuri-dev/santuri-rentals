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
import Editor from '../Editor';

const studioFormSchema = z.object({
	name: z.string().min(1, { message: 'Studio name cannot be empty' }),
	description: z.string().min(1, { message: 'Description cannot be empty' }),
	pricing: z.coerce
		.number()
		.min(0.01, { message: 'Pricing must be greater than 0' }),
});

export type StudioFormInput = z.infer<typeof studioFormSchema>;

export interface StudioType {
	id: number;
	name: string;
	description: string;
	pricing: number;
}

export default function StudioForm({
	defaultValues,
	onSubmit,
}: {
	defaultValues?: Partial<StudioFormInput> & { id: number };
	onSubmit?: () => Promise<void>;
}) {
	const [submitting, setSubmitting] = useState(false);

	const form = useForm<StudioFormInput>({
		resolver: zodResolver(studioFormSchema),
		mode: 'onChange',
		defaultValues: defaultValues || {
			name: '',
			description: '',
			pricing: 0,
		},
	});

	async function handleSubmit(data: StudioFormInput) {
		setSubmitting(true);

		if (defaultValues) {
			try {
				await request.put(`/studio/types/${defaultValues.id}`, data);
				toast({
					title: 'Success',
					description: 'Successfully updated studio',
				});
				if (onSubmit) await onSubmit();
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Something went wrong while updating studio',
				});
			}
		} else {
			try {
				await request.post('/studio/types', data);
				toast({
					title: 'Success',
					description: 'Successfully added studio',
				});
				if (onSubmit) await onSubmit();
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Something went wrong while adding studio',
				});
			}
		}

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
							<FormLabel>Studio Name</FormLabel>
							<FormControl>
								<Input placeholder='Enter studio name' {...field} />
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
					name='pricing'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Pricing (Hourly Rate)</FormLabel>
							<FormControl>
								<Input
									min={0.01}
									type='number'
									step='0.01'
									placeholder='Enter pricing rate'
									{...field}
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
						'Update Studio'
					) : (
						'Add Studio'
					)}
				</Button>
			</form>
		</Form>
	);
}
