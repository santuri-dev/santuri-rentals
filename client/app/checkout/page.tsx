'use client';

import ProductCounter from '@/components/Cart/ProductCounter';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { formatCurrency } from '@/lib/helpers';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
	const { cart, subtotal, addToCart, removeFromCart } = useCart();

	return (
		<section className='w-full py-6'>
			<div className='w-full flex flex-col-reverse md:flex-row gap-8'>
				<div className='w-full md:w-2/3 space-y-4'>
					<p className='min-h-4 font-semibold'>Billing Address</p>
					{/* <CheckoutForm /> */}
					<div></div>
				</div>
				<div className='w-full md:w-1/3 space-y-4'>
					<p className='min-h-4 font-semibold'>Cart Summary</p>
					<div className='bg-slate-800 rounded-md py-2'>
						<div className='px-4'>
							{cart.length === 0 ? (
								<div className='flex pt-4 pb-2 space-y-2 justify-center items-center flex-col'>
									<p>No products added to cart</p>
									<Button className='text-blue-500' variant={'link'} asChild>
										<Link href={'/shop'}>Back to Shop</Link>
									</Button>
								</div>
							) : null}
							{cart.map(({ product, quantity }) => {
								const { imageUrl, imagePlaceholder, name, price, id } = product;

								return (
									<div
										key={id}
										className='flex py-2 justify-between items-center hover:cursor-pointer'>
										<div className='grid grid-cols-3 justify-between w-full items-center'>
											<div className='flex items-center gap-4'>
												<Image
													alt={`Product ${name} cover image`}
													src={imageUrl ?? ''}
													blurDataURL={imagePlaceholder ?? ''}
													height={100}
													width={100}
													className='rounded-md'
												/>
											</div>
											<div>
												<ProductCounter
													count={quantity}
													onCountChange={(count) => {
														if (count < quantity) {
															removeFromCart(id);
														} else {
															addToCart(product);
														}
													}}
												/>
											</div>
											<p className='font-semibold flex flex-grow justify-end'>
												{formatCurrency(price)}
											</p>
										</div>
									</div>
								);
							})}
						</div>
					</div>
					<div className='w-full px-4 text-sm space-y-2 bg-slate-800 rounded-md py-4'>
						<div className='w-full flex text-slate-300 justify-between'>
							<p>Subtotal</p>
							<p>{formatCurrency(subtotal)}</p>
						</div>
						<div className='text-lg w-full flex items-center justify-between font-semibold'>
							<p>
								Total ({cart.length} {cart.length === 1 ? 'item' : 'items'})
							</p>
							<p>{formatCurrency(subtotal)}</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
