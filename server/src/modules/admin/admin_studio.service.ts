import supabase from '@/db';

export async function approveStudioRequest(id: number) {
	const { data: studioRequestData, error: studioRequestError } = await supabase
		.from('StudioRequest')
		.update({ status: 'approved' })
		.eq('id', id)
		.select('gearItems')
		.single();

	if (studioRequestError) throw new Error(studioRequestError.message);

	if (studioRequestData.gearItems) {
		const { error: gearError } = await supabase
			.from('Gear')
			.update({ status: 'class' })
			.in('id', studioRequestData.gearItems);

		if (gearError) throw new Error(gearError.message);
	}

	return studioRequestData;
}

export async function getAdminStudioRequests() {
	// Query for approved studio requests that have not yet ended
	const { data: approvedRequests, error } = await supabase
		.from('StudioRequest')
		.select('*, User(id, username, email)'); // Only select relevant fields

	if (error) {
		throw new Error(`Error fetching studio requests: ${error.message}`);
	}

	return approvedRequests;
}
