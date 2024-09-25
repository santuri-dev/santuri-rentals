'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog';
import { coursesOpts } from '@/lib/api';
import { calculateDuration, formatCurrency, formatDate } from '@/lib/helpers';
import { useQuery } from '@tanstack/react-query';
import { Course } from '@/lib/types';
// import DOMPurify from 'dompurify';

function CourseDialog({
	course,
	open,
	onOpenChange,
}: {
	course: Course | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	if (!course) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>{course.name}</DialogTitle>
					<DialogDescription>Course Details</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					{/* <div className='grid grid-cols-4 items-center gap-4'>
						<span
							className='text-sm font-medium col-span-4'
							dangerouslySetInnerHTML={{
								__html: DOMPurify.sanitize(course.description),
							}}
						/>
					</div> */}
					<div className='grid grid-cols-4 items-center gap-4'>
						<span className='text-sm font-medium col-span-2'>
							Application Deadline:
						</span>
						<span className='text-sm col-span-2'>
							{formatDate(course.applicationDeadline)}
						</span>
					</div>
					<div className='grid grid-cols-4 items-center gap-4'>
						<span className='text-sm font-medium col-span-2'>Start Date:</span>
						<span className='text-sm col-span-2'>
							{formatDate(course.startDate)}
						</span>
					</div>
					<div className='grid grid-cols-4 items-center gap-4'>
						<span className='text-sm font-medium col-span-2'>End Date:</span>
						<span className='text-sm col-span-2'>
							{formatDate(course.endDate)}
						</span>
					</div>
					<div className='grid grid-cols-4 items-center gap-4'>
						<span className='text-sm font-medium col-span-2'>Duration:</span>
						<span className='text-sm col-span-2'>
							{calculateDuration(course.startDate, course.endDate)}
						</span>
					</div>
					<div className='grid grid-cols-4 items-center gap-4'>
						<span className='text-sm font-medium col-span-2'>Location:</span>
						<span className='text-sm col-span-2'>{course.location}</span>
					</div>
					<div className='grid grid-cols-4 items-center gap-4'>
						<span className='text-sm font-medium col-span-2'>Cost:</span>
						<span className='text-sm col-span-2'>
							{formatCurrency(course.cost)}
						</span>
					</div>
				</div>
				<DialogFooter>
					<Button type='submit'>Apply</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default function CourseGrid() {
	const { data: courses = [] } = useQuery(coursesOpts);
	const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleViewDetails = (course: Course) => {
		setSelectedCourse(course);
		setDialogOpen(true);
	};

	return (
		<>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{courses.map((course) => (
					<Card key={course.id} className='hover:shadow-lg transition-shadow'>
						<CardHeader>
							<CardTitle>{course.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-sm text-gray-500'>
								Application Deadline:{' '}
								<strong className='text-card-foreground'>
									{formatDate(course.applicationDeadline)}
								</strong>
							</p>
						</CardContent>
						<CardFooter>
							<Button onClick={() => handleViewDetails(course)}>
								View Details
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
			<CourseDialog
				course={selectedCourse}
				open={dialogOpen}
				onOpenChange={setDialogOpen}
			/>
		</>
	);
}
