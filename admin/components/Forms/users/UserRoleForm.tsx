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
import useLazyQuery from '@/hooks/use-lazy-query';
import { userRolesOpts } from '@/lib/api';
import { UserRole } from '@/lib/types';

const roleFormSchema = z.object({
	name: z.string().min(1, { message: 'Role name cannot be empty' }),
	gearDiscount: z.coerce
		.number()
		.min(0, { message: 'Discount cannot be negative' })
		.max(100, { message: 'Discount cannot exceed 100%' }),
	studioDiscount: z.coerce
		.number()
		.min(0, { message: 'Discount cannot be negative' })
		.max(100, { message: 'Discount cannot exceed 100%' }),
});

export type RoleFormInput = z.infer<typeof roleFormSchema>;

export default function UserRolesForm({
	onSubmit,
	defaultValues,
}: {
	onSubmit?: () => Promise<void>;
	defaultValues?: Partial<RoleFormInput> & { id: number };
}) {
	const [submitting, setSubmitting] = useState(false);
	const { refetch } = useLazyQuery<UserRole[]>(userRolesOpts);

	const form = useForm<RoleFormInput>({
		resolver: zodResolver(roleFormSchema),
		mode: 'onChange',
		defaultValues: defaultValues || {
			name: '',
			gearDiscount: 0,
			studioDiscount: 0,
		},
	});

	async function handleSubmit(data: RoleFormInput) {
		setSubmitting(true);

		if (defaultValues) {
			try {
				await request.put(`/users/roles/${defaultValues.id}`, data);
				toast({
					title: 'Success',
					description: 'Successfully updated role',
				});
				await refetch();
			} catch (error) {
				toast({
					title: 'Error',
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					description: `Something went wrong while updating role. ${error.response.data.message}`,
				});
			}
		} else {
			try {
				await request.post('/users/roles', data);
				toast({
					title: 'Success',
					description: 'Successfully added role',
				});
				await refetch();
			} catch (error) {
				toast({
					title: 'Error',
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					description: `Something went wrong while adding role. ${error.response.data.message}`,
				});
			}
		}

		form.reset();
		setSubmitting(false);

		if (onSubmit) await onSubmit();
	}

	// async function handleDelete(id: number) {
	// 	try {
	// 		const { message } = (await request.delete(`/users/roles/${id}`)).data;
	// 		toast({
	// 			title: 'Success',
	// 			description: message,
	// 		});
	// 		if (onSubmit) await onSubmit();
	// 		await refetch();
	// 	} catch (error) {
	// 		toast({
	// 			title: 'Error',
	// 			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// 			// @ts-ignore
	// 			description: `Something went wrong while deleting role. ${error.response.data.message}`,
	// 		});
	// 	}
	// }

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Role Name</FormLabel>
							<FormControl>
								<Input placeholder='Enter role name' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='gearDiscount'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Gear Discount (%)</FormLabel>
							<FormControl>
								<Input
									min={0}
									max={100}
									type='number'
									placeholder='Enter gear discount'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='studioDiscount'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Studio Discount (%)</FormLabel>
							<FormControl>
								<Input
									min={0}
									max={100}
									type='number'
									placeholder='Enter studio discount'
									{...field}
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
					{submitting ? <Dots size='24' /> : 'Add Role'}
				</Button>
			</form>
		</Form>
	);
}
