import supabase from '@/db';
import { StudioRequest } from './studio.schema';
import { setMilliseconds, setMinutes, setSeconds } from 'date-fns';

export async function createStudioRequest(
	input: StudioRequest & { gearItems: number[] },
	userId: number
) {
	const { type, startTime, endTime } = input;

	const selectedStartTime = setMilliseconds(
		setSeconds(setMinutes(new Date(startTime), 0), 0),
		0
	);
	const selectedEndTime = setMilliseconds(
		setSeconds(setMinutes(new Date(endTime), 0), 0),
		0
	);

	const { data: studioRequestData, error: studioRequestError } = await supabase
		.from('StudioRequest')
		.insert({
			startTime: selectedStartTime.toISOString(),
			endTime: selectedEndTime.toISOString(),
			type,
			userId,
		})
		.select()
		.single();

	if (studioRequestError) throw new Error(studioRequestError.message);

	return {
		message: 'Studio request created successfully',
		data: studioRequestData,
	};
}

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

export async function getStudioRequests({
	date,
	status,
}: {
	date: string;
	status: string;
}) {
	// Query for approved studio requests that have not yet ended
	const { data: approvedRequests, error } = await supabase
		.from('StudioRequest')
		.select('id, startTime, endTime, type') // Only select relevant fields
		.eq('status', status)
		.gt('endTime', new Date(date).toISOString()); // Only get requests that haven't ended

	if (error) {
		throw new Error(
			`Error fetching approved studio requests: ${error.message}`
		);
	}

	return approvedRequests;
}
