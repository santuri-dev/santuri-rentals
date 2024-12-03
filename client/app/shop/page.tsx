'use client';

import { productsOpts } from '@/lib/api';
import { Product } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Tags } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/hooks/use-cart';

function ProductSkeleton() {
	return (
		<Card className='flex flex-col border-slate-900/50'>
			<CardContent className='p-4'>
				<Skeleton className='aspect-square w-full mb-4' />
				<div className='px-2'>
					<Skeleton className='h-6 w-3/4 mb-2' />
					<Skeleton className='h-4 w-1/4' />
				</div>
			</CardContent>
			<CardFooter className='mt-auto w-full'>
				<Skeleton className='h-10 w-full' />
			</CardFooter>
		</Card>
	);
}

function ProductSkeletonGrid() {
	return (
		<div className='py-4'>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
				{Array.from({ length: 8 }).map((_, index) => (
					<ProductSkeleton key={index} />
				))}
			</div>
		</div>
	);
}

export default function Page() {
	const {
		data: products,
		isFetching,
		error,
	} = useQuery<Product[]>(productsOpts);
	const { cart, addToCart } = useCart();

	if (isFetching && !products) return <ProductSkeletonGrid />;

	if (!products)
		return (
			<div className='w-full h-[calc(100vh-72px)] flex items-center justify-center'>
				<p className='p-3 bg-slate-900 rounded-md text-sm'>No products found</p>
			</div>
		);

	if (error)
		return (
			<div className='text-center font-bold py-10 text-red-500'>
				Error: {error.message}
			</div>
		);

	return null;

	return (
		<div className='py-6'>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
				{products?.map((product) => {
					const inCart = !!cart.find((v) => v.product.id === product.id);

					return (
						<Card
							key={product.id}
							className='flex flex-col border-slate-900/50 hover:scale-[1.02] transition-transform duration-300 ease-in-out'>
							<CardContent className='p-4'>
								<div className='aspect-square relative mb-4'>
									<Image
										src={product.imageUrl ?? ''}
										alt={product.name}
										fill
										className='rounded-md object-cover'
										placeholder='blur'
										blurDataURL={product.imagePlaceholder ?? ''}
										sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
									/>
								</div>
								<div className='px-2'>
									<h2 className='text-lg font-semibold mb-2'>{product.name}</h2>
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
							<CardFooter className='mt-auto w-full'>
								<Button
									onClick={() => {
										addToCart(product);
									}}
									disabled={inCart}
									className='w-full text-slate-900'>
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
	);
}
