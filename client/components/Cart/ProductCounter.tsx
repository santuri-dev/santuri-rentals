'use client';

import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCounterProps {
	count: number;
	onCountChange: (count: number) => void;
}

export default function ProductCounter({
	count,
	onCountChange,
}: ProductCounterProps) {
	const increment = () => {
		onCountChange(count + 1);
	};

	const decrement = () => {
		onCountChange(count - 1);
	};

	return (
		<div className='flex items-center space-x-1/2'>
			<Button
				className='rounded-full h-8 w-8'
				size='icon'
				onClick={decrement}
				aria-label='Remove one item'
				disabled={count === 0}>
				<Minus className='h-3 w-3' />
			</Button>
			<span
				className='w-8 text-center text-sm font-semibold'
				aria-live='polite'
				aria-label={`Current quantity: ${count}`}>
				{count}
			</span>
			<Button
				className='rounded-full h-8 w-8'
				size='icon'
				onClick={increment}
				aria-label='Add one item'>
				<Plus className='h-3 w-3' />
			</Button>
		</div>
	);
}
