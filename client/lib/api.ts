import { PaginatedResponse } from '@/components/DataTable/types';
import { request } from './axios';
import { QueryOpts, UQueryOpts } from './queryClient';
import { Course, Gear, Order, Product } from './types';
import { PaginationState } from '@tanstack/react-table';

export const coursesOpts: QueryOpts<Course[]> = {
	initialData: [],
	queryKey: ['courses'],
	queryFn: async () => {
		const { data } = (await request.get('/shop/courses')).data;
		return data;
	},
};

export const availableGearOpts = ({
	pageIndex,
	pageSize,
}: PaginationState): QueryOpts<PaginatedResponse<Gear>> => {
	return {
		initialData: {
			data: [],
			pagination: { count: 0, pageIndex: 0, pageSize: 0 },
		},
		queryKey: ['gear', 'available', pageIndex, pageSize],
		queryFn: async () => {
			return (
				await request.get(
					`/gear/available?pageIndex=${pageIndex}&pageSize=${pageSize}`
				)
			).data;
		},
	};
};

export const productsOpts: UQueryOpts<Product[]> = {
	queryKey: ['products'],
	queryFn: async () => {
		const { data } = (await request.get('/shop/products')).data;
		return data;
	},
};

export const fetchOrderOpts = (
	ref: string,
	checkout_id: string,
	signature: string,
	trackingId: string
): UQueryOpts<Order> => ({
	queryKey: ['order', ref, checkout_id, signature],
	queryFn: async () =>
		await fetchOrder(ref, checkout_id, signature, trackingId),
});

async function fetchOrder(
	ref: string,
	checkout_id: string,
	signature: string,
	trackingId: string
): Promise<Order> {
	return (
		await request.get(
			`/shop/checkout/${ref}?signature=${signature}&checkout_id=${checkout_id}&tracking_id=${trackingId}`
		)
	).data.data;
}
