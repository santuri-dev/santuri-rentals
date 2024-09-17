'use client';

import { toast } from '@/hooks/use-toast';
import { request } from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '../PasswordInput';
import Dots from '@/components/Loaders/Dots';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

const signupFormSchema = z
	.object({
		username: z
			.string({ required_error: 'Username is required' })
			.min(2, 'Username is too short')
			.max(20, 'Username is too long'),
		email: z.string().email(),
		password: z.string().min(8, 'Password is too short'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

type SignupInput = z.infer<typeof signupFormSchema>;

export default function SignupForm() {
	const [submitting, setSubmitting] = useState(false);
	const { push } = useRouter();
	const { status } = useAuth();

	const form = useForm<SignupInput>({
		resolver: zodResolver(signupFormSchema),
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: '',
			username: '',
			confirmPassword: '',
		},
	});

	async function onSubmit({ username, email, password }: SignupInput) {
		setSubmitting(true);
		try {
			await request.post('/auth/signup', {
				username,
				password,
				email,
			});
			toast({
				title: 'Successfully created your account',
				description: 'Check your email for a verification link',
			});
			form.reset();
		} catch (error: unknown) {
			const e = error as AxiosError;
			toast({
				title: e.response?.statusText,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
				description: e.response?.data?.message!,
			});
		}
		setSubmitting(false);
	}

	if (status === 'authenticated') {
		push('/');
	}

	return (
		<div className='mx-auto w-full max-w-md space-y-6'>
			<div className='text-center space-y-6'>
				<h1 className='text-xl font-bold tracking-tight text-foreground'>
					Create an account
				</h1>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='w-full'>
						<FormField
							control={form.control}
							name='username'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input placeholder='Username' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder='Email' {...field} />
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
									<FormLabel>Password</FormLabel>
									<FormControl>
										<PasswordInput placeholder='********' {...field} />
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
										<PasswordInput placeholder='********' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<span className='flex items-center text-sm'>
							Already have an account?
							<Link
								className='text-blue-500 underline bricolage-normal text-[10pt] underline-offset-2 ml-2'
								href='/auth/login'>
								Login
							</Link>
						</span>
					</div>
					<Button
						className='w-full mt-4'
						disabled={!form.formState.isValid || submitting}
						type='submit'>
						{submitting ? <Dots size={'24'} /> : 'Submit'}
					</Button>
				</form>
			</Form>
		</div>
	);
}
