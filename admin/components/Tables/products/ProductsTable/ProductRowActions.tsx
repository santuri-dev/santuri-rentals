'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Product } from '@/lib/types';
import { Edit, Image as ImageIcon, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { productTableOpts } from '@/lib/api';
import { request } from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import Dots from '@/components/Loaders/Dots';
import useLazyQuery from '@/hooks/use-lazy-query';
import ProductForm, {
	ProductFormInput,
} from '@/components/Forms/product/ProductForm';
import ProductFilesUpload from '@/components/Forms/product/ProductFilesUpload';

export default function ProductRowActions({ product }: { product: Product }) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [imageOpen, setImageOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const { refetch } = useLazyQuery(productTableOpts);

	async function handleDelete() {
		setDeleting(true);

		try {
			await request.delete(`/products/${product.id}`);
			toast({
				title: 'Success',
				description: `Successfully deleted ${product.name}`,
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: `Something went wrong deleting ${product.name}`,
			});
		}

		setDeleting(false);
		setDeleteOpen(false);
		await refetch();
	}

	return (
		<div className='flex items-center gap-2'>
			<Dialog open={imageOpen} onOpenChange={setImageOpen}>
				<DialogTrigger asChild>
					<Button variant={'secondary'} size={'icon'} className='h-8 w-8 p-0'>
						<ImageIcon className='h-4 w-4 p-0' />
					</Button>
				</DialogTrigger>
				<DialogContent className='max-h-[90vh] overflow-y-auto'>
					<DialogTitle>Image Upload Form</DialogTitle>
					<DialogDescription>Upload the image cover.</DialogDescription>
					<ProductFilesUpload
						initalValues={{
							id: product.id,
							name: product.name,
							imageUrl: product.imageUrl ?? '',
							imagePlaceholder: product.imagePlaceholder ?? '',
						}}
						onSubmit={async () => {
							setImageOpen(false);
							await refetch();
						}}
					/>
				</DialogContent>
			</Dialog>
			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogTrigger asChild>
					<Button variant={'secondary'} size={'icon'} className='h-8 w-8 p-0'>
						<Edit className='h-4 w-4 p-0' />
					</Button>
				</DialogTrigger>
				<DialogContent className='max-h-[90vh] overflow-y-auto'>
					<DialogTitle>Product Form</DialogTitle>
					<DialogDescription>
						Enter the details of the item. This can also be edited later.
					</DialogDescription>
					<ProductForm
						defaultValues={{ ...(product as ProductFormInput), id: product.id }}
						onSubmit={async () => {
							setEditOpen(false);
							await refetch();
						}}
					/>
				</DialogContent>
			</Dialog>
			<Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<DialogTrigger asChild>
					<Button variant={'destructive'} size={'icon'} className='h-8 w-8 p-0'>
						<Trash className='h-4 w-4 p-0 text-destructive-foreground' />
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className='mb-4'>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. Are you sure you want to permanently
							delete this item from the database?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							disabled={deleting}
							onClick={handleDelete}
							variant={'destructive'}
							type='submit'>
							{deleting ? <Dots /> : 'Confirm'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
