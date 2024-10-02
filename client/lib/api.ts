import { request } from './axios';
import { QueryOpts } from './queryClient';
import { Course, Gear } from './types';

export const coursesOpts: QueryOpts<Course[]> = {
	initialData: [],
	queryKey: ['courses'],
	queryFn: async () => {
		const { data } = (await request.get('/shop/courses')).data;
		return data;
	},
};

export const availableGearOpts: QueryOpts<Gear[]> = {
	initialData: [],
	queryKey: ['gear', 'available'],
	queryFn: async () => {
		const { data } = (await request.get('/gear/available')).data;
		return data;
	},
};
