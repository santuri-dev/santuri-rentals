import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';
import Footer from '@/components/Footer';

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
			<body
				className={`antialiased min-h-screen flex flex-col max-w-screen overflow-x-hidden h-fit`}>
				<Providers>
					<Header />
					<main className='px-6 flex-grow'>{children}</main>
					<Footer />
				</Providers>
				<Toaster />
			</body>
		</html>
	);
}
