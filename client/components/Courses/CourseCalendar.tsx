'use client';

import { useQuery } from '@tanstack/react-query';
import { Calendar } from '../ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { coursesOpts } from '@/lib/api';
import { formatDate } from '@/lib/helpers';

export default function CourseCalendar() {
	const { data: courses } = useQuery(coursesOpts);

	return (
		<div className='px-6 flex items-center justify-center flex-col shadow-lg'>
			<h2 className='text-lg font-bold mb-4'>Upcoming Courses</h2>
			<Calendar
				className='mb-6'
				fromDate={new Date()}
				onDayClick={(date) => {
					if (
						courses.length > 0 &&
						new Date(courses[0].startDate).getDate() === date.getDate()
					) {
						console.log('date selected');
					}
				}}
				selected={
					courses.length > 0 ? new Date(courses[0].startDate) : new Date()
				}
			/>
			<ScrollArea className='w-full'>
				{courses.map((course) => (
					<Card key={course.id} className='mb-4'>
						<CardHeader>
							<CardTitle className='text-sm'>{course.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-xs text-gray-500'>
								Starts: {formatDate(course.startDate)}
							</p>
						</CardContent>
					</Card>
				))}
			</ScrollArea>
		</div>
	);
}
