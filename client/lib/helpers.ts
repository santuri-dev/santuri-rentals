import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(durationPlugin);
dayjs.extend(relativeTime);

export function calculateDuration(startDate: string, endDate: string): string {
	const start = dayjs(startDate);
	const end = dayjs(endDate);

	// Calculate the exact difference in each unit
	const years = end.diff(start, 'year');
	const months = end.diff(start.add(years, 'year'), 'month');
	const weeks = end.diff(start.add(years, 'year').add(months, 'month'), 'week');
	const days = end.diff(
		start.add(years, 'year').add(months, 'month').add(weeks, 'week'),
		'day'
	);

	// Build a readable string, preferring the largest unit
	let readableDuration = '';

	if (years > 0) {
		readableDuration = `${years} year${years > 1 ? 's' : ''}`;
	} else if (months > 0) {
		readableDuration = `${months} month${months > 1 ? 's' : ''}`;
	} else if (weeks > 0) {
		readableDuration = `${weeks} week${weeks > 1 ? 's' : ''}`;
	} else {
		readableDuration = `${days} day${days > 1 ? 's' : ''}`;
	}

	return `~ ${readableDuration}`;
}

export function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDate(date: string) {
	return dayjs(date).format('MMM D YYYY');
}

export const formatCurrency = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'KES',
}).format;

export const parseTime = (time: string): { hours: number; minutes: number } => {
	const [, hours, period] = time.match(/(\d+)(am|pm)/i) || [];
	let parsedHours = parseInt(hours);

	if (period.toLowerCase() === 'pm' && parsedHours !== 12) {
		parsedHours += 12;
	} else if (period.toLowerCase() === 'am' && parsedHours === 12) {
		parsedHours = 0;
	}

	return { hours: parsedHours, minutes: 0 };
};

export const parseDuration = (duration: string): number => {
	return parseInt(duration);
};
