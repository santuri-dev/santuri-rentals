'use client';

import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface ArrayInputProps {
	onChange: (values: string[]) => void;
	values: string[];
	placeholder: string;
}

export default function ArrayInput({
	onChange,
	values,
	placeholder,
}: ArrayInputProps) {
	const [currentValue, setCurrentValue] = useState('');

	const handleAddValue = () => {
		if (currentValue.trim() !== '') {
			onChange([...values, currentValue.trim()]);
			setCurrentValue('');
		}
	};

	const handleRemoveValue = (index: number) => {
		onChange(values.filter((_, i) => i !== index));
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleAddValue();
		}
	};

	return (
		<>
			<div className='flex space-x-2 mb-4'>
				<Input
					type='text'
					value={currentValue}
					onChange={(e) => setCurrentValue(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					className='flex-grow'
				/>
				<Button
					className='h-8 w-8 p-0'
					variant={'ghost'}
					size={'icon'}
					disabled={currentValue.length === 0}
					onClick={handleAddValue}>
					<Plus className='h-4 w-4' />
				</Button>
			</div>
			<div className='space-y-2'>
				{values.map((value, index) => (
					<div key={index} className='flex items-center space-x-2'>
						<Input type='text' value={value} readOnly className='flex-grow' />
						<Button
							variant='ghost'
							size='icon'
							onClick={() => handleRemoveValue(index)}
							className='h-8 w-8 p-0'>
							<X className='h-4 w-4' />
						</Button>
					</div>
				))}
			</div>
		</>
	);
}
