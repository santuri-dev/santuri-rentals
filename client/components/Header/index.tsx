'use client';

import Link from 'next/link';
import NavLinks from '../NavLinks';
import LoginButton from './LoginButton';
import { usePathname } from 'next/navigation';

export default function Header() {
	const pathname = usePathname();

	return !pathname.startsWith('/auth') ? (
		<header className='w-full shadow-2xl h-[72px] flex justify-between px-6 items-center'>
			<Link href={'/'} className='font-bold text-xl'>
				Santuri EA
			</Link>
			<NavLinks
				links={[
					{ path: '/shop', name: 'Shop' },
					{ path: '/courses', name: 'Courses' },
					{ path: '/gear', name: 'Gear' },
					{ path: '/studio', name: 'Studio' },
				]}
			/>
			<LoginButton />
		</header>
	) : null;
}
