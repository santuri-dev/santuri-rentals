import CourseCalendar from '@/components/Courses/CourseCalendar';
import CourseGrid from '@/components/Courses/CourseGrid';

export default function Page() {
	return (
		<div className='py-12 flex'>
			<div className='w-3/4'>
				<CourseGrid />
			</div>
			<div className='w-1/4'>
				<CourseCalendar />
			</div>
		</div>
	);
}
