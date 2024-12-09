'use client';

import { DataTable } from '@/components/DataTable';
import { userOpts } from '@/lib/api';
import { userColumns } from './columns';
import UploadUsersXLSX from '@/components/Forms/users/UploadUsersXLSX';

export default function UserList() {
	return (
		<DataTable
			title=''
			columns={userColumns}
			opts={userOpts}
			actions={[{ name: 'Add Users', children: <UploadUsersXLSX /> }]}
		/>
	);
}
