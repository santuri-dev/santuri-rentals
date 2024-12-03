'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { ShoppingBag, Star, Tags } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { productsOpts } from '@/lib/api';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/helpers';
import { useCart } from '@/hooks/use-cart';

function ProductSkeleton() {
	return (
		<Card className='flex flex-col h-full'>
			<CardContent className='p-4 flex-grow'>
				<div className='h-32 relative mb-4'>
					<Skeleton className='h-full w-full rounded-md' />
					<Skeleton className='absolute top-2 left-2 h-6 w-20' />
				</div>
				<Skeleton className='h-6 w-3/4 mb-2' />
				<Skeleton className='h-4 w-full mb-2' />
				<Skeleton className='h-4 w-full mb-4' />
				<Skeleton className='h-5 w-1/4' />
			</CardContent>
			<CardFooter>
				<Skeleton className='h-10 w-full' />
			</CardFooter>
		</Card>
	);
}

export default function FeaturedProducts() {
	const {
		data: products,
		isLoading,
		error,
	} = useQuery<Product[]>(productsOpts);
	const { addToCart, cart } = useCart();

	if (isLoading) {
		return (
			<section className='p-6 bg-gradient-to-r rounded-md from-primary/10 to-secondary/10'>
				<div className='mx-auto'>
					<h2 className='text-xl font-bold mb-8'>Featured Merch</h2>
					<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
						{[...Array(4)].map((_, index) => (
							<ProductSkeleton key={index} />
						))}
					</div>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className='p-6 bg-gradient-to-r rounded-md from-primary/10 to-secondary/10'>
				<div className='mx-auto'>
					<p className='text-center text-red-500'>
						Error loading featured products.
					</p>
				</div>
			</section>
		);
	}

	if (!products || products?.length === 0) return null;
	return null;
	return (
		<section className='p-6 bg-gradient-to-r rounded-md from-primary/10 to-secondary/10'>
			<div className='mx-auto'>
				<h2 className='text-xl font-bold mb-8'>Featured Merch</h2>
				<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
					{products?.map((product) => {
						const inCart = !!cart.find((v) => v.product.id === product.id);
						return (
							<Card
								key={product.id}
								className='flex flex-col h-full hover:shadow-lg transition-shadow duration-300'>
								<CardContent className='p-4 flex-grow'>
									<div className='h-32 relative mb-4'>
										<Image
											src={product.imageUrl || ''}
											alt={product.name}
											fill
											blurDataURL={product.imagePlaceholder ?? ''}
											placeholder='blur'
											className='rounded-md object-cover'
											sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
										/>
										<Badge className='absolute top-2 left-2 bg-primary text-primary-foreground'>
											<Star className='w-4 h-4 mr-1' /> Featured
										</Badge>
									</div>
									<div className='px-2'>
										<h2 className='text-lg font-semibold mb-2'>
											{product.name}
										</h2>
										{product.Category ? (
											<div className={'flex items-center gap-2'}>
												<Tags className='text-sm h-4 w-4 p-0' />
												<Badge
													className='text-xs gap-2 py-1 rounded-full'
													variant={'secondary'}>
													{product.Category?.name}
												</Badge>
											</div>
										) : null}
									</div>
								</CardContent>
								<CardFooter>
									<Button
										onClick={() => {
											addToCart(product);
										}}
										disabled={inCart}
										className='w-full'>
										{inCart ? (
											'In Cart'
										) : (
											<>
												<ShoppingBag className='h-4 w-4 p-0 mr-2' />{' '}
												{formatCurrency(product.price)}
											</>
										)}
									</Button>
								</CardFooter>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
}
