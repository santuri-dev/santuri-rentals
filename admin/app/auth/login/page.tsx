import LoginForm from '@/components/Forms/auth/LoginForm';

export default function Page() {
	return (
		<div className='flex h-screen flex-col items-center justify-center sm:px-6 lg:px-8'>
			<LoginForm />
		</div>
	);
}
