'use client';

import { gearStatsOpts } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { DataCard } from './DataCard';
import { GearStats } from '@/lib/types';

export default function InventoryStats() {
	const { data } = useQuery(gearStatsOpts);

	return (
		<>
			<h2 className='font-semibold text-lg'>Inventory</h2>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				{Object.keys(data)
					.sort()
					.map((k) => (
						<DataCard title={k} key={k} value={data[k as keyof GearStats]} />
					))}
			</div>
		</>
	);
}
