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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import ArrayInput from '../ArrayInput';
import { request } from '@/lib/axios';
import { toast } from '@/hooks/use-toast';

const gearFormSchema = z.object({
	name: z.string().min(1, { message: 'Name cannot be empty' }),
	serialNumber: z.string().min(1, { message: 'Serial number cannot be empty' }),
	condition: z.enum(['mint', 'good', 'bad'], {
		message: 'Please select a valid condition',
	}),
	peripherals: z.array(z.string()),
	notes: z.string().nullable(),
	status: z.enum(['available', 'class', 'borrowed', 'lease', 'overdue'], {
		message: 'Please select a valid status',
	}),
});

export type GearFormInput = z.infer<typeof gearFormSchema>;

export default function GearForm({
	defaultValues,
	onSubmit,
}: {
	defaultValues?: Partial<GearFormInput> & { id: number };
	onSubmit?: () => Promise<void>;
}) {
	const [submitting, setSubmitting] = useState(false);

	const form = useForm<GearFormInput>({
		resolver: zodResolver(gearFormSchema),
		mode: 'onChange',
		defaultValues: defaultValues || {
			name: '',
			serialNumber: '',
			condition: 'mint',
			status: 'available',
			peripherals: [],
			notes: '',
		},
	});

	async function handleSubmit(data: GearFormInput) {
		setSubmitting(true);

		if (defaultValues) {
			try {
				await request.put(`/gear/edit/${defaultValues.id}`, data);
				toast({
					title: 'Success',
					description: 'Successfully edited gear',
				});
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Something went wrong while editing gear',
				});
			}
		} else {
			try {
				await request.post('/gear/add', data);
				toast({
					title: 'Success',
					description: 'Successfully added gear',
				});
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Something went wrong while adding gear',
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
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder='Enter gear name' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='serialNumber'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Serial Number</FormLabel>
							<FormControl>
								<Input placeholder='Enter serial number' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className='flex space-x-4 items-center'>
					<FormField
						control={form.control}
						name='condition'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormLabel>Condition</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Select Condition' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{gearFormSchema.shape.condition._def.values.map((v) => (
											<SelectItem value={v} key={v}>
												{v}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='status'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormLabel>Status</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Select Status' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{gearFormSchema.shape.status._def.values.map((v) => (
											<SelectItem value={v} key={v}>
												{v}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name='peripherals'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Peripherals</FormLabel>
							<FormControl>
								<ArrayInput
									values={field.value}
									onChange={(values) => {
										form.setValue('peripherals', values);
									}}
									placeholder='Add peripherals'
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='notes'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Notes (Optional)</FormLabel>
							<FormControl>
								<Input
									placeholder='Any additional notes'
									{...field}
									value={field.value ?? ''}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					variant='default'
					className='w-full'
					disabled={!form.formState.isValid || submitting}
					type='submit'>
					{submitting ? (
						<Dots size='24' />
					) : defaultValues ? (
						'Update Gear'
					) : (
						'Add Gear'
					)}
				</Button>
			</form>
		</Form>
	);
}
