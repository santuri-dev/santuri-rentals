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
import { Course } from '@/lib/types';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { coursesOpts } from '@/lib/api';
import { request } from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import Dots from '@/components/Loaders/Dots';
import useLazyQuery from '@/hooks/use-lazy-query';
import CourseForm from '@/components/Forms/courses/CourseForm';
import Link from 'next/link';

export default function CourseRowActions({
	course,
	showMore = true,
	onDelete,
	onEdit,
}: {
	course: Course;
	showMore?: boolean;
	onEdit?: () => void;
	onDelete?: () => void;
}) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const { refetch } = useLazyQuery(coursesOpts({ pageIndex: 0, pageSize: 5 }));

	async function handleDelete() {
		setDeleting(true);

		try {
			await request.delete(`/courses/delete/${course.id}`);
			toast({
				title: 'Success',
				description: `Successfully deleted ${course.name}`,
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: `Something went wrong deleting ${course.name}`,
			});
		}

		setDeleting(false);
		setDeleteOpen(false);
		await refetch();
		if (onDelete) onDelete();
	}

	return (
		<div className='flex items-center gap-2'>
			{showMore ? (
				<Button variant={'ghost'} size={'icon'} asChild>
					<Link href={`/courses/${course.slug}`}>
						<MoreHorizontal className='h-4 w-4 p-0' />
					</Link>
				</Button>
			) : null}
			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogTrigger asChild>
					<Button variant={'secondary'} size={'icon'} className='h-8 w-8 p-0'>
						<Edit className='h-4 w-4 p-0' />
					</Button>
				</DialogTrigger>
				<DialogContent className='max-h-[90vh] max-w-[50vw] overflow-y-auto'>
					<DialogTitle>Course Form</DialogTitle>
					<DialogDescription>
						Enter the details of the item. This can also be edited later.
					</DialogDescription>
					<CourseForm
						defaultValues={{
							...course,
							endDate: new Date(course.endDate),
							startDate: new Date(course.startDate),
							applicationDeadline: new Date(course.applicationDeadline),
						}}
						onSubmit={async () => {
							setEditOpen(false);
							await refetch();
							if (onEdit) onEdit();
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
