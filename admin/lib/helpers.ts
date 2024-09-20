import dayjs from 'dayjs';

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

export function camelCaseToReadable(text: string) {
	const readableText = text
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, (str) => str.toUpperCase());
	return readableText.trim();
}
