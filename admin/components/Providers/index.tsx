'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './AuthContext';
import RequireAuth from './RequireAuth';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<RequireAuth>{children}</RequireAuth>
			</AuthProvider>
		</QueryClientProvider>
	);
}
