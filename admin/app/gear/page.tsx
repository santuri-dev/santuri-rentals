import GearTable from '@/components/Tables/GearTable';

export default function Page() {
	return (
		<div className='flex-col md:flex'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<div className='flex items-center justify-between space-y-2'>
					<h2 className='text-3xl font-bold tracking-tight'>Gear</h2>
				</div>
				<GearTable />
			</div>
		</div>
	);
}
