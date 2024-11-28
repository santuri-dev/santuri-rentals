'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { UserRole } from '@/lib/types';
import { Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { userRolesOpts } from '@/lib/api';
import { request } from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import Dots from '@/components/Loaders/Dots';
import useLazyQuery from '@/hooks/use-lazy-query';
import UserRolesForm, {
	RoleFormInput,
} from '@/components/Forms/users/UserRoleForm';

export default function UserRoleRowActions({ role }: { role: UserRole }) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const { refetch } = useLazyQuery(
		userRolesOpts({ pageIndex: 0, pageSize: 5 })
	);

	async function handleDelete() {
		setDeleting(true);

		try {
			await request.delete(`/users/roles/${role.id}`);
			toast({
				title: 'Success',
				description: `Successfully deleted ${role.name}`,
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: `Something went wrong deleting ${role.name}`,
			});
		}

		setDeleting(false);
		setDeleteOpen(false);
		await refetch();
	}

	return (
		<div className='flex items-center gap-2'>
			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogTrigger asChild>
					<Button variant={'secondary'} size={'icon'} className='h-8 w-8 p-0'>
						<Edit className='h-4 w-4 p-0' />
					</Button>
				</DialogTrigger>
				<DialogContent className='max-h-[90vh] overflow-y-auto'>
					<DialogTitle>Studio Form</DialogTitle>
					<DialogDescription>
						Enter the details of the item. This can also be edited later.
					</DialogDescription>
					<UserRolesForm
						defaultValues={{
							...(role as RoleFormInput),
							id: role.id,
						}}
						onSubmit={async () => {
							setEditOpen(false);
							await refetch();
						}}
					/>
				</DialogContent>
			</Dialog>
			<Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<DialogTrigger asChild>
					<Button variant={'destructive'} size={'icon'} className='h-8 w-8 p-0'>
						<Trash className='h-4 w-4 p-0 text-destructive-foreground' />
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className='mb-4'>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. Are you sure you want to permanently
							delete this item from the database?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							disabled={deleting}
							onClick={handleDelete}
							variant={'destructive'}
							type='submit'>
							{deleting ? <Dots /> : 'Confirm'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
