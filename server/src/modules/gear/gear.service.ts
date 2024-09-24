import supabase from '@/db';
import { GearRequest, GearInventoryItem } from './gear.schema';

// Fetch all items
export async function getAllGearItems() {
	const { data, error } = await supabase.from('Gear').select('*');

	if (error) throw new Error(error.message);
	return data;
}

// Fetch many items
export async function getManyGearItems(ids: number[], status?: string) {
	let query = supabase.from('Gear').select('*').in('id', ids);

	// Apply status filter conditionally
	if (status) {
		query = query.eq('status', status);
	}

	const { data, error } = await query;

	if (error) throw new Error(error.message);
	return data;
}

// Fetch available items
export async function getAvailableGearItems() {
	const { data, error } = await supabase
		.from('Gear')
		.select('id, name, condition, peripherals')
		.eq('status', 'available');

	if (error) throw new Error(error.message);
	return data;
}

// Add a new item
export async function addGearItem(input: GearInventoryItem) {
	const { data, error } = await supabase
		.from('Gear')
		.insert(input)
		.select('name');

	if (error) throw new Error(error.message);

	return {
		message: `Successfully added ${data[0].name}.`,
	};
}

// Edit an existing item
export async function editGearItem({
	id,
	data: input,
}: {
	id: string;
	data: GearInventoryItem;
}) {
	const { data, error } = await supabase
		.from('Gear')
		.update(input)
		.eq('id', id)
		.select('name');

	if (error) throw new Error(error.message);

	return {
		message: `Successfully updated ${data[0].name}.`,
	};
}

// Delete an item
export async function deleteGearItem(id: string) {
	const { data, error } = await supabase
		.from('Gear')
		.delete()
		.eq('id', id)
		.select('name');

	if (error) throw new Error(error.message);

	return {
		message: `Successfully deleted ${data[0].name}`,
	};
}

// Get items by ID
export async function getGearItemsById(id: number) {
	const { data, error } = await supabase
		.from('Gear')
		.select('name, serialNumber, status, condition')
		.eq('id', id);

	if (error) throw new Error(error.message);

	return data;
}

// Get inventory stats
export async function getGearInventoryStats() {
	const { data: items, error: itemsError } = await supabase
		.from('Gear')
		.select('*');

	if (itemsError) throw new Error(itemsError.message);

	const availableItems = items.filter((item) => item.status === 'available');
	const leasedItems = items.filter(
		(item) => item.status === 'lease' || item.status === 'borrowed'
	);

	// TODO: Update the overdue and due today stats
	return {
		Available: availableItems.length,
		Leased: leasedItems.length,
		'Due Today': 0,
		Overdue: 0,
	};
}

export async function requestGear({
	borrowerId,
	items,
	pickupDate,
	returnDate,
}: GearRequest & { borrowerId: number }) {
	try {
		const { error: checkoutError } = await supabase
			.from('GearCheckout')
			.insert({ borrowerId, pickupDate, returnDate, items });

		if (checkoutError) {
			throw new Error(`Error creating request: ${checkoutError.message}`);
		}

		return 'Successfully created gear request';
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function getPendingGearRequests() {
	try {
		const { data, error: checkoutError } = await supabase
			.from('GearCheckout')
			.select(
				'id, pickupDate, returnDate, items, createdAt, User(id, username, email)'
			)
			.eq('closed', false);

		if (checkoutError) {
			throw new Error(`Error fetching gear request: ${checkoutError.message}`);
		}

		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
}
