import supabase from '@/db';

export async function getUsers() {
	try {
		const { data, error } = await supabase
			.from('User')
			.select(
				'id, username, firstName, lastName, email, phoneNumber, createdAt, Role(id, name)'
			);

		if (error) throw new Error(`${error.message} + ${error.code}`);

		return data;
	} catch (e: any) {
		throw new Error(`Error fetching users: ${e.message}`);
	}
}

export async function getUserRoles() {
	try {
		const { data, error } = await supabase.from('Role').select('*');

		if (error) throw new Error(`${error.message} + ${error.code}`);

		return data;
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
