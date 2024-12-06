'use client';

import { DataTable } from '@/components/DataTable';
import { studioRequestColumns, studioRequestRowActions } from './columns';
import { studioRequestOpts } from '@/lib/api';
import DatePicker from '@/components/ui/date-picker';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function StudioRequestsTable() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [selected, setSelectedDate] = useState<Date>(new Date());

	useEffect(() => {
		const dateParam = searchParams.get('date');
		if (dateParam) {
			setSelectedDate(new Date(dateParam));
		} else {
			setSelectedDate(new Date());
		}
	}, [searchParams]);

	const handleDateChange = (date: Date) => {
		setSelectedDate(date);
		if (date) {
			const newSearchParams = new URLSearchParams(searchParams.toString());
			newSearchParams.set('date', date.toISOString());
			router.push(`?${newSearchParams.toString()}`, { scroll: false });
		}
	};

	return (
		<DataTable
			title=''
			columns={[...studioRequestColumns, studioRequestRowActions]}
			opts={(pagination) => studioRequestOpts(pagination, selected)}
			actions={[
				{
					name: 'Date',
					children: (
						<DatePicker
							onChange={handleDateChange}
							selected={selected}
							placeholderText='Select Date'
						/>
					),
				},
			]}
		/>
	);
}
