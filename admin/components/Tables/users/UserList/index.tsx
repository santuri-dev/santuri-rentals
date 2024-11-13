'use client';

import { DataTable } from '@/components/DataTable';
import { userOpts } from '@/lib/api';
import { userColumns } from './columns';

export default function UserList() {
	return <DataTable title='' columns={userColumns} opts={userOpts} />;
}
