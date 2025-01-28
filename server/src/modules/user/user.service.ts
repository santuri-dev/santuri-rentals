import supabase from '@/db';
import { hashPassword, verifyJwt } from '@/lib/auth';
import env from '@/lib/env';
import VerifyEmail from '@/emails/VerifyEmail';
import transporter from '@/lib/nodemailer';
import { render } from '@react-email/components';
import { DecodedInvite } from '@/lib/types';

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
			.select('*, Role(*)')
			.eq(field, value);

		if (error) throw new Error(`${error.message} + ${error.code}`);
		if (!data) throw new Error(`Something went wrong: data=null`);

		return data[0];
	} catch (e: any) {
		throw new Error(`Error fetching user: ${e.message}`);
	}
}

interface CreateUserInput {
	username: string;
	email: string;
	password: string;
	roleId?: number;
}

async function saveAndVerifyUser({
	username,
	password,
	email,
	roleId,
}: CreateUserInput) {
	const verificationCode = crypto.randomUUID();
	const { data, error } = await supabase
		.from('User')
		.insert({
			username,
			password: await hashPassword(password),
			email,
			verificationCode,
			roleId,
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
}

export async function createUser(input: CreateUserInput) {
	try {
		return await saveAndVerifyUser(input);
	} catch (e: any) {
		throw new Error(`Error creating user: ${e.message}`);
	}
}

export async function createUserWithToken(
	input: Omit<CreateUserInput, 'email'>,
	inviteToken: string
) {
	try {
		const decoded = await verifyJwt<DecodedInvite>(inviteToken, 'INVITE');
		if (decoded) {
			const { data, error } = await supabase
				.from('UserInvite')
				.select('*')
				.eq('email', decoded.email)
				.single();

			if (error) throw new Error(error.message);
			if (!data) throw new Error(`Something went wrong: data=null`);

			await supabase.from('UserInvite').delete().eq('token', inviteToken);

			return await saveAndVerifyUser({
				...input,
				email: data.email,
				roleId: data.roleId,
			});
		} else {
			throw new Error('Failed to decode invite token');
		}
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
