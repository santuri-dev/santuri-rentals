'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import GearForm, { GearFormInput } from '@/components/Forms/gear/GearForm';
import { Gear } from '@/lib/types';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { gearTableOpts } from '@/lib/api';

export default function GearRowActions({ gear }: { gear: Gear }) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const { refetch } = useQuery(gearTableOpts);

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger asChild>
				<Button variant={'ghost'} size={'icon'} className='h-8 w-8 p-0'>
					<Edit className='h-4 w-4 p-0' />
				</Button>
			</DialogTrigger>
			<DialogContent className='max-h-[90vh] overflow-y-scroll'>
				<DialogTitle>Gear Form</DialogTitle>
				<DialogDescription>
					Enter the details of the item. This can also be edited later.
				</DialogDescription>
				<GearForm
					defaultValues={{ ...(gear as GearFormInput), id: gear.id }}
					onSubmit={async () => {
						setDialogOpen(false);
						await refetch();
					}}
				/>
			</DialogContent>
		</Dialog>
	);
}
