import { request } from './axios';
import { QueryOpts } from './queryClient';
import { GearStats } from './types';

export const gearStatsOpts: QueryOpts<GearStats> = {
	initialData: { 'Due Today': 0, Available: 0, Leased: 0, Overdue: 0 },
	queryKey: ['gear', 'stats'],
	queryFn: async () => {
		const { data } = (await request.get('/gear/stats')).data;
		return data;
	},
};
