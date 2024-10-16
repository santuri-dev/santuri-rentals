'use client';

import { useForm } from 'react-hook-form';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { request } from '@/lib/axios';
import * as z from 'zod';
import Dots from '../Loaders/Dots';
import { toast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';

const checkoutFormSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().email(),
	phoneNumber: z.string(),
});

type CheckoutInput = z.infer<typeof checkoutFormSchema>;

export default function CheckoutForm({
	afterSubmit,
}: {
	afterSubmit?: () => Promise<unknown>;
}) {
	const form = useForm<CheckoutInput>({
		resolver: zodResolver(checkoutFormSchema),
		mode: 'onChange',
	});
	const [submitting, setSubmitting] = useState(false);
	// const [redirectUri, setRedirectUri] = useState('');
	const { cart } = useCart();

	async function onSubmit() {
		setSubmitting(true);
		try {
			const res = await request.post('/shop/checkout', {
				billingAddress: form.getValues(),
				items: cart.map(({ product, quantity }) => ({
					quantity,
					productId: product.id,
				})),
			});
			// setRedirectUri(res.data.redirect_url);
			toast({ title: 'Success', description: res.data.message });
			form.reset();
			window.location = res.data.data.redirect_url;
		} catch (e) {
			toast({
				title: 'Failed to initiate checkout',
			});
		}
		if (afterSubmit) void afterSubmit();
		setSubmitting(false);
	}

	return (
		<div className='border rounded-md w-full h-fit'>
			<div className='w-full flex justify-between items-center px-6 py-4 border-b bg-slate-900 rounded-t-md'>
				<p className='font-semibold'>{`Checkout`}</p>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='md:flex space-y-4 md:space-y-0 w-full gap-8 px-6 py-4'>
					<div className='w-full space-y-4'>
						<div className='w-full grid grid-cols-1 gap-4 md:grid-cols-2 items-center'>
							<FormField
								control={form.control}
								name='firstName'
								render={({ field }) => (
									<FormItem className='w-full'>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input placeholder='First Name' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='lastName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input placeholder='Last Name' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input type='email' placeholder='Email' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='phoneNumber'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number</FormLabel>
										<FormControl>
											<Input type='tel' placeholder='Phone Number' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className='w-full'>
							<Button
								type='submit'
								disabled={!form.formState.isValid || submitting}
								className={'w-full'}>
								{submitting ? <Dots size={'24'} /> : 'Proceed to Checkout'}
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}
