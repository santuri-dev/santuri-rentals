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

interface NavLink {
	path: string;
	name: string;
}

export default function NavLinks({ links }: { links: NavLink[] }) {
	const pathname = usePathname();

	return (
		<>
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
			<div className='md:hidden ml-auto mr-6 flex justify-between gap-4 font-semibold'>
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
		</>
	);
}
