import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';
import Footer from '@/components/Footer';
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-inter',
});

const roboto_mono = Roboto_Mono({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-roboto-mono',
});

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
		<html lang='en' className={`${inter.variable} ${roboto_mono.variable}`}>
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
