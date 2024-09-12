import dayjs from 'dayjs';

export function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDate(date: string) {
	return dayjs(date).format('MMM D YYYY');
}
