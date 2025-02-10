import supabase from '@/db';
import VerifyEmail from '@/emails/VerifyEmail';
import { hashPassword, signJwt } from '@/lib/auth';
import env from '@/lib/env';
import transporter from '@/lib/nodemailer';
import { AdminDecodedRefresh, LocalUser } from '@/lib/types';
import { render } from '@react-email/components';
import { SignOptions } from 'jsonwebtoken';

type FetchUserBy =
	| { field: 'id'; value: number }
	| {
			field: 'email';
			value: string;
	  };

export async function fetchAdminUser({ field, value }: FetchUserBy) {
	try {
		const { data, error } = await supabase
			.from('AdminUser')
			.select('*')
			.eq(field, value);

		if (error) throw new Error(`${error.message} + ${error.code}`);
		if (!data) throw new Error(`Something went wrong: data=null`);

		return data[0];
	} catch (e: any) {
		throw new Error(`Error fetching user: ${e.message}`);
	}
}

export async function createAdminUser({
	username,
	password,
	email,
	role,
}: {
	username: string;
	email: string;
	password: string;
	role: string;
}) {
	try {
		const verificationCode = crypto.randomUUID();
		const { data, error } = await supabase
			.from('AdminUser')
			.insert({
				username,
				password: await hashPassword(password),
				email,
				verificationCode,
				role,
			})
			.select('*');

		if (error) throw new Error(error.message);
		if (!data) throw new Error(`Something went wrong: data=null`);

		const verificationLink = `${env.SERVER_URL}/api/admin/auth/verify/${data[0].id}/${verificationCode}`;

		try {
			await transporter.sendMail({
				from: env.EMAIL_FROM,
				to: email,
				subject: 'Verify Your Account',
				html: await render(VerifyEmail({ verificationLink })),
			});
		} catch (error: any) {
			throw new Error(`Failed to send verification email: ${error.message}`);
		}

		return data[0];
	} catch (e: any) {
		throw new Error(`Error creating user: ${e.message}`);
	}
}

export async function verifyAdminUser(
	userId: number,
	verificationCode: string
) {
	try {
		const user = await fetchAdminUser({ field: 'id', value: userId });

		if (!user.emailVerified && user.verificationCode) {
			if (user.verificationCode === verificationCode) {
				await supabase
					.from('AdminUser')
					.update({
						verificationCode: null,
						emailVerified: new Date().toISOString(),
					})
					.eq('id', user.id);

				return {
					success: true,
					message: 'User verification was successful',
					data: null,
				};
			}

			return {
				success: true,
				message: 'User is already verified.',
				data: null,
			};
		}

		return {
			success: false,
			message: 'Something went wrong while verifying user',
			data: null,
		};
	} catch (e: any) {
		throw new Error(`Error verifying user: ${e.message}`);
	}
}

export const invalidateAdminSessions = async (
	adminUserId: number,
	userAgent: string
): Promise<void> => {
	try {
		await supabase
			.from('AdminSession')
			.delete()
			.eq('adminUserId', adminUserId)
			.eq('userAgent', userAgent);
	} catch (e: any) {
		throw new Error(`Failed to invalidate sessions: ${e.message}`);
	}
};

export const createAdminSession = async (
	adminUserId: number,
	userAgent: string
) => {
	try {
		const { data, error } = await supabase
			.from('AdminSession')
			.insert({
				adminUserId,
				userAgent,
				expires: new Date(
					new Date().getTime() +
						Number(String(env.REFRESH_TTL!).replace('s', '')) * 1000
				).toISOString(),
			})
			.select();

		if (error) throw new Error(error.message);

		return data ? data[0] : null;
	} catch (e: any) {
		throw new Error(`Failed to create session: ${e.message}`);
	}
};

export const refreshAdminAccessToken = async ({
	id,
	adminUserId,
	userAgent,
}: AdminDecodedRefresh) => {
	try {
		const { data, error } = await supabase
			.from('AdminSession')
			.select('*')
			.eq('id', id)
			.eq('adminUserId', adminUserId)
			.eq('userAgent', userAgent);

		if (error) throw new Error(error.message);
		if (!data[0]) throw new Error('Invalid session');

		const valid = new Date(data[0].expires).getTime() > new Date().getTime();

		if (!valid) throw new Error('Session expired');

		const { data: user, error: userError } = await supabase
			.from('AdminUser')
			.select('*')
			.eq('id', data[0].adminUserId);

		if (!user || userError) {
			throw new Error('Something went wrong: ' + userError.message);
		}

		return user[0];
	} catch (e: any) {
		throw new Error(e.message);
	}
};

export const signAdminAccessToken = async (
	{ id, name, image }: LocalUser,
	options?: SignOptions
): Promise<string> => {
	return await signJwt(
		{ id, name, image },
		{ ...(options && options) },
		'ACCESS'
	);
};

export const signAdminRefreshToken = async (
	{
		id,
		userAgent,
		adminUserId,
	}: { id: number; adminUserId: number; userAgent: string },
	options: SignOptions
) => {
	return signJwt(
		{ id, adminUserId, userAgent },
		{ ...(options && options) },
		'REFRESH'
	);
};
