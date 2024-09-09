'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function LoginForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { login } = useAuth();

	async function handleLogin() {
		// TODO: Implement validation
		if (email && password) {
			await login(email, password);
		}
	}

	return (
		<div className='mx-auto w-full max-w-md space-y-6'>
			<div className='text-center'>
				<h1 className='text-xl font-bold tracking-tight text-foreground'>
					Sign in with email
				</h1>
				<p className='mt-2 text-muted-foreground'>
					Enter your credentials to sign in.
				</p>
			</div>
			<form className='space-y-4'>
				<div>
					<Label htmlFor='email' className='sr-only'>
						Email
					</Label>
					<Input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						id='email'
						type='email'
						placeholder='Email'
						className='w-full'
					/>
				</div>
				<div>
					<Label htmlFor='password' className='sr-only'>
						Email
					</Label>
					<Input
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						id='password'
						type='password'
						placeholder='********'
						className='w-full'
					/>
				</div>
				<Button onClick={handleLogin} type='button' className='w-full'>
					Sign In
				</Button>
			</form>
		</div>
	);
}
