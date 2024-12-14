import supabase from '@/db';
import { StudioRequest } from './studio.schema';
import {
	differenceInMinutes,
	setMilliseconds,
	setMinutes,
	setSeconds,
} from 'date-fns';
import { TZDate } from '@date-fns/tz';
import env from '@/lib/env';
import transporter from '@/lib/nodemailer';
import { render } from '@react-email/components';
import StudioRequestEmail from '@/emails/StudioRequestEmail';
import { formatCurrency } from '../../lib/helpers';
import AdminNotificationEmail from '@/emails/AdminNotificationEmail';

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

	const { data: user, error: userError } = await supabase
		.from('User')
		.select('id, Role(*)')
		.eq('id', userId)
		.single();

	if (!user || userError) {
		throw new Error(`Error fetching user of ID: ${userId}`);
	}

	const baseCost =
		studioType.pricing * hours + (studioType.pricing * minutes) / 60;
	const cost = baseCost * (1 - (user.Role?.studioDiscount ?? 0) / 100);

	const { data: studioRequestData, error: studioRequestError } = await supabase
		.from('StudioRequest')
		.insert({
			startTime: new TZDate(selectedStartTime, 'Africa/Nairobi').toISOString(),
			endTime: new TZDate(selectedEndTime, 'Africa/Nairobi').toISOString(),
			typeId,
			userId: user.id,
			cost,
		})
		.select('*, StudioType(*), User(*)')
		.single();

	if (studioRequestError) throw new Error(studioRequestError.message);

	if (studioRequestData.User) {
		await transporter.sendMail({
			from: env.EMAIL_FROM,
			to: studioRequestData.User.email,
			subject: 'Studio Request Received',
			html: await render(
				StudioRequestEmail({
					...studioRequestData,
					type: studioRequestData.StudioType?.name ?? '',
					userName: studioRequestData.User.username,
					cost: formatCurrency(studioRequestData.cost),
					statusLink: `${env.CLIENT_URL}/studio/requests/${studioRequestData.id}`,
				})
			),
		});

		await transporter.sendMail({
			from: env.EMAIL_FROM,
			to: env.EMAIL_FROM,
			subject: 'Studio Request Received - Action Required',
			html: await render(
				AdminNotificationEmail({
					...studioRequestData,
					type: studioRequestData.StudioType?.name ?? '',
					userName: studioRequestData.User.username,
					userEmail: studioRequestData.User.email,
					cost: formatCurrency(studioRequestData.cost),
					reviewLink: `${env.ADMIN_CLIENT_URL}/studio/requests/${studioRequestData.id}`,
				})
			),
		});
	}

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
	const { data: allocatedSlots, error } = await supabase
		.from('StudioRequest')
		.select('id, startTime, endTime, StudioType(id, name)') // Only select relevant fields
		.eq('status', status)
		.gt('endTime', new TZDate(date, 'Africa/Nairobi').toISOString()); // Only get requests that haven't ended

	if (error) {
		throw new Error(
			`Error fetching approved studio requests: ${error.message}`
		);
	}

	const { data: restrictionData } = await supabase
		.from('RestrictedDates')
		.select('*')
		.eq('date', new TZDate(date, 'Africa/Nairobi').toISOString())
		.single();

	return { allocatedSlots, isRestricted: !!restrictionData };
}

export async function getStudioTypes() {
	const { data, error } = await supabase.from('StudioType').select('*');

	if (error) {
		throw new Error(`Error creating studio type: ${error.message}`);
	}

	return data;
}

export async function getUserDiscounts(role: string) {
	try {
		const { data, error } = await supabase
			.from('Role')
			.select('name, gearDiscount, studioDiscount')
			.eq('name', role);
		if (error) {
			throw new Error(error.message);
		}

		return { success: true, message: 'Successfully fetched discounts', data };
	} catch (e: any) {
		throw new Error(`Error fetching user discounts: ${e.message}`);
	}
}
