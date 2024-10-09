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
		.select('*, User(email)')
		.eq('type', studioRequestData.type)
		.eq('status', 'approved')
		.gte('startTime', studioRequestData.startTime);

	if (conflictError) {
		throw new Error(conflictError.message);
	} else if (conflictingRequests.length > 0) {
		throw new Error(
			`Conflicting request found for ${conflictingRequests.map(
				({ type, startTime }) =>
					`Studio: ${type} Time: ${formatTime(startTime)}`
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
		.select('*, User(id, username, email)');

	if (error) {
		throw new Error(`Error fetching studio requests: ${error.message}`);
	}

	return approvedRequests;
}
