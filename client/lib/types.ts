export interface Gear {
	id: number;
	name: string;
	serialNumber: string;
	condition: string;
	status: string;
	peripherals: string[];
	gearCheckoutId: number | null;
	notes: string | null;
	createdAt: string;
	updatedAt: string | null;
}

export type AuthStatus = 'unauthenticated' | 'authenticated' | 'loading';

export interface AuthState {
	accessToken: string | null;
	refreshToken: string | null;
	status: AuthStatus;
}

export interface User {
	id: number;
	name: string;
	username?: string;
	email?: string;
	image: string | null;
	createdAt: string | null;
	imgPlaceholder?: string;
}
