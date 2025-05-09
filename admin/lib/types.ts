export interface PaginatedResponse<T> {
	pagination: { pageIndex: number; count: number; pageSize: number };
	data: T[];
}

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

export interface GearStats {
	Available: number;
	'Due Today': number;
	Leased: number;
	Overdue: number;
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
	firstName: string | null;
	lastName: string | null;
	phoneNumber: string | null;
	Role: {
		id: number;
		name: string;
	} | null;
}

export interface UserRole {
	id: number;
	name: string;
	gearDiscount: number;
	studioDiscount: number;
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
	slug: string;
	imageUrl: string | null;
	imagePlaceholder: string | null;
}

export interface NavLink {
	path: string;
	name: string;
}

export interface GearCheckout {
	id: number;
	pickupDate: string;
	returnDate: string;
	items: number[];
	createdAt: string;
	User: User;
}

export type GearLease = Gear & { GearCheckout: GearCheckout };

export interface StudioRequest {
	createdAt: string;
	endTime: string;
	gearItems: number[] | null;
	id: number;
	startTime: string;
	status: string;
	typeId: number;
	StudioType: StudioType;
	updatedAt: string;
	userId: number;
	User: User;
	cost: number;
}

export interface StudioType {
	id: number;
	name: string;
	description: string;
	pricing: number;
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

export interface Category {
	id: number;
	name: string;
}

export interface RestrictedDate {
	id: number;
	date: string;
}
