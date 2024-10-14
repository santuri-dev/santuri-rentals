'use client';

import Link from 'next/link';
import NavLinks from '../NavLinks';
import LoginButton from './LoginButton';
import { usePathname } from 'next/navigation';
import Cart from '../Cart';

export default function Header() {
	const pathname = usePathname();

	return !pathname.startsWith('/auth') ? (
		<header className='w-full shadow-2xl h-[72px] flex justify-between px-6 items-center'>
			<Link href={'/'} className='font-bold text-xl md:text-2xl tracking-tight'>
				Santuri EA
			</Link>
			<div className='flex items-center gap-4'>
				<NavLinks
					links={[
						{ path: '/courses', name: 'Courses' },
						{ path: '/studio', name: 'Studio' },
						{ path: '/gear', name: 'Gear' },
						{ path: '/shop', name: 'Shop' },
					]}
				/>
				<Cart />
				<LoginButton />
			</div>
		</header>
	) : null;
}
