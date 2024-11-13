'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NavLink } from '@/lib/types';
import { usePathname } from 'next/navigation';

const links: NavLink[] = [
	{ path: '/', name: 'Dashboard' },
	{ path: '/gear', name: 'Gear' },
	{ path: '/courses', name: 'Courses' },
	{ path: '/studio', name: 'Studio' },
	{ path: '/shop', name: 'Shop' },
	{ path: '/users', name: 'Users' },
];

export function MainNav({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	const pathname = usePathname();

	return (
		<nav
			className={cn('flex items-center space-x-4 lg:space-x-6', className)}
			{...props}>
			{links.map(({ name, path }) => (
				<Link
					key={path}
					href={path}
					className={`${
						(pathname.startsWith(path) && path !== '/') ||
						(name === 'Dashboard' && path === pathname)
							? 'text-blue-500'
							: ''
					} text-md font-semibold hover:text-blue-500 transition-all ease-in-out duration-300`}>
					{name}
				</Link>
			))}
		</nav>
	);
}
