import { request } from './axios';
import { QueryOpts } from './queryClient';
import { Course } from './types';

export const coursesOpts: QueryOpts<Course[]> = {
	initialData: [],
	queryKey: ['courses'],
	queryFn: async () => {
		const { data } = (await request.get('/shop/courses')).data;
		return data;
	},
};
