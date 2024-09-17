'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import Spinner2 from './Loaders/Spinner2';

export default function RequireAuth({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const { status } = useAuth();
	const pathname = usePathname();

	useEffect(() => {
		if (status !== 'loading' && status !== 'authenticated') {
			router.replace('/auth/login');
		}
	}, [status, router]);

	if (status === 'loading' && !pathname.startsWith('/auth')) {
		return (
			<div className='w-screen h-screen flex items-center justify-center'>
				<Spinner2 />
			</div>
		);
	}

	return <>{children}</>;
}
