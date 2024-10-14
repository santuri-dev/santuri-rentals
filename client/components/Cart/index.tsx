'use client';

import { useCart } from '@/hooks/use-cart';
import { useEffect, useState } from 'react';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTrigger,
} from '@/components/ui/drawer';

import { ShoppingCart, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import Spinner2 from '../Loaders/Spinner2';
import Image from 'next/image';
import { formatCurrency } from '@/lib/helpers';
import Link from 'next/link';

export default function Cart() {
	const { cart, removeFromCart, submitting } = useCart();
	const [open, setOpen] = useState(false);
	const [openDrawer, setOpenDrawer] = useState(false);

	const pathname = usePathname();

	useEffect(() => {
		setOpen(false);
		setOpenDrawer(false);
	}, [pathname]);

	return (
		<>
			<div className='hidden md:flex'>
				<DropdownMenu open={open} onOpenChange={setOpen}>
					<DropdownMenuTrigger onClick={() => setOpen(!open)} asChild>
						<Button variant='ghost' className='relative flex gap-2'>
							{submitting ? (
								<Spinner2 />
							) : (
								<>
									<ShoppingCart className={'h-5 w-5'} />
									{cart.length ? (
										<span className='bg-yellow-400 text-black rounded-full h-5 w-5 items-center flex justify-center'>
											{cart.length}
										</span>
									) : null}
								</>
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className='min-w-80' align='end' forceMount>
						<div className='px-4 py-2'>
							<p className='font-semibold'>Cart ({cart.length})</p>
						</div>
						<div className='px-4'>
							{cart.map(({ imageUrl, name, price, id, imagePlaceholder }) => (
								<div
									key={id}
									className='flex py-2 justify-between items-center hover:cursor-pointer'>
									<div className='flex gap-4 items-center'>
										<Image
											alt={`Product ${name} cover photo`}
											src={imageUrl ?? ''}
											blurDataURL={imagePlaceholder ?? ''}
											height={80}
											width={80}
											className='rounded-md'
										/>
										<div className='text-sm space-y-2'>
											<p className='font-semibold text-blue-500'>{name}</p>
											<p className='font-semibold'>{formatCurrency(price)}</p>
										</div>
									</div>
									<Button
										disabled={!!submitting}
										variant={'ghost'}
										className='w-fit flex items-center gap-2'
										onClick={() => removeFromCart(id)}>
										{submitting === id ? (
											<Spinner2 />
										) : (
											<X className='h-4 w-4' />
										)}
									</Button>
								</div>
							))}
						</div>
						{cart.length ? (
							<div className='px-4 py-4'>
								<Button className='w-full gap-2' asChild>
									<Link href={'/checkout'}>
										<ShoppingCart className={'h-5 w-5'} />
										Checkout
									</Link>
								</Button>
							</div>
						) : null}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className='flex md:hidden'>
				<Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
					<DrawerTrigger asChild>
						<Button variant='ghost' className='relative flex gap-2' size={'sm'}>
							<ShoppingCart className={'h-5 w-5'} />
							{submitting ? (
								<Spinner2 />
							) : (
								<>
									{cart.length ? (
										<span className='bg-yellow-400 text-black rounded-full h-5 w-5 items-center flex justify-center'>
											{cart.length}
										</span>
									) : null}
								</>
							)}
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader>
							{cart.length === 0 ? (
								<DrawerDescription>
									Your cart is currently empty. Add some products then proceed
									to checkout
								</DrawerDescription>
							) : null}
						</DrawerHeader>
						{cart.length ? (
							<div className='px-4'>
								<p className='font-semibold mb-2'>Cart ({cart.length})</p>
							</div>
						) : null}
						<div className='px-4'>
							{cart.map(({ imageUrl, name, price, id, imagePlaceholder }) => (
								<div
									key={id}
									className='flex py-2 justify-between items-center hover:cursor-pointer'>
									<div className='flex gap-4 items-center'>
										<Image
											alt={`Product ${name} cover photo`}
											src={imageUrl ?? ''}
											blurDataURL={imagePlaceholder ?? ''}
											height={100}
											width={100}
											className='rounded-md'
										/>
										<div className='text-sm space-y-2'>
											<p className='font-semibold text-blue-500'>{name}</p>
											<p className='font-semibold'>{`KES ${price}`}</p>
										</div>
									</div>
									<Button
										disabled={!!submitting}
										variant={'ghost'}
										className='w-fit flex items-center gap-2'
										onClick={() => removeFromCart(id)}>
										{submitting === id ? (
											<Spinner2 />
										) : (
											<X className='h-3 w-3' />
										)}
									</Button>
								</div>
							))}
						</div>
						{cart.length ? (
							<div className='px-4 py-4'>
								<Button className='w-full gap-2'>
									<Link href={'/checkout'} className='flex items-center gap-2'>
										<ShoppingCart className={'h-5 w-5'} />
										Checkout
									</Link>
								</Button>
							</div>
						) : null}
					</DrawerContent>
				</Drawer>
			</div>
		</>
	);
}
