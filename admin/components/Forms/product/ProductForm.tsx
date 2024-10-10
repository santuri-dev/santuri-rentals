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
import { request } from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@/lib/types';

const productFormSchema = z.object({
	name: z.string().min(1, { message: 'Product name cannot be empty' }),
	description: z.string().min(1, { message: 'Description cannot be empty' }),
	status: z.enum(['draft', 'published'], {
		message: 'Please select a valid status',
	}),
	price: z.coerce
		.number()
		.min(0.01, { message: 'Price must be greater than 0' }),
	currency: z.string().default('KES'),
	stock: z.coerce.number().min(0, { message: 'Stock cannot be negative' }),
	categoryId: z.coerce.number().optional(),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;

export default function ProductForm({
	defaultValues,
	onSubmit,
}: {
	defaultValues?: Partial<ProductFormInput> & { id: number };
	onSubmit?: () => Promise<void>;
}) {
	const [submitting, setSubmitting] = useState(false);
	const { data: categories } = useQuery<Category[]>({
		initialData: [],
		queryKey: ['product', 'categories'],
		queryFn: async () => {
			const { data } = (await request.get('/products/categories')).data;
			return data;
		},
	});

	const form = useForm<ProductFormInput>({
		resolver: zodResolver(productFormSchema),
		mode: 'onChange',
		defaultValues: defaultValues || {
			name: '',
			description: '',
			status: 'draft',
			price: 0,
			currency: 'KES',
			stock: 0,
		},
	});

	async function handleSubmit(data: ProductFormInput) {
		setSubmitting(true);

		if (defaultValues) {
			try {
				await request.put(`/products/${defaultValues.id}`, data);
				toast({
					title: 'Success',
					description: 'Successfully edited product',
				});
				if (onSubmit) await onSubmit();
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Something went wrong while editing product',
				});
			}
		} else {
			try {
				await request.post('/products', data);
				toast({
					title: 'Success',
					description: 'Successfully added product',
				});
				if (onSubmit) await onSubmit();
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Something went wrong while adding product',
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
							<FormLabel>Product Name</FormLabel>
							<FormControl>
								<Input placeholder='Enter product name' {...field} />
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
								<Textarea placeholder='Enter product description' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='price'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Price</FormLabel>
							<FormControl>
								<Input type='number' placeholder='Enter price' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='stock'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Stock</FormLabel>
							<FormControl>
								<Input
									type='number'
									placeholder='Enter stock quantity'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='categoryId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category</FormLabel>
							<Select
								disabled={categories.length === 0}
								onValueChange={field.onChange}
								defaultValue={`${field.value}`}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Select category' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{[...categories, { id: 0, name: 'none' }].map((category) => (
										<SelectItem value={`${category.id}`} key={category.id}>
											{category.name}
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
						<FormItem>
							<FormLabel>Status</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder='Select status' />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{productFormSchema.shape.status._def.values.map((v) => (
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

				<Button
					variant='default'
					className='w-full'
					disabled={!form.formState.isValid || submitting}
					type='submit'>
					{submitting ? (
						<Dots size='24' />
					) : defaultValues ? (
						'Update Product'
					) : (
						'Add Product'
					)}
				</Button>
			</form>
		</Form>
	);
}
