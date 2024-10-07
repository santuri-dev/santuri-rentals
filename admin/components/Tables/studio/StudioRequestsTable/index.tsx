'use client';

import { DataTable } from '@/components/DataTable';
import { studioRequestColumns, studioRequestRowActions } from './columns';
import { studioRequestOpts } from '@/lib/api';

export default function StudioRequestsTable() {
	return (
		<DataTable
			title=''
			columns={[...studioRequestColumns, studioRequestRowActions]}
			opts={studioRequestOpts}
		/>
	);
}
