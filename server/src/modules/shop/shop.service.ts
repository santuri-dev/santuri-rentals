import supabase from '@/db';
import Receipt from '@/emails/Receipt';
import { createCheckout } from '@/lib/intasend';
import transporter from '@/lib/nodemailer';
import { render } from '@react-email/components';
import env from '@/lib/env';
import { getPagination, PaginationState } from '@/lib/pagination';

// Fetch all courses
export async function getAllCourses(pagination: PaginationState) {
	const { from, pageIndex, pageSize, to } = getPagination(pagination);

	const { data, error, count } = await supabase
		.from('Course')
		.select('*', { count: 'exact' })
		.order('id')
		.range(from, to);

	if (error) throw new Error(error.message);

	return { data, pagination: { pageIndex, pageSize, count } };
}

// Fetch all products
export async function getAllProducts() {
	const { data, error } = await supabase
		.from('Product')
		.select(
			'id, name, description, slug, stock, price, currency, imageUrl, imagePlaceholder, Category(id, name)'
		)
		.eq('status', 'published');

	if (error) throw new Error(error.message);
	return data;
}

export async function createOrder({
	billingAddress,
	items,
}: {
	items: {
		productId: number;
		quantity: number;
	}[];
	billingAddress: {
		email: string;
		firstName: string;
		lastName: string;
		phoneNumber: string;
	};
}) {
	// Fetch product details from the database
	const { data: products, error: productError } = await supabase
		.from('Product')
		.select('*')
		.in(
			'id',
			items.map(({ productId }) => productId)
		);

	if (productError) {
		throw new Error(`Error fetching products: ${productError.message}`);
	}

	// Map the items with their respective product details and calculate total cost
	let totalCost = 0;
	const orderItems = items.map((item) => {
		const product = products.find((p) => p.id === item.productId);
		if (!product) {
			throw new Error(`Product with ID ${item.productId} not found.`);
		}

		const price = product.price; // Assuming 'price' is a field in the 'Product' table
		const subtotal = price * item.quantity;
		totalCost += subtotal;

		return {
			productId: item.productId,
			quantity: item.quantity,
			price,
			currency: product.currency, // Assuming 'currency' is a field in 'Product'
		};
	});

	const ref = crypto.randomUUID();

	// Start a transaction for creating the order and order items
	const { data: order, error: orderError } = await supabase
		.from('Order')
		.insert([
			{
				status: 'pending', // Assuming initial status is 'pending'
				firstName: billingAddress.firstName,
				lastName: billingAddress.lastName,
				email: billingAddress.email,
				phone: billingAddress.phoneNumber,
				totalCost,
				currency: orderItems[0].currency,
				ref,
			},
		])
		.select()
		.single();

	if (orderError) {
		throw new Error(`Error creating order: ${orderError.message}`);
	}

	// Insert the order items and link them to the created order
	const { error: orderItemError } = await supabase.from('OrderItem').insert(
		orderItems.map((item) => ({
			...item,
			orderId: order.id, // Link the order items to the created order
		}))
	);

	if (orderItemError) {
		throw new Error(`Error creating order items: ${orderItemError.message}`);
	}

	const orderRequest = await createCheckout(order);

	await supabase
		.from('Order')
		.update({ trackingId: orderRequest.id })
		.eq('id', order.id);

	return orderRequest;
}

export async function getOrder(ref: string) {
	try {
		const { data, error } = await supabase
			.from('Order')
			.select('*, OrderItem(*, Product(*))')
			.eq('ref', ref)
			.single();

		if (error) throw new Error(error.message);
		if (!data) throw new Error('Error finding order details');

		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function getOrderStatus(
	state: 'PENDING' | 'PROCESSING' | 'COMPLETE' | 'FAILED',
	ref: string
) {
	try {
		if (state === 'COMPLETE') {
			const { data: order, error } = await supabase
				.from('Order')
				.select('*')
				.eq('ref', ref)
				.single();

			if (error) throw new Error(error.message);
			if (!order) throw new Error('Error finding order details');

			if (order.status === 'pending') {
				await supabase
					.from('Order')
					.update({ status: 'paid' })
					.eq('id', order.id);

				const { data: orderItems, error } = await supabase
					.from('OrderItem')
					.select('*, Product(imageUrl, name)')
					.eq('orderId', order.id);

				if (error) {
					throw new Error(
						`Failed to send email notification: ${error.message}`
					);
				}

				try {
					await transporter.sendMail({
						from: env.EMAIL_FROM,
						to: order.email,
						subject: 'Payment Received',
						html: await render(
							Receipt({ data: { order, orderItems }, to: order.email })
						),
					});
				} catch (error: any) {
					throw new Error(
						`Failed to send password reset email: ${error.message}`
					);
				}
			}

			return {
				success: true,
				data: order,
				message: 'Purchase was successful',
			};
		} else if (state === 'FAILED') {
			await supabase.from('Order').update({ status: 'failed' }).eq('ref', ref);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
}
