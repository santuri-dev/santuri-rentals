import GearLeases from '@/components/Tables/GearLeases';
import GearRequestsTable from '@/components/Tables/GearRequests';
import GearTable from '@/components/Tables/GearTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Page() {
	return (
		<div className='flex-col md:flex'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<div className='flex items-center justify-between space-y-2'>
					<h2 className='text-3xl font-bold tracking-tight'>Gear</h2>
				</div>
				<Tabs defaultValue='overview' className='space-y-4'>
					<TabsList>
						<TabsTrigger value='overview'>Overview</TabsTrigger>
						<TabsTrigger value='requests'>Requests</TabsTrigger>
						<TabsTrigger value='leases'>Leases</TabsTrigger>
					</TabsList>
					<TabsContent value='overview' className='space-y-4'>
						<GearTable />
					</TabsContent>
					<TabsContent value='requests' className='space-y-4'>
						<GearRequestsTable />
					</TabsContent>
					<TabsContent value='leases' className='space-y-4'>
						<GearLeases />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
