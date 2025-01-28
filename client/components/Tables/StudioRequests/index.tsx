'use client';

import { DataTable } from '@/components/DataTable';
import { studioRequestColumns } from './columns';
import { userStudioRequestsOpts } from '@/lib/api';

export default function StudioRequestsTable() {
	return (
		<DataTable
			title=''
			columns={studioRequestColumns}
			opts={userStudioRequestsOpts}
		/>
	);
}
