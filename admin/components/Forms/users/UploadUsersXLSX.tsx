'use client';

import * as XLSX from 'xlsx';
import { userRolesOpts } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { UserRole } from '@/lib/types';
import { request } from '@/lib/axios';
import { toast } from '@/hooks/use-toast';

function convertArrayToObject(array: any[][]) {
	const keys = array[0];
	const result = [];

	for (let i = 1; i < array.length; i++) {
		const obj = {} as any;
		const [name, email] = array[i];

		obj[keys[0]] = name;
		obj[keys[1]] = email;

		result.push(obj);
	}

	return result;
}

export default function UploadUsersXLSX() {
	const {
		data: { data: roles },
	} = useQuery(userRolesOpts({ pageIndex: 0, pageSize: 20 }));

	const [file, setFile] = useState<File | undefined>(undefined);
	const [role, setRole] = useState<UserRole | undefined>();
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const f = event.target.files?.[0];
		if (f) {
			setFile(f);
		}
	};

	const convertFile = (onConvert: (emails: any[]) => Promise<void>) => {
		if (!file) {
			return;
		}
		const reader = new FileReader();

		reader.onload = async (e: ProgressEvent<FileReader>) => {
			const data = new Uint8Array(e.target?.result as ArrayBuffer);
			const wb = XLSX.read(data);

			const worksheetName = wb.SheetNames[0];
			if (worksheetName) {
				const worksheet = wb.Sheets[worksheetName];
				if (worksheet) {
					const jsonData = XLSX.utils.sheet_to_json(worksheet, {
						header: 1,
					});
					await onConvert(convertArrayToObject(jsonData as any[][]));
				}
			}
		};

		reader.readAsArrayBuffer(file);
	};

	async function onConvert(emails: any[]) {
		setLoading(true);
		try {
			const { data } = await request.post('/users/invites', {
				emails: emails.map(({ email }) => email),
				roleId: role?.id,
			});

			if (data.success) {
				toast({ title: 'Success', description: data.message });
				setOpen(false);
			} else {
				toast({
					title: 'Error',
					description: data.message,
					variant: 'destructive',
				});
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: error.message,
				variant: 'destructive',
			});
		}
		setLoading(false);
	}

	async function handleUpload() {
		convertFile(onConvert);
	}

	function handleRoleChange(value: string) {
		const selectedRole = roles.find((v) => v.id.toString() === value);
		if (selectedRole) {
			setRole(selectedRole);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={'secondary'} size={'sm'}>
					<UserPlus className='h-4 w-4 mr-1' />
					Invite Users
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Upload excel file (.xlsx)</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will invite users in the excel
						file to create accounts with the specified role you have selected.
					</DialogDescription>
				</DialogHeader>
				<Select value={role?.id.toString()} onValueChange={handleRoleChange}>
					<SelectTrigger>
						<SelectValue placeholder='Select Role' />
					</SelectTrigger>
					<SelectContent>
						{roles.map(({ id, name }) => (
							<SelectItem key={id} value={id.toString()}>
								{name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Input type='file' accept='.xlsx' onChange={handleFileChange} />
				<Button disabled={loading} onClick={handleUpload}>
					Upload
				</Button>
			</DialogContent>
		</Dialog>
	);
}
