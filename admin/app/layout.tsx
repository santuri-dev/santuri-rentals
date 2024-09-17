import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';
import RequireAuth from '@/components/RequireAuth';

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
			<body className={`antialiased max-w-screen overflow-x-hidden h-fit`}>
				<Providers>
					<RequireAuth>
						<main>{children}</main>
					</RequireAuth>
				</Providers>
				<Toaster />
			</body>
		</html>
	);
}
