'use client';

import { DataTable } from '@/components/DataTable';
import { courseColumns, courseRowActions } from './columns';
import { coursesOpts } from '@/lib/api';
import { useState } from 'react';
import useLazyQuery from '@/hooks/use-lazy-query';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CourseForm from '@/components/Forms/courses/CourseForm';

export default function CoursesTable() {
	const [open, setOpen] = useState(false);
	const { refetch } = useLazyQuery(coursesOpts);

	return (
		<DataTable
			title=''
			columns={[...courseColumns, courseRowActions]}
			opts={coursesOpts}
			actions={[
				{
					name: 'Add Gear',
					children: (
						<Dialog open={open} onOpenChange={setOpen}>
							<DialogTrigger asChild>
								<Button variant={'secondary'} size={'sm'}>
									Add Course <Plus className='h-4 w-4 ml-2' />
								</Button>
							</DialogTrigger>
							<DialogContent className='max-w-[50vw]'>
								<DialogTitle>Course Form</DialogTitle>
								<DialogDescription>
									Enter the details of the course. This can also be edited
									later.
								</DialogDescription>
								<CourseForm
									onSubmit={async () => {
										setOpen(false);
										await refetch();
									}}
								/>
							</DialogContent>
						</Dialog>
					),
				},
			]}
		/>
	);
}
