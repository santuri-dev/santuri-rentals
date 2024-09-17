import supabase from '@/db';
import { hashPassword } from '@/lib/auth';
import env from '@/lib/env';
import VerifyEmail from '@/emails/VerifyEmail';
import transporter from '@/lib/nodemailer';
import { render } from '@react-email/components';

type FetchUserBy =
	| { field: 'id'; value: number }
	| {
			field: 'email';
			value: string;
	  }
	| { field: 'username'; value: string };

export async function fetchUser({ field, value }: FetchUserBy) {
	try {
		const { data, error } = await supabase
			.from('User')
			.select('*')
			.eq(field, value);

		if (error) throw new Error(`${error.message} + ${error.code}`);
		if (!data) throw new Error(`Something went wrong: data=null`);

		return data[0];
	} catch (e: any) {
		throw new Error(`Error fetching user: ${e.message}`);
	}
}

export async function createUser({
	username,
	password,
	email,
}: {
	username: string;
	email: string;
	password: string;
}) {
	try {
		const verificationCode = crypto.randomUUID();
		const { data, error } = await supabase
			.from('User')
			.insert({
				username,
				password: await hashPassword(password),
				email,
				verificationCode,
			})
			.select('id, username, email, image');

		if (error) throw new Error(error.message);
		if (!data) throw new Error(`Something went wrong: data=null`);

		const verificationLink = `${env.SERVER_URL}/api/auth/verify/${data[0].id}/${verificationCode}`;

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

export async function verifyUser(userId: number, verificationCode: string) {
	try {
		const user = await fetchUser({ field: 'id', value: userId });

		if (!user.emailVerified && user.verificationCode) {
			if (user.verificationCode === verificationCode) {
				await supabase
					.from('User')
					.update({
						verificationCode: null,
						emailVerified: new Date().toISOString(),
					})
					.eq('id', user.id);

				return {
					success: true,
					message: 'User verification was successful',
					data: { email: user.email },
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
