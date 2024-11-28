import { forwardRef, useEffect, useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
	({ className, ...props }, ref) => {
		const [type, setType] = useState<'password' | 'text'>('password');
		const disabled =
			props.value === '' || props.value === undefined || props.disabled;

		const toggleType = () => {
			setType((prevType) => (prevType === 'password' ? 'text' : 'password'));
		};

		useEffect(() => {
			if (props.value === '') {
				setType('password');
			}
		}, [props]);

		return (
			<div className='relative'>
				<Input
					type={type}
					className={cn('hide-password-toggle pr-10', className)}
					ref={ref}
					{...props}
				/>
				<Button
					tabIndex={-1}
					type='button'
					variant='ghost'
					size='sm'
					className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
					onClick={toggleType}
					disabled={disabled}>
					{type === 'password' && !disabled ? (
						<EyeOffIcon className='h-4 w-4' aria-hidden='true' />
					) : (
						<EyeIcon className='h-4 w-4' aria-hidden='true' />
					)}
					<span className='sr-only'>
						{type === 'password' ? 'Show password' : 'Hide password'}
					</span>
				</Button>

				{/* hides browsers password toggles */}
				<style>{`
          .hide-password-toggle::-ms-reveal,
          .hide-password-toggle::-ms-clear {
            visibility: hidden;
            pointer-events: none;
            display: none;
          }
        `}</style>
			</div>
		);
	}
);

PasswordInput.displayName = 'PasswordInput';
