'use client';

import SignupForm from '@/components/Forms/auth/SignupForm';
import { useSearchParams } from 'next/navigation';

export default function Page() {
	const search = useSearchParams();
	const token = search.get('token');

	return (
		<div className='flex h-screen flex-col items-center justify-center sm:px-6 lg:px-8'>
			<SignupForm token={token} />
		</div>
	);
}
