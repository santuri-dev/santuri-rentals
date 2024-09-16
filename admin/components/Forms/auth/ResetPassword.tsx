'use client';

import Link from 'next/link';
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
import { PasswordInput } from '../PasswordInput';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { request } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Dots from '@/components/Loaders/Dots';

const resetPasswordFormSchema = z
	.object({
		password: z.string().min(8, 'Password is too short'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

type ResetPasswordInput = z.infer<typeof resetPasswordFormSchema>;

export default function ResetPassword({ token }: { token: string }) {
	const [submitting, setSubmitting] = useState(false);
	const { status } = useAuth();
	const { push } = useRouter();

	const form = useForm<ResetPasswordInput>({
		resolver: zodResolver(resetPasswordFormSchema),
		mode: 'onChange',
		defaultValues: { confirmPassword: '', password: '' },
	});

	async function onSubmit({ password }: ResetPasswordInput) {
		setSubmitting(true);
		try {
			const res = await request.post('/auth/reset-password', {
				password,
				token,
			});
			toast({ title: res.data.message });
			if (res.data.success) {
				push('/auth/login');
			}
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
				<Link href={'/'} className='font-bold text-xl hover:text-blue-500'>
					Santuri EA
				</Link>
				<h1 className='text-lg font-semibold tracking-tight text-foreground'>
					Reset your password
				</h1>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='w-full mb-4'>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<PasswordInput placeholder='******' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='confirmPassword'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<PasswordInput placeholder='******' {...field} />
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
