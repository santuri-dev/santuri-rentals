import Link from 'next/link';

export default function Footer() {
	return (
		<footer className='flex flex-col mt-16 h-[72px] bottom-0 gap-2 sm:flex-row py-10 w-full items-center px-4 md:px-6 border-t'>
			<p className='text-xs text-gray-500 dark:text-gray-400'>
				© {new Date().getFullYear()} Santuri East Africa. All rights reserved.
			</p>
			<nav className='sm:ml-auto flex gap-4 sm:gap-6'>
				<Link className='text-xs hover:underline underline-offset-4' href='#'>
					Terms of Service
				</Link>
				<Link className='text-xs hover:underline underline-offset-4' href='#'>
					Privacy
				</Link>
			</nav>
		</footer>
	);
}
