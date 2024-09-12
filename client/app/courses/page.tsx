import CourseCalendar from '@/components/Courses/CourseCalendar';
import CourseGrid from '@/components/Courses/CourseGrid';

export default function Page() {
	return (
		<div className='flex py-6 max-h-[calc(100vh-72px)]'>
			<div className='w-3/4'>
				<CourseGrid />
			</div>
			<div className='w-1/4'>
				<CourseCalendar />
			</div>
		</div>
	);
}
