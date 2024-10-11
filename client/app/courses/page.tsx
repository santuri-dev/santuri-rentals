import CourseCalendar from '@/components/Courses/CourseCalendar';
import CourseGrid from '@/components/Courses/CourseGrid';

export default function Page() {
	return (
		<div className='flex py-8'>
			<div className='w-full md:w-3/4'>
				<CourseGrid />
			</div>
			<div className='hidden lg:block w-1/4'>
				<CourseCalendar />
			</div>
		</div>
	);
}
