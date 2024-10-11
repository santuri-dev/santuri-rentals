'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { ShoppingBag, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { productsOpts } from '@/lib/api';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/helpers';

function ProductSkeleton() {
	return (
		<Card className='flex flex-col h-full'>
			<CardContent className='p-4 flex-grow'>
				<Skeleton className='aspect-square w-full mb-4' />
				<Skeleton className='h-6 w-3/4 mb-2' />
				<Skeleton className='h-4 w-1/2 mb-2' />
				<Skeleton className='h-4 w-full' />
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

	if (isLoading) {
		return (
			<section className='py-12 bg-gradient-to-r from-primary/10 to-secondary/10'>
				<div className='container mx-auto px-4'>
					<h2 className='text-3xl font-bold mb-8 text-center'>
						Featured Products
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{[...Array(3)].map((_, index) => (
							<ProductSkeleton key={index} />
						))}
					</div>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className='py-12 bg-gradient-to-r from-primary/10 to-secondary/10'>
				<div className='container mx-auto px-4'>
					<p className='text-center text-red-500'>
						Error loading featured products.
					</p>
				</div>
			</section>
		);
	}

	if (!products || products?.length === 0) return null;

	return (
		<section className='p-6 bg-gradient-to-r rounded-md from-primary/10 to-secondary/10'>
			<div className='mx-auto'>
				<h2 className='text-xl font-bold mb-8'>Featured Merch</h2>
				<div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6'>
					{products.map((product) => (
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
								<h3 className='text-xl font-semibold mb-2'>{product.name}</h3>
								<p className='text-muted-foreground mb-4 line-clamp-2'>
									{product.description}
								</p>
								<p className='text-md font-bold'>
									{formatCurrency(product.price)}
								</p>
							</CardContent>
							<CardFooter>
								<Button className='w-full'>
									<ShoppingBag className='w-4 h-4 mr-2' /> Add to Cart
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
