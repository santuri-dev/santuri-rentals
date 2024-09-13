import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
	title: 'Santuri East Africa',
	description: 'Production classes, Studio time and Gear Rental',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`antialiased max-w-screen overflow-x-hidden h-fit`}>
				<Providers>
					<Header />
					<main className='px-6'>{children}</main>
				</Providers>
				<Toaster />
			</body>
		</html>
	);
}
