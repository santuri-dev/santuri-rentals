'use client';

import { useCart } from '@/hooks/use-cart';
import { formatCurrency } from '@/lib/helpers';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Page() {
	const { cart } = useCart();
	const subtotal = cart.reduce((total, product) => total + product.price, 0);
	const { push } = useRouter();

	if (cart.length === 0) {
		push('/shop');
	}

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
							{cart.map(({ imageUrl, imagePlaceholder, name, price, id }) => (
								<div
									key={id}
									className='flex py-2 justify-between items-center hover:cursor-pointer'>
									<div className='flex justify-between w-full items-center'>
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
										<p className='font-semibold'>{formatCurrency(price)}</p>
									</div>
								</div>
							))}
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
