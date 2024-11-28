import supabase from '@/db';
import { getPagination, PaginationState } from '@/lib/pagination';

export async function approveGearRequest(
	gearCheckoutId: number,
	items: number[],
	adminUserId: number
) {
	try {
		const { data: checkout, error: checkoutError } = await supabase
			.from('GearCheckout')
			.select('*')
			.eq('id', gearCheckoutId)
			.single();

		if (checkoutError) throw checkoutError;

		const { data: requestedGear, error: gearError } = await supabase
			.from('Gear')
			.select('*')
			.in('id', items);

		if (gearError) throw gearError;

		// Check for unavailable gear (e.g., status is not 'Available')
		const unavailableGear = requestedGear.filter(
			(gear) => gear.status !== 'available'
		);

		if (unavailableGear.length > 0) {
			throw new Error('Gear items must be available for checkout.');
		}

		// Approve gear checkout by updating the gear status to 'Checked Out'
		// TODO: Make status dynamic (borrowed/class/lease)
		const { error: updateError } = await supabase
			.from('Gear')
			.update({ status: 'lease' })
			.in('id', items);

		if (updateError) throw updateError;

		const { error: lesseError } = await supabase
			.from('Gear')
			.update({ gearCheckoutId: checkout.id })
			.in(
				'id',
				requestedGear.map(({ id }) => id)
			);

		if (lesseError) throw lesseError;

		void closeGearRequest(checkout.id, adminUserId);

		return 'Gear request was approved';
	} catch (error: any) {
		return 'Error approving gear request: ' + error.message;
	}
}

export async function closeGearRequest(checkoutId: number, closedById: number) {
	try {
		const { error } = await supabase
			.from('GearCheckout')
			.update({ closed: true, closedById })
			.eq('id', checkoutId);

		if (error) throw error;

		return 'Gear request was successfully closed';
	} catch (error: any) {
		return `Failed to close gear request: ${error.message}`;
	}
}

export async function getAllLeases(pagination: PaginationState) {
	try {
		const { from, to, pageIndex, pageSize } = getPagination(pagination);

		const {
			data,
			error: gearError,
			count,
		} = await supabase
			.from('Gear')
			.select(
				'id, name, condition, status, serialNumber, GearCheckout(id, borrowerId, returnDate, pickupDate, User(id, username, email))',
				{ count: 'exact' }
			)
			.eq('status', 'lease')
			.order('id')
			.range(from, to);

		if (gearError) throw gearError;

		return { data, pagination: { pageIndex, pageSize, count } };
	} catch (error: any) {
		throw new Error('Error fetching gear leases: ' + error.message);
	}
}
