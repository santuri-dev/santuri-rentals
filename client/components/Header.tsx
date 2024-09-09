import Link from 'next/link';
import NavLinks from './NavLinks';

export default function Header() {
	return (
		<header className='w-full shadow-2xl h-[72px] flex justify-between px-6 items-center'>
			<Link href={'/'} className='font-bold text-xl'>
				Santuri EA
			</Link>
			<NavLinks
				links={[
					{ path: '/courses', name: 'Courses' },
					{ path: '/gear', name: 'Gear' },
					{ path: '/studio', name: 'Studio' },
				]}
			/>
			<div></div>
		</header>
	);
}
