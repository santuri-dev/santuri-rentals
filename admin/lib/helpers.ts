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

export function calculateTimeDuration(
	startDate: string,
	endDate: string
): string {
	const start = dayjs(startDate);
	const end = dayjs(endDate);

	// Calculate the duration difference
	const diffDuration = dayjs.duration(end.diff(start));

	const years = diffDuration.years();
	const months = diffDuration.months();
	const days = diffDuration.days();
	const hours = diffDuration.hours();
	const minutes = diffDuration.minutes();

	// Build a readable string
	let readableDuration = '';

	if (years > 0) {
		readableDuration += `${years} year${years > 1 ? 's' : ''} `;
	}
	if (months > 0) {
		readableDuration += `${months} month${months > 1 ? 's' : ''} `;
	}
	if (days > 0) {
		readableDuration += `${days} day${days > 1 ? 's' : ''} `;
	}
	if (hours > 0) {
		readableDuration += `${hours} hr${hours > 1 ? 's' : ''} `;
	}
	if (minutes > 0) {
		readableDuration += `${minutes} min${minutes > 1 ? 's' : ''} `;
	}

	return `${readableDuration.trim() || '0 minutes'}`;
}

export function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDate(date: string) {
	return dayjs(date).format('MMM D YYYY');
}

export function formatTime(date: string) {
	return dayjs(date).format('ddd MMM D YY hh:mm A');
}

export const formatCurrency = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'KES',
}).format;

export function camelCaseToReadable(text: string) {
	const readableText = text
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, (str) => str.toUpperCase());
	return readableText.trim();
}
