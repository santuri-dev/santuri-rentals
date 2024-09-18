'use client';

import { usePathname } from 'next/navigation';
import { MainNav } from './MainNav';
import { UserNav } from './UserNav';

export default function Header() {
	const pathname = usePathname();

	if (pathname.startsWith('/auth')) {
		return null;
	}

	return (
		<header className='shadow-2xl h-[72px] flex justify-between px-8 items-center'>
			<MainNav />
			<UserNav />
		</header>
	);
}
