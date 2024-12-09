import supabase from '@/db';
import { DecodedRefresh, DecodedReset, LocalUser } from '@/lib/types';
import { hashPassword, signJwt, verifyJwt } from '@/lib/auth';
import { SignOptions } from 'jsonwebtoken';
import env from '@/lib/env';
import { fetchUser } from '../user/user.service';
import PasswordReset from '@/emails/PasswordReset';
import { render } from '@react-email/components';
import transporter from '@/lib/nodemailer';

export const createSession = async (userId: number, userAgent: string) => {
	try {
		const { data, error } = await supabase
			.from('Session')
			.insert({
				userId,
				userAgent,
				expires: new Date(
					new Date().getTime() + Number(env.REFRESH_TTL.replace('s', '')) * 1000
				).toISOString(),
			})
			.select();

		if (error) throw new Error(error.message);

		return data ? data[0] : null;
	} catch (e: any) {
		throw new Error(`Failed to create session: ${e.message}`);
	}
};

export const invalidateSessions = async (
	userId: number,
	userAgent: string
): Promise<void> => {
	try {
		await supabase
			.from('Session')
			.delete()
			.eq('userId', userId)
			.eq('userAgent', userAgent);
	} catch (e: any) {
		throw new Error(`Failed to invalidate sessions: ${e.message}`);
	}
};

export const refreshAccessToken = async ({
	id,
	userId,
	userAgent,
}: DecodedRefresh) => {
	try {
		const { data, error } = await supabase
			.from('Session')
			.select('*')
			.eq('id', id)
			.eq('userId', userId)
			.eq('userAgent', userAgent);

		if (error) throw new Error(error.message);
		if (!data[0]) throw new Error('Invalid session');

		const valid = new Date(data[0].expires).getTime() > new Date().getTime();

		if (!valid) throw new Error('Session expired');

		const { data: user, error: userError } = await supabase
			.from('User')
			.select('*, Role(*)')
			.eq('id', data[0].userId);

		if (!user || userError) {
			throw new Error('Something went wrong: ' + userError.message);
		}

		return user[0];
	} catch (e: any) {
		throw new Error(e.message);
	}
};

export const signAccessToken = async (
	{ id, name, image, role }: LocalUser,
	options?: SignOptions
): Promise<string> => {
	return await signJwt(
		{ id, name, image, role },
		{ ...(options && options) },
		'ACCESS'
	);
};

export const signRefreshToken = async (
	{ id, userAgent, userId }: { id: number; userId: number; userAgent: string },
	options: SignOptions
) => {
	return signJwt(
		{ id, userId, userAgent },
		{ ...(options && options) },
		'REFRESH'
	);
};

export const signResetToken = async (
	{ id }: DecodedReset,
	options: SignOptions
) => {
	return signJwt({ id }, { ...(options && options) }, 'RESET');
};

export const signInviteToken = async (email: string, options: SignOptions) => {
	return signJwt({ email }, { ...(options && options) }, 'INVITE');
};

export async function requestResetToken(email: string) {
	try {
		const user = await fetchUser({ field: 'email', value: email });
		const token = await signResetToken({ id: user.id }, { expiresIn: '1h' });

		const { error } = await supabase
			.from('User')
			.update({
				resetPasswordToken: token,
			})
			.eq('id', user.id);

		if (error) {
			throw new Error(
				`Failed to create password reset token: ${error.message}`
			);
		}

		const resetPasswordLink = `${env.CLIENT_URL}/auth/reset-password/${token}`;

		try {
			await transporter.sendMail({
				from: env.EMAIL_FROM,
				to: email,
				subject: 'Reset Your Password',
				html: await render(
					PasswordReset({ resetPasswordLink, userFirstname: user.username })
				),
			});
		} catch (error: any) {
			throw new Error(`Failed to send password reset email: ${error.message}`);
		}

		return {
			success: true,
			message: 'Please check your email for a password reset link',
		};
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export const resetPassword = async ({
	password,
	token,
}: {
	token: string;
	password: string;
}) => {
	try {
		const verified = await verifyJwt<DecodedReset>(token, 'RESET');
		if (!verified) {
			throw new Error('Token is invalid or expired ');
		}

		const user = await fetchUser({ field: 'id', value: verified.id });

		if (!user.resetPasswordToken) {
			throw new Error('Token is invalid or expired ');
		}

		const { error } = await supabase
			.from('User')
			.update({
				password: await hashPassword(password),
				resetPasswordToken: null,
			})
			.eq('id', user.id);

		if (error) {
			throw new Error(`Failed to reset password: ${error.message}`);
		}

		return { success: true, message: 'Successfully reset password' };
	} catch (err: any) {
		throw new Error(err.message);
	}
};
