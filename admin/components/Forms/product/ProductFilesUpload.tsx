'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { request } from '@/lib/axios';
import { Label } from '@/components/ui/label';
import { Product } from '@/lib/types';
import Dots from '@/components/Loaders/Dots';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function ProductFilesUpload({
	initalValues,
	onSubmit,
}: {
	initalValues: Pick<Product, 'id' | 'imageUrl' | 'name' | 'imagePlaceholder'>;
	onSubmit?: () => Promise<unknown>;
}) {
	const [{ cover }, setSelectedFiles] = useState<{
		cover: File | null;
	}>({
		cover: null,
	});
	const [submitting, setSubmitting] = useState(false);

	const coverRef = useRef<HTMLInputElement>(null);

	const onCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const file = event.target.files[0];
			setSelectedFiles((prev) => ({
				...prev,
				cover: file,
			}));
		}
	};

	function resetInput() {
		setSelectedFiles({ cover: null });
		if (coverRef.current) coverRef.current.value = '';
	}

	async function handleSubmit() {
		if (initalValues) {
			setSubmitting(true);
			try {
				await request.postForm(`/products/${initalValues.id}/cover`, {
					cover,
				});
				toast({
					title: 'Success',
					description: 'Successfully Uploaded',
				});
			} catch (error) {
				toast({ title: 'Error', description: 'Failed to upload the files' });
			}
			setSubmitting(false);
			if (onSubmit) void onSubmit();
			resetInput();
		}
	}

	return (
		<div className='border rounded-md'>
			<div className='w-full flex justify-between items-center border-b px-4 py-2 bg-slate-900 rounded-t-md'>
				<p className='font-semibold'>Upload</p>
			</div>
			<div className='h-fit p-4 w-full flex flex-col gap-4'>
				<div className='w-full'>
					<div className='space-y-2'>
						<Label>Image (.png/.jpg/.webp)</Label>
						<Input
							type='file'
							name='image'
							accept='image/*'
							onChange={onCoverChange}
							ref={coverRef}
							className='text-white'
						/>
						{!initalValues?.imageUrl ? (
							<p className='text-sm text-red-500 font-semibold'>
								Upload a the preview image
							</p>
						) : null}
					</div>
				</div>

				<div className='w-full flex justify-end'>
					<Button
						onClick={handleSubmit}
						className='w-fit'
						disabled={!cover || submitting}
						type='button'>
						{submitting ? <Dots size='28' /> : 'Upload'}
					</Button>
				</div>

				{initalValues?.imageUrl ? (
					<div className='mt-4 aspect-square relative'>
						<Image
							alt={`${initalValues.name} image cover`}
							src={initalValues.imageUrl}
							className='h-32 w-32 object-cover'
							fill
							placeholder='blur'
							blurDataURL={initalValues.imagePlaceholder ?? ''}
						/>
					</div>
				) : null}
			</div>
		</div>
	);
}
