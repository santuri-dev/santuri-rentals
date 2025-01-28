'use client';

import { Suspense } from 'react';
import SignupForm from '@/components/Forms/auth/SignupForm';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

function SignupContent() {
	const search = useSearchParams();
	const token = search.get('token');

	return <SignupForm token={token} />;
}

export default function Page() {
	return (
		<div className='flex h-screen flex-col items-center justify-center sm:px-6 lg:px-8'>
			<Suspense fallback={<Skeleton className='w-full h-full' />}>
				<SignupContent />
			</Suspense>
		</div>
	);
}
