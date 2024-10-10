import ProductsTable from '@/components/Tables/products/ProductsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Page() {
	return (
		<div className='flex-col md:flex'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<div className='flex items-center justify-between space-y-2'>
					<h2 className='text-3xl font-bold tracking-tight'>Shop</h2>
				</div>
				<Tabs defaultValue='products' className='space-y-4'>
					<TabsList>
						<TabsTrigger value='products'>Products</TabsTrigger>
					</TabsList>
					<TabsContent value='products' className='space-y-4'>
						<ProductsTable />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
