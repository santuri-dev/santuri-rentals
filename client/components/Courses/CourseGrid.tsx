'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { coursesOpts } from '@/lib/api';
import { formatDate } from '@/lib/helpers';
import { useQuery } from '@tanstack/react-query';

export default function CourseGrid() {
	const { data: courses } = useQuery(coursesOpts);

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
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
						<Button>View Details</Button>
					</CardFooter>
				</Card>
			))}
		</div>
	);
}
