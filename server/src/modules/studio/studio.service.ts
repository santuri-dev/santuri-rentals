import supabase from '@/db';
import { StudioRequest } from './studio.schema';
import {
	differenceInMinutes,
	setMilliseconds,
	setMinutes,
	setSeconds,
} from 'date-fns';

export async function createStudioRequest(
	input: StudioRequest & { gearItems: number[] },
	userId: number
) {
	const { typeId, startTime, endTime } = input;

	const selectedStartTime = setMilliseconds(
		setSeconds(setMinutes(new Date(startTime), 0), 0),
		0
	);
	const selectedEndTime = setMilliseconds(
		setSeconds(setMinutes(new Date(endTime), 0), 0),
		0
	);

	const durationInMinutes = differenceInMinutes(
		selectedEndTime,
		selectedStartTime
	);
	const hours = Math.floor(durationInMinutes / 60);
	const minutes = durationInMinutes % 60;

	const { data: studioType, error: studioTypeError } = await supabase
		.from('StudioType')
		.select('*')
		.eq('id', typeId)
		.single();

	if (!studioType || studioTypeError) {
		throw new Error(`Error fetching studio type of ID: ${typeId}`);
	}

	const { data: studioRequestData, error: studioRequestError } = await supabase
		.from('StudioRequest')
		.insert({
			startTime: selectedStartTime.toISOString(),
			endTime: selectedEndTime.toISOString(),
			typeId,
			userId,
			cost: studioType.pricing * hours + (studioType.pricing * minutes) / 60,
		})
		.select()
		.single();

	if (studioRequestError) throw new Error(studioRequestError.message);

	return {
		message: 'Studio request created successfully',
		data: studioRequestData,
	};
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
		.select('id, startTime, endTime, StudioType(id, name)') // Only select relevant fields
		.eq('status', status)
		.gt('endTime', new Date(date).toISOString()); // Only get requests that haven't ended

	if (error) {
		throw new Error(
			`Error fetching approved studio requests: ${error.message}`
		);
	}

	return approvedRequests;
}

export async function getStudioTypes() {
	const { data, error } = await supabase.from('StudioType').select('*');

	if (error) {
		throw new Error(`Error creating studio type: ${error.message}`);
	}

	return data;
}
