'use client';

import { CaretLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { courseBySlugOpts } from '@/lib/api';
import { calculateDuration, formatCurrency, formatDate } from '@/lib/helpers';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Dots from '@/components/Loaders/Dots';
import CourseRowActions from '@/components/Tables/courses/CoursesTable/CourseRowActions';
import { useRouter } from 'next/navigation';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ImageIcon } from 'lucide-react';
import { useState } from 'react';
import CourseFilesUpload from '@/components/Forms/courses/CourseFilesUpload';
import Image from 'next/image';

function CourseDetails({ slug }: { slug: string }) {
	const {
		data: course,
		isFetching,
		refetch,
	} = useQuery(courseBySlugOpts(slug));
	const router = useRouter();
	const [open, setOpen] = useState(false);

	if (isFetching && !course) {
		return <Skeleton className='w-full min-h-[50vh]' />;
	}

	if (!course) {
		return (
			<div className='w-full flex-col gap-4 min-h-[50vh] flex items-center justify-center'>
				Something went wrong.
				<Button
					className='ml-2'
					variant='secondary'
					onClick={async () => await refetch()}>
					{isFetching ? <Dots /> : 'Retry'}
				</Button>
			</div>
		);
	} else {
		return (
			<>
				<div className='flex justify-between flex-col md:flex-row'>
					<div className='flex flex-col gap-2 mb-4 w-full'>
						<h2 className='text-xl font-bold'>{course.name}</h2>
						<Badge variant='outline' className='w-fit'>
							{course.location}
						</Badge>
						<span className='text-lg font-semibold'>
							{formatCurrency(course.cost)}
						</span>
						<div className={'flex gap-2 items-center'}>
							<Dialog open={open} onOpenChange={setOpen}>
								<DialogTrigger asChild>
									<Button
										variant={'secondary'}
										size={'icon'}
										className='h-8 w-8 p-0'>
										<ImageIcon className='h-4 w-4 p-0' />
									</Button>
								</DialogTrigger>
								<DialogContent className='max-h-[90vh] overflow-y-auto'>
									<DialogTitle>Image Upload Form</DialogTitle>
									<DialogDescription>Upload the image cover.</DialogDescription>
									<CourseFilesUpload
										initalValues={{
											id: course.id,
											name: course.name,
											imageUrl: course.imageUrl ?? '',
											imagePlaceholder: course.imagePlaceholder ?? '',
										}}
										onSubmit={async () => {
											// setOpen(false);
											await refetch();
										}}
									/>
								</DialogContent>
							</Dialog>
							<CourseRowActions
								course={course}
								showMore={false}
								onEdit={async () => {
									await refetch();
								}}
								onDelete={() => {
									router.push('/courses');
								}}
							/>
						</div>
					</div>

					<div className='grid w-full'>
						{[
							{
								label: 'Application Deadline',
								value: formatDate(course.applicationDeadline),
							},
							{ label: 'Start Date', value: formatDate(course.startDate) },
							{ label: 'End Date', value: formatDate(course.endDate) },
							{
								label: 'Duration',
								value: calculateDuration(course.startDate, course.endDate),
							},
						].map(({ label, value }, index) => (
							<div className='grid grid-cols-4 items-center' key={index}>
								<span className='text-sm font-medium col-span-2'>{label}:</span>
								<span className='text-sm col-span-2'>{value}</span>
							</div>
						))}
					</div>

					{course.imageUrl ? (
						<div className='h-48 relative aspect-square mt-8 md:mt-0'>
							<Image
								alt={`${course.name} image cover`}
								src={course.imageUrl}
								className='object-contain'
								fill
								placeholder='blur'
								blurDataURL={course.imagePlaceholder ?? ''}
							/>
						</div>
					) : null}
				</div>
				<div
					className='mt-4'
					dangerouslySetInnerHTML={{ __html: course.description }}
				/>
			</>
		);
	}
}

export default function Page({
	params: { slug },
}: {
	params: { slug: string };
}) {
	return (
		<div className='flex-col md:flex'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<div className='flex items-center justify-between space-y-2'>
					<Link
						href='/courses'
						className='text-3xl flex items-center font-bold tracking-tight hover:text-blue-500 transition-all duration-300'>
						<CaretLeftIcon className='h-5 w-5 p-0 mr-2' />
						Courses
					</Link>
				</div>

				<CourseDetails slug={slug} />
			</div>
		</div>
	);
}
