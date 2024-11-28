'use client';

import { DataTable } from '@/components/DataTable';
import { productColumns, productRowActions } from './columns';
import { productCategoriesOpts, productTableOpts } from '@/lib/api';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Tags } from 'lucide-react';
import ProductForm from '@/components/Forms/product/ProductForm';
import useLazyQuery from '@/hooks/use-lazy-query';
import CategoriesForm from '@/components/Forms/product/CategoriesForm';
import { useQuery } from '@tanstack/react-query';

export default function ProductsTable() {
	const [openCategories, setOpenCategories] = useState(false);
	const [open, setOpen] = useState(false);
	const { refetch } = useLazyQuery(
		productTableOpts({ pageIndex: 0, pageSize: 5 })
	);

	useQuery(productCategoriesOpts);

	return (
		<DataTable
			title=''
			columns={[...productColumns, productRowActions]}
			opts={productTableOpts}
			actions={[
				{
					name: 'Add Product',
					children: (
						<Dialog open={open} onOpenChange={setOpen}>
							<DialogTrigger asChild>
								<Button variant={'secondary'} size={'sm'}>
									Add Product <Plus className='h-4 w-4 ml-2' />
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogTitle>Product Form</DialogTitle>
								<DialogDescription>
									Enter the details of the product. This can also be edited
									later.
								</DialogDescription>
								<ProductForm
									onSubmit={async () => {
										setOpen(false);
										await refetch();
									}}
								/>
							</DialogContent>
						</Dialog>
					),
				},
				{
					name: 'Categories',
					children: (
						<Dialog open={openCategories} onOpenChange={setOpenCategories}>
							<DialogTrigger asChild>
								<Button variant={'secondary'} size={'sm'}>
									Categories
									<Tags className={'h-4 w-4 p-0 ml-2'} />
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogTitle>Categories</DialogTitle>
								<DialogDescription>
									Enter the name of the category.
								</DialogDescription>
								<CategoriesForm
									onSubmit={async () => {
										await refetch();
									}}
								/>
							</DialogContent>
						</Dialog>
					),
				},
			]}
		/>
	);
}
