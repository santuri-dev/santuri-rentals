export interface LocalUser {
	id: number;
	name: string;
	image: string;
	imgPlaceholder: string;
}

export interface DecodedRefresh {
	id: number;
	userId: number;
	userAgent: string;
}

export interface DecodedReset {
	id: number;
}

export interface AdminDecodedRefresh {
	id: number;
	adminUserId: number;
	userAgent: string;
}
