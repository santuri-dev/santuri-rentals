import { request } from './axios';
import { QueryOpts, UQueryOpts } from './queryClient';
import {
	Course,
	Gear,
	GearCheckout,
	GearLease,
	GearStats,
	StudioRequest,
} from './types';

export const gearStatsOpts: QueryOpts<GearStats> = {
	initialData: { 'Due Today': 0, Available: 0, Leased: 0, Overdue: 0 },
	queryKey: ['gear', 'stats'],
	queryFn: async () => {
		const { data } = (await request.get('/gear/stats')).data;
		return data;
	},
};

export const gearTableOpts: QueryOpts<Gear[]> = {
	initialData: [],
	queryKey: ['gear', 'available'],
	queryFn: async () => {
		const { data } = (await request.get('/gear')).data;
		return data;
	},
};

export const gearRequestOpts: QueryOpts<GearCheckout[]> = {
	initialData: [],
	queryKey: ['gear', 'requests', 'pending'],
	queryFn: async () => {
		const { data } = (await request.get('/gear/requests')).data;
		return data;
	},
};

export const gearLeaseOpts: QueryOpts<GearLease[]> = {
	initialData: [],
	queryKey: ['gear', 'leases'],
	queryFn: async () => {
		const { data } = (await request.get('/gear/leases')).data;
		return data;
	},
};

export const coursesOpts: QueryOpts<Course[]> = {
	initialData: [],
	queryKey: ['courses'],
	queryFn: async () => {
		const { data } = (await request.get('/courses')).data;
		return data;
	},
};

export const courseBySlugOpts = (slug: string): UQueryOpts<Course> => ({
	queryKey: ['courses', slug],
	queryFn: async () => {
		const { data } = (await request.get(`/courses/${slug}`)).data;
		return data;
	},
});

export const studioRequestOpts: QueryOpts<StudioRequest[]> = {
	initialData: [],
	queryKey: ['studio_requests'],
	queryFn: async () => {
		const { data } = (await request.get('/studio/requests')).data;
		return data;
	},
};
