export interface LocalUser {
	id: number;
	name: string;
	image: string;
	imgPlaceholder: string;
	role?: string;
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

interface ErrorDetail {
	code: string;
	detail: string;
	attr: string | null;
}

/**
 * Description placeholder
 *
 * @type {ErrorResponse}
 * @example 
	type: 'client_error',
	errors: [
		{
			code: 'authentication_failed',
			detail: 'Invalid api token',
			attr: null,
		},
	],
 */

export interface ErrorResponse {
	type: string;
	errors: ErrorDetail[];
}
