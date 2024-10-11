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
import { useQuery } from '@tanstack/react-query';
import { Category } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const categoryFormSchema = z.object({
	name: z.string().min(1, { message: 'Category name cannot be empty' }),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;

export default function CategoriesForm({
	onSubmit,
}: {
	onSubmit?: () => Promise<void>;
}) {
	const [submitting, setSubmitting] = useState(false);
	const { data: categories, refetch } = useQuery<Category[]>({
		initialData: [],
		queryKey: ['product', 'categories'],
		queryFn: async () => {
			const { data } = (await request.get('/products/categories')).data;
			return data;
		},
	});

	const form = useForm<CategoryFormInput>({
		resolver: zodResolver(categoryFormSchema),
		mode: 'onChange',
		defaultValues: {
			name: '',
		},
	});

	async function handleSubmit(data: CategoryFormInput) {
		setSubmitting(true);

		try {
			await request.post('/products/categories', data);
			toast({
				title: 'Success',
				description: 'Successfully added category',
			});
			await refetch();
		} catch (error) {
			toast({
				title: 'Error',
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				description: `Something went wrong while adding category. ${error.response.data.message}`,
			});
		}

		form.reset();
		setSubmitting(false);
	}

	async function handleDelete(id: number) {
		try {
			const { message } = (await request.delete(`/products/categories/${id}`))
				.data;
			toast({
				title: 'Success',
				description: message,
			});
			if (onSubmit) await onSubmit();
			await refetch();
		} catch (error) {
			toast({
				title: 'Error',
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				description: `Something went wrong while deleting category. ${error.response.data.message}`,
			});
		}
	}

	return (
		<Form {...form}>
			<div className='flex items-center gap-1 flex-wrap'>
				{categories.map(({ id, name }) => (
					<Badge
						className='text-xs gap-2 py-[2px]'
						variant={'secondary'}
						key={id}>
						{name}
						<Button
							onClick={() => handleDelete(id)}
							type='button'
							className='h-4 w-4'
							size={'icon'}>
							<X className='h-4 w-4 p-0' />
						</Button>
					</Badge>
				))}
			</div>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category Name</FormLabel>
							<FormControl>
								<Input placeholder='Enter category name' {...field} />
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
					{submitting ? <Dots size='24' /> : 'Add Category'}
				</Button>
			</form>
		</Form>
	);
}
