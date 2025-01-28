import supabase from '@/db';
import { formatCurrency, formatTime } from '@/lib/helpers';
import { getPagination, PaginationState } from '@/lib/pagination';
import { TZDate } from '@date-fns/tz';
import {
	add,
	setHours,
	setMilliseconds,
	setMinutes,
	setSeconds,
} from 'date-fns';
import env from '@/lib/env';
import transporter from '@/lib/nodemailer';
import { render } from '@react-email/components';
import RequestApprovalEmail from '@/emails/RequestApprovalEmail';

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
			.select('*, User(*), StudioType(*)')
			.single();

		if (error) throw new Error(error.message);

		if (data.gearItems) {
			const { error: gearError } = await supabase
				.from('Gear')
				.update({ status: 'class' })
				.in('id', data.gearItems);

			if (gearError) throw new Error(gearError.message);
		}

		if (data.User) {
			await transporter.sendMail({
				from: env.EMAIL_FROM,
				to: data.User.email,
				subject: 'Studio Request Approved',
				html: await render(
					RequestApprovalEmail({
						...data,
						type: data.StudioType?.name ?? '',
						userName: data.User.username,
						cost: formatCurrency(data.cost),
						statusLink: `${env.CLIENT_URL}/studio/requests/${studioRequestData.id}`,
					})
				),
			});
		}
		return { data };
	}
}

export async function getAdminStudioRequests(
	query: PaginationState & { date: string }
) {
	const { from, pageIndex, pageSize, to } = getPagination({
		pageIndex: query.pageIndex,
		pageSize: query.pageSize,
	});

	const startTime = setMilliseconds(
		setSeconds(setMinutes(setHours(new Date(query.date), 0), 0), 0),
		0
	);

	const after24Hours = add(startTime, { hours: 24 });

	const { data, error, count } = await supabase
		.from('StudioRequest')
		.select('*, StudioType(id, name, pricing), User(id, username, email)', {
			count: 'exact',
		})
		.gte('startTime', new TZDate(startTime, 'Africa/Nairobi').toISOString())
		.lte('startTime', new TZDate(after24Hours, 'Africa/Nairobi').toISOString())
		.order('createdAt')
		.range(from, to);

	if (error) {
		throw new Error(`Error fetching studio requests: ${error.message}`);
	}

	return { data, pagination: { pageIndex, pageSize, count } };
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

export async function getStudioTypesAdmin(pagination: PaginationState) {
	const { from, pageIndex, pageSize, to } = getPagination(pagination);

	const { data, error, count } = await supabase
		.from('StudioType')
		.select('*', { count: 'exact' })
		.order('id')
		.range(from, to);

	if (error) {
		throw new Error(`Error creating studio type: ${error.message}`);
	}

	return { data, pagination: { pageIndex, pageSize, count } };
}

function datesWithin(from: Date, to?: Date): TZDate[] {
	const result: TZDate[] = [];
	const startDate = new TZDate(from, 'Africa/Nairobi');
	const endDate = to
		? new TZDate(to, 'Africa/Nairobi')
		: new TZDate(from, 'Africa/Nairobi');

	if (startDate > endDate) {
		throw new Error("'from' date must be earlier than or equal to 'to' date");
	}

	const currentDate = startDate;
	while (currentDate <= endDate) {
		result.push(new TZDate(currentDate, 'Africa/Nairobi'));
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return result;
}

export async function restrictStudioDates({
	from,
	to,
}: {
	from: string;
	to?: string;
}) {
	try {
		const formattedFrom = setMilliseconds(
			setSeconds(setMinutes(new TZDate(from), 0), 0),
			0
		);

		const formattedTo = to
			? setMilliseconds(setSeconds(setMinutes(new TZDate(to), 0), 0), 0)
			: undefined;

		const dates = datesWithin(
			new TZDate(formattedFrom),
			formattedTo ? new TZDate(formattedTo) : undefined
		).map((v) => ({ date: v.toISOString() }));

		const { error } = await supabase.from('RestrictedDates').insert(dates);

		if (error) {
			throw new Error(
				`Something went wrong adding restricted dates${error.message}`
			);
		}
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function getRestrictedStudioDatesAdmin(query: PaginationState) {
	try {
		const { from, pageIndex, pageSize, to } = getPagination({
			pageIndex: query.pageIndex,
			pageSize: query.pageSize,
		});

		const { error, data, count } = await supabase
			.from('RestrictedDates')
			.select('*', { count: 'exact' })
			.gte('date', new TZDate(new Date(), 'Africa/Nairobi').toISOString())
			.range(from, to);

		if (error) {
			throw new Error(
				`Something went wrong adding restricted dates${error.message}`
			);
		}

		return { data, pagination: { pageIndex, pageSize, count } };
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function deleteStudioRestrictedDate(id: number) {
	const { data, error } = await supabase
		.from('RestrictedDates')
		.delete()
		.eq('id', id)
		.select('*')
		.single();

	if (error) {
		throw new Error(`Error deleting restricted date: ${error.message}`);
	}

	return data;
}
