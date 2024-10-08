import InventoryStats from '@/components/InventoryStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Page() {
	return (
		<div className='flex-col md:flex'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<div className='flex items-center justify-between space-y-2'>
					<h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
				</div>
				<Tabs defaultValue='analytics' className='space-y-4'>
					<TabsList>
						<TabsTrigger value='overview'>Overview</TabsTrigger>
						<TabsTrigger value='analytics'>Analytics</TabsTrigger>
					</TabsList>
					<TabsContent value='overview' className='space-y-4'></TabsContent>
					<TabsContent value='analytics' className='space-y-4'>
						<InventoryStats />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
