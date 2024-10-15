import supabase from '@/db';

// Fetch all courses
export async function getAllCourses() {
	const { data, error } = await supabase.from('Course').select('*');

	if (error) throw new Error(error.message);
	return data;
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

export async function createCheckout({
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

	return {
		orderId: order.id,
		totalCost,
	};
}
