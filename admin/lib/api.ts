import { request } from './axios';
import { QueryOpts } from './queryClient';
import { Gear, GearCheckout, GearLease, GearStats } from './types';

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
