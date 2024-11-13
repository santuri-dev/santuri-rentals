'use client';

import { DataTable } from '@/components/DataTable';
import { userRolesOpts } from '@/lib/api';
import { userRoleRowActions, userRolesColumns } from './columns';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import UserRolesForm from '@/components/Forms/users/UserRoleForm';

export default function UserRolesList() {
	const [open, setOpen] = useState(false);

	return (
		<DataTable
			title=''
			actions={[
				{
					name: 'Add Role',
					children: (
						<Dialog open={open} onOpenChange={setOpen}>
							<DialogTrigger asChild>
								<Button variant={'secondary'} size={'sm'}>
									Add Role <Plus className='h-4 w-4 ml-2' />
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogTitle>Role Form</DialogTitle>
								<DialogDescription>
									Enter the details of the role. This can also be edited later.
								</DialogDescription>
								<UserRolesForm
									onSubmit={async () => {
										setOpen(false);
										// await refetch();
									}}
								/>
							</DialogContent>
						</Dialog>
					),
				},
			]}
			columns={[...userRolesColumns, userRoleRowActions]}
			opts={userRolesOpts}
		/>
	);
}
