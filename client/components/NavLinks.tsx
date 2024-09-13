'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLink {
	path: string;
	name: string;
}

export default function NavLinks({ links }: { links: NavLink[] }) {
	const pathname = usePathname();

	return (
		<div className='hidden md:flex justify-between gap-4 font-semibold'>
			{links.map(({ path, name }) => (
				<Link
					className={`${
						pathname === path ? 'text-blue-500' : ''
					} hover:text-blue-500 transition-all ease-in-out duration-300`}
					href={path}
					key={path}>
					{name}
				</Link>
			))}
		</div>
	);
}
