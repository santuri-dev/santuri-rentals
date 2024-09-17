'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
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
import Link from 'next/link';
import { PasswordInput } from '../PasswordInput';
import Dots from '@/components/Loaders/Dots';
import { useRouter } from 'next/navigation';

const loginFormSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6, 'Password is too short'),
});

type LoginInput = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
	const { login, status } = useAuth();
	const [submitting, setSubmitting] = useState(false);
	const { push } = useRouter();

	const form = useForm<LoginInput>({
		resolver: zodResolver(loginFormSchema),
		mode: 'onChange',
		defaultValues: { email: '', password: '' },
	});

	async function onSubmit(data: LoginInput) {
		setSubmitting(true);
		await login(data.email, data.password);
		setSubmitting(false);
	}

	if (status === 'authenticated') {
		push('/');
	}

	return (
		<div className='mx-auto w-full max-w-md space-y-6'>
			<div className='text-center space-y-6'>
				<h1 className='text-lg font-semibold tracking-tight text-foreground'>
					Sign in with email
				</h1>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='w-full mb-4 space-y-4'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder='Enter your email' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem className='w-full'>
									<span className='flex justify-between items-center'>
										<FormLabel>Password</FormLabel>
										<Link
											tabIndex={-1}
											className='text-blue-500 underline bricolage-normal text-[10pt] underline-offset-2'
											href={'/auth/reset-password'}>
											Forgot your password?
										</Link>
									</span>
									<FormControl>
										<PasswordInput placeholder='******' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<span className='flex items-center text-sm'>
							{"Don't have an account?"}
							<Link
								className='text-blue-500 underline bricolage-normal text-[10pt] underline-offset-2 ml-2'
								href='/auth/signup'>
								Sign Up
							</Link>
						</span>
					</div>
					<Button
						variant={'default'}
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
