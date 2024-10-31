import supabase from '@/db';
import { formatTime } from '@/lib/helpers';

export async function approveStudioRequest(id: number) {
	const { data: studioRequestData, error: studioRequestError } = await supabase
		.from('StudioRequest')
		.select('*')
		.eq('id', id)
		.single();

	if (studioRequestError) throw new Error(studioRequestError.message);

	const { data: conflictingRequests, error: conflictError } = await supabase
		.from('StudioRequest')
		.select('*, User(email), StudioType(id, name)')
		.eq('typeId', studioRequestData.typeId)
		.eq('status', 'approved')
		.gte('startTime', studioRequestData.startTime);

	if (conflictError) {
		throw new Error(conflictError.message);
	} else if (conflictingRequests.length > 0) {
		throw new Error(
			`Conflicting request found for ${conflictingRequests.map(
				({ StudioType, startTime }) =>
					`Studio: ${StudioType?.name} Time: ${formatTime(startTime)}`
			)}`
		);
	} else {
		const { data, error } = await supabase
			.from('StudioRequest')
			.update({ status: 'approved' })
			.eq('id', id)
			.select('*')
			.single();

		if (error) throw new Error(error.message);

		if (data.gearItems) {
			const { error: gearError } = await supabase
				.from('Gear')
				.update({ status: 'class' })
				.in('id', data.gearItems);

			if (gearError) throw new Error(gearError.message);
		}

		return { gearItems: studioRequestData.gearItems };
	}
}

export async function getAdminStudioRequests() {
	const { data: approvedRequests, error } = await supabase
		.from('StudioRequest')
		.select('*, StudioType(id, name, pricing), User(id, username, email)');

	if (error) {
		throw new Error(`Error fetching studio requests: ${error.message}`);
	}

	return approvedRequests;
}

export async function createStudioType(input: {
	name: string;
	description: string;
	pricing: number;
}) {
	const { data, error } = await supabase
		.from('StudioType')
		.insert(input)
		.select('*')
		.single();

	if (error) {
		throw new Error(`Error creating studio type: ${error.message}`);
	}

	return data;
}

export async function editStudioType(input: {
	id: number;
	name: string;
	description: string;
	pricing: number;
}) {
	const { data, error } = await supabase
		.from('StudioType')
		.update(input)
		.eq('id', input.id)
		.select('*')
		.single();

	if (error) {
		throw new Error(`Error updating studio type: ${error.message}`);
	}

	return data;
}

export async function deleteStudioType(id: number) {
	const { data, error } = await supabase
		.from('StudioType')
		.delete()
		.eq('id', id)
		.select('*')
		.single();

	if (error) {
		throw new Error(`Error deleting studio type: ${error.message}`);
	}

	return data;
}

export async function getStudioTypesAdmin() {
	const { data, error } = await supabase.from('StudioType').select('*');

	if (error) {
		throw new Error(`Error creating studio type: ${error.message}`);
	}

	return data;
}
