'use client';

import { DataTable } from '@/components/DataTable';
import { gearRequestOpts } from '@/lib/api';
import { gearRequestColumns } from './columns';

export default function GearRequestsTable() {
	return (
		<DataTable title='' columns={gearRequestColumns} opts={gearRequestOpts} />
	);
}
