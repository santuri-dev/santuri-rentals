'use client';

import { DataTable } from '@/components/DataTable';
import { gearLeaseColumns } from './columns';
import { gearLeaseOpts } from '@/lib/api';

export default function GearLeases() {
	return <DataTable title='' columns={gearLeaseColumns} opts={gearLeaseOpts} />;
}
