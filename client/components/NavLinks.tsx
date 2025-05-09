'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { NavLink } from '@/lib/types';
import { Fragment } from 'react';

export default function NavLinks({ links }: { links: NavLink[] }) {
	const pathname = usePathname();

	return (
		<Fragment>
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
			<div className='md:hidden ml-auto flex justify-between gap-4 font-semibold'>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Menu />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{links.map(({ path, name }) => (
							<DropdownMenuItem asChild key={path}>
								<Link
									className={`${
										pathname === path ? 'text-blue-500' : ''
									} hover:text-blue-500 transition-all ease-in-out duration-300`}
									href={path}>
									{name}
								</Link>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</Fragment>
	);
}
