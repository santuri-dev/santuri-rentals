import { request } from './axios';
import { QueryOpts, UQueryOpts } from './queryClient';
import { Course, Gear, Product } from './types';

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

export const productsOpts: UQueryOpts<Product[]> = {
	queryKey: ['products'],
	queryFn: async () => {
		const { data } = (await request.get('/shop/products')).data;
		return data;
	},
};
