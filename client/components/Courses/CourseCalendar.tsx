'use client';

import { useQuery } from '@tanstack/react-query';
import { Calendar } from '../ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { coursesOpts } from '@/lib/api';
import { formatDate } from '@/lib/helpers';
import { useState } from 'react';

export default function CourseCalendar() {
	const { data: courses } = useQuery(coursesOpts);
	const [selected, setSelected] = useState<Date | undefined>();

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
				selected={selected}
			/>
			<ScrollArea className='w-full shadow-inner'>
				{courses.map((course) => (
					<Card
						key={course.id}
						className='mb-4 w-[90%]'
						onClick={() => {
							setSelected(new Date(course.startDate));
						}}>
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
