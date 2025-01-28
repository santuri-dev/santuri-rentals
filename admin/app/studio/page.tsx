import RestrictedDatesTable from '@/components/Tables/studio/RestrictedDatesTable';
import StudioRequestsTable from '@/components/Tables/studio/StudioRequestsTable';
import StudioTypesTable from '@/components/Tables/studio/StudioTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Page() {
	return (
		<div className='flex-col md:flex'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<div className='flex items-center justify-between space-y-2'>
					<h2 className='text-3xl font-bold tracking-tight'>Studio</h2>
				</div>
				<Tabs defaultValue='studios' className='space-y-4'>
					<TabsList>
						<TabsTrigger value='studios'>Studios</TabsTrigger>
						<TabsTrigger value='requests'>Requests</TabsTrigger>
						<TabsTrigger value='restricted-dates'>Restricted Dates</TabsTrigger>
					</TabsList>
					<TabsContent value='requests' className='space-y-4'>
						<StudioRequestsTable />
					</TabsContent>
					<TabsContent value='studios' className='space-y-4'>
						<StudioTypesTable />
					</TabsContent>
					<TabsContent value='restricted-dates' className='space-y-4'>
						<RestrictedDatesTable />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
