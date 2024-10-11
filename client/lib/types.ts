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

export interface Course {
	applicationDeadline: string;
	cost: number;
	createdAt: string;
	description: string;
	endDate: string;
	id: number;
	location: string;
	name: string;
	startDate: string;
	updatedAt: string;
}

export interface NavLink {
	path: string;
	name: string;
}

export interface Product {
	categoryId: number | null;
	createdAt: string;
	currency: string;
	description: string;
	id: number;
	imageUrl: string | null;
	imagePlaceholder: string | null;
	name: string;
	price: number;
	slug: string;
	status: string;
	stock: number;
	Category: {
		id: number;
		name: string;
	} | null;
}
