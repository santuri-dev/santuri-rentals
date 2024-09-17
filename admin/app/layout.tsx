import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';

export const metadata: Metadata = {
	title: 'Santuri Admin',
	description: 'Santuri Admin Dashboard',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`antialiased w-screen overflow-x-hidden h-fit`}>
				<Providers>
					<Header />
					<main>{children}</main>
				</Providers>
				<Toaster />
			</body>
		</html>
	);
}
