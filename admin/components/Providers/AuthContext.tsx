import {
	ReactNode,
	createContext,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { AuthStatus, User } from '@/lib/types';
import { request } from '@/lib/axios';
import queryClient from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface AuthContextProps {
	status: AuthStatus;
	user: User | undefined;
	logout: () => Promise<void>;
	login: (email: string, password: string) => Promise<boolean>;
	refetchUser(): Promise<void>;
}

const responseInterceptor = request.interceptors.response.use(
	async (config) => {
		if (config.headers['x-access-token']) {
			const value = localStorage.getItem('token');
			if (value) {
				const { refreshToken } = JSON.parse(value);

				localStorage.setItem(
					'token',
					JSON.stringify({
						accessToken: config.headers['x-access-token'],
						refreshToken,
					})
				);

				request.defaults.headers.Authorization =
					`Bearer ` + config.headers['x-access-token'];
				request.defaults.headers['x-refresh'] = refreshToken;
			} else {
				request.defaults.headers['Authorization'] = '';
				request.defaults.headers['x-refresh'] = '';
			}
		}
		if (config.status === 401) {
			localStorage.removeItem('token');
			request.defaults.headers['Authorization'] = '';
			request.defaults.headers['x-refresh'] = '';
			window.location.pathname = '/';
		}
		return config;
	},
	(error) => {
		return new Promise((_, reject) => {
			reject(error);
		});
	}
);

export const AuthContext = createContext<AuthContextProps>({
	status: 'unauthenticated',
	user: undefined,
	login: () => Promise.resolve(false),
	logout: () => Promise.resolve(),
	refetchUser: () => Promise.resolve(),
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [status, setStatus] = useState<AuthStatus>('loading');
	const [user, setUser] = useState<User>();
	const { toast } = useToast();
	const { push } = useRouter();

	async function login(email: string, password: string): Promise<boolean> {
		try {
			setStatus('loading');
			const res = await request.post(`/auth/login`, {
				email,
				password,
			});
			const { accessToken, refreshToken, user, onboarded } = res.data.data;
			localStorage.setItem(
				'token',
				JSON.stringify({ accessToken, refreshToken })
			);
			request.defaults.headers['Authorization'] = `Bearer ` + accessToken;
			request.defaults.headers['x-refresh'] = refreshToken;
			setUser(user);
			setStatus('authenticated');
			push('/');
			toast({
				title: 'Login Successful',
			});
			return onboarded;
		} catch (error) {
			setStatus('unauthenticated');
			toast({
				title: 'Login Failed',
				description: 'Please check your credentials and try again.',
			});
			return false;
		}
	}

	const logout = useCallback(async () => {
		setUser(undefined);
		setStatus('unauthenticated');
		await request.delete(`/auth/logout`);
		localStorage.removeItem('token');
		request.defaults.headers['Authorization'] = '';
		request.defaults.headers['x-refresh'] = '';
		queryClient.clear();
		await queryClient.invalidateQueries();
		await queryClient.refetchQueries();
	}, []);

	const fetchUser = useCallback(async () => {
		return request
			.get(`/auth/me`)
			.then((res) => {
				setUser(res.data.data);
				setStatus('authenticated');
			})
			.catch(async () => {
				await logout();
			});
	}, [logout]);

	useEffect(() => {
		(async () => {
			const value = localStorage.getItem('token');
			if (value) {
				const { accessToken, refreshToken } = JSON.parse(value);
				request.defaults.headers['Authorization'] = `Bearer ` + accessToken;
				request.defaults.headers['x-refresh'] = refreshToken;
				await fetchUser();
			} else {
				setStatus('unauthenticated');
			}
		})();
	}, [fetchUser]);

	useEffect(() => {
		return () => {
			request.interceptors.response.eject(responseInterceptor);
		};
	}, []);

	return (
		<AuthContext.Provider
			value={{
				status,
				logout,
				login,
				user,
				refetchUser: fetchUser,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
