import { PaginationState } from '@tanstack/react-table';
import { request } from './axios';
import { QueryOpts, UQueryOpts } from './queryClient';
import {
	Category,
	Course,
	Gear,
	GearCheckout,
	GearLease,
	GearStats,
	PaginatedResponse,
	Product,
	StudioRequest,
	StudioType,
	User,
	UserRole,
} from './types';

export const createPaginationInitialData = <T>(
	pageIndex: number,
	pageSize: number
): PaginatedResponse<T> => ({
	data: [],
	pagination: { count: 0, pageIndex, pageSize },
});

export const gearStatsOpts: QueryOpts<GearStats> = {
	initialData: { 'Due Today': 0, Available: 0, Leased: 0, Overdue: 0 },
	queryKey: ['gear', 'stats'],
	queryFn: async () => {
		const { data } = (await request.get('/gear/stats')).data;
		return data;
	},
};

export const gearTableOpts = ({
	pageIndex,
	pageSize,
}: PaginationState): QueryOpts<PaginatedResponse<Gear>> => {
	return {
		initialData: createPaginationInitialData(pageIndex, pageSize),
		queryKey: ['gear', 'available', pageIndex, pageSize],
		queryFn: async () => {
			return (
				await request.get(`/gear?pageIndex=${pageIndex}&pageSize=${pageSize}`)
			).data;
		},
	};
};

export const gearRequestOpts = ({
	pageIndex,
	pageSize,
}: PaginationState): QueryOpts<PaginatedResponse<GearCheckout>> => {
	return {
		initialData: createPaginationInitialData(pageIndex, pageSize),
		queryKey: ['gear', 'requests', 'pending', pageIndex, pageSize],
		queryFn: async () => {
			return (
				await request.get(
					`/gear/requests?pageIndex=${pageIndex}&pageSize=${pageSize}`
				)
			).data;
		},
	};
};

export const gearLeaseOpts = ({
	pageIndex,
	pageSize,
}: PaginationState): QueryOpts<PaginatedResponse<GearLease>> => {
	return {
		initialData: createPaginationInitialData(pageIndex, pageSize),
		queryKey: ['gear', 'leases', pageIndex, pageSize],
		queryFn: async () => {
			return (
				await request.get(
					`/gear/leases?pageIndex=${pageIndex}&pageSize=${pageSize}`
				)
			).data;
		},
	};
};

export const coursesOpts = ({
	pageIndex,
	pageSize,
}: PaginationState): QueryOpts<PaginatedResponse<Course>> => {
	return {
		initialData: createPaginationInitialData(pageIndex, pageSize),
		queryKey: ['courses', pageIndex, pageSize],
		queryFn: async () => {
			return (
				await request.get(
					`/courses?pageIndex=${pageIndex}&pageSize=${pageSize}`
				)
			).data;
		},
	};
};

export const courseBySlugOpts = (slug: string): UQueryOpts<Course> => ({
	queryKey: ['courses', slug],
	queryFn: async () => {
		const { data } = (await request.get(`/courses/${slug}`)).data;
		return data;
	},
});

export const studioRequestOpts = ({
	pageIndex,
	pageSize,
}: PaginationState): QueryOpts<PaginatedResponse<StudioRequest>> => {
	return {
		initialData: createPaginationInitialData(pageIndex, pageSize),
		queryKey: ['studio_requests', pageIndex, pageSize],
		queryFn: async () => {
			return (
				await request.get(
					`/studio/requests?pageIndex=${pageIndex}&pageSize=${pageSize}`
				)
			).data;
		},
	};
};

export const studioTypesOpts = ({
	pageIndex,
	pageSize,
}: PaginationState): QueryOpts<PaginatedResponse<StudioType>> => {
	return {
		initialData: createPaginationInitialData(pageIndex, pageSize),
		queryKey: ['studio_types', pageIndex, pageSize],
		queryFn: async () => {
			return (
				await request.get(
					`/studio/types?pageIndex=${pageIndex}&pageSize=${pageSize}`
				)
			).data;
		},
	};
};

export const productTableOpts = ({
	pageIndex,
	pageSize,
}: PaginationState): QueryOpts<PaginatedResponse<Product>> => {
	return {
		initialData: createPaginationInitialData(pageIndex, pageSize),
		queryKey: ['products', pageIndex, pageSize],
		queryFn: async () => {
			return (
				await request.get(
					`/products?pageIndex=${pageIndex}&pageSize=${pageSize}`
				)
			).data;
		},
	};
};

export const productCategoriesOpts: QueryOpts<Category[]> = {
	initialData: [],
	queryKey: ['product', 'categories'],
	queryFn: async () => {
		const { data } = (await request.get('/products/categories')).data;
		return data;
	},
};

export const userOpts = ({
	pageIndex,
	pageSize,
}: PaginationState): QueryOpts<PaginatedResponse<User>> => {
	return {
		initialData: createPaginationInitialData(pageIndex, pageSize),
		queryKey: ['users', pageIndex, pageSize],
		queryFn: async () => {
			return (
				await request.get(`/users?pageIndex=${pageIndex}&pageSize=${pageSize}`)
			).data;
		},
	};
};

export const userRolesOpts = ({
	pageIndex,
	pageSize,
}: PaginationState): QueryOpts<PaginatedResponse<UserRole>> => {
	return {
		initialData: createPaginationInitialData(pageIndex, pageSize),
		queryKey: ['users', 'roles', pageIndex, pageSize],
		queryFn: async () => {
			return (
				await request.get(
					`/users/roles?pageIndex=${pageIndex}&pageSize=${pageSize}`
				)
			).data;
		},
	};
};
