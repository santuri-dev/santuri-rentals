import ResetPassword from '@/components/Forms/auth/ResetPassword';

export default function Page({ params }: { params: { token: string } }) {
	return (
		<div className='flex h-screen flex-col items-center justify-center sm:px-6 lg:px-8'>
			<ResetPassword token={params.token} />
		</div>
	);
}
