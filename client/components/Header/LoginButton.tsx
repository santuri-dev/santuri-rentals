'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { useAuth } from '@/hooks/use-auth';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function LoginButton() {
	const { status, logout, user } = useAuth();

	return status === 'unauthenticated' ? (
		<Button variant={'secondary'} className='hidden md:block' asChild>
			<Link href={'/auth/login'}>Login</Link>
		</Button>
	) : (
		<DropdownMenu>
			<DropdownMenuTrigger className='hidden md:block'>
				<Avatar>
					<AvatarImage src={user?.image ?? ''} />
					<AvatarFallback className='font-bold'>
						{user?.name.charAt(0).toUpperCase()}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={logout}>Log Out</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
