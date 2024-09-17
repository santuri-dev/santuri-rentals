'use client';

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
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { request } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Dots from '@/components/Loaders/Dots';
import { Input } from '@/components/ui/input';

const requestResetFormSchema = z.object({
	email: z.string().email(),
});

type RequestResetInput = z.infer<typeof requestResetFormSchema>;

export default function RequestReset() {
	const [submitting, setSubmitting] = useState(false);
	const { push } = useRouter();
	const { status } = useAuth();

	const form = useForm<RequestResetInput>({
		resolver: zodResolver(requestResetFormSchema),
		mode: 'onChange',
		defaultValues: { email: '' },
	});

	async function onSubmit({ email }: RequestResetInput) {
		setSubmitting(true);
		try {
			const res = await request.post('/auth/reset-password-token', {
				email,
			});
			toast({ title: res.data.message });
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			toast({ title: err.response.data.message });
		}

		setSubmitting(false);
	}

	if (status === 'authenticated') {
		push('/');
	}

	return (
		<div className='mx-auto w-full max-w-md space-y-6'>
			<div className='text-center space-y-6'>
				<h1 className='text-lg font-semibold tracking-tight text-foreground'>
					Reset your password
				</h1>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='w-full mb-4'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder='Enter your Email' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button
						className='w-full'
						disabled={!form.formState.isValid || submitting}
						type='submit'>
						{submitting ? <Dots size={'24'} /> : 'Submit'}
					</Button>
				</form>
			</Form>
		</div>
	);
}
