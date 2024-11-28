import supabase from '@/db';
import { getPagination, PaginationState } from '@/lib/pagination';

export async function getUsers(pagination: PaginationState) {
	const { from, to, pageIndex, pageSize } = getPagination(pagination);

	try {
		const { data, error, count } = await supabase
			.from('User')
			.select(
				'id, username, firstName, lastName, email, phoneNumber, createdAt, Role(id, name)',
				{ count: 'exact' }
			)
			.order('id')
			.range(from, to);

		if (error) throw new Error(`${error.message} + ${error.code}`);

		return { data, pagination: { pageIndex, pageSize, count } };
	} catch (e: any) {
		throw new Error(`Error fetching users: ${e.message}`);
	}
}

export async function getUserRoles(pagination: PaginationState) {
	try {
		const { from, to, pageIndex, pageSize } = getPagination(pagination);
		const { data, error, count } = await supabase
			.from('Role')
			.select('*')
			.order('id')
			.range(from, to);

		if (error) throw new Error(`${error.message} + ${error.code}`);

		return { data, pagination: { pageIndex, pageSize, count } };
	} catch (e: any) {
		throw new Error(`Error fetching users: ${e.message}`);
	}
}

export async function createUserRole(input: {
	name: string;
	gearDiscount: number;
	studioDiscount: number;
}) {
	try {
		const { data, error } = await supabase
			.from('Role')
			.insert(input)
			.select('*')
			.single();

		if (error) throw new Error(`${error.message} + ${error.code}`);

		return data;
	} catch (e: any) {
		throw new Error(`Error creating user role: ${e.message}`);
	}
}

export async function updateUserRole(
	id: number,
	input: {
		name: string;
		gearDiscount: number;
		studioDiscount: number;
	}
) {
	try {
		const { data, error } = await supabase
			.from('Role')
			.update(input)
			.eq('id', id)
			.select('*')
			.single();

		if (error) throw new Error(`${error.message} + ${error.code}`);

		return data;
	} catch (e: any) {
		throw new Error(`Error updating user role: ${e.message}`);
	}
}

export async function deleteUserRole(id: number) {
	try {
		const { data, error } = await supabase
			.from('Role')
			.delete()
			.eq('id', id)
			.select('*')
			.single();

		if (error) throw new Error(`${error.message} + ${error.code}`);

		return data;
	} catch (e: any) {
		throw new Error(`Error deleting user role: ${e.message}`);
	}
}
