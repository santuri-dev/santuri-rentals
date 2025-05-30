import CoursesTable from '@/components/Tables/courses/CoursesTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Page() {
	return (
		<div className='flex-col md:flex'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<div className='flex items-center justify-between space-y-2'>
					<h2 className='text-3xl font-bold tracking-tight'>Courses</h2>
				</div>
				<Tabs defaultValue='overview' className='space-y-4'>
					<TabsList>
						<TabsTrigger value='overview'>Overview</TabsTrigger>
					</TabsList>
					<TabsContent value='overview' className='space-y-4'>
						<CoursesTable />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
