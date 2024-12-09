import supabase from '@/db';
import { getPagination, PaginationState } from '@/lib/pagination';
import { signInviteToken } from '../auth/auth.service';
import env from '@/lib/env';
import transporter from '@/lib/nodemailer';
import { render } from '@react-email/components';
import UserInvite from '@/emails/UserInvite';

export async function getUsers(pagination: PaginationState) {
	const { from, to, pageIndex, pageSize } = getPagination(pagination);

	try {
		const { data, error, count } = await supabase
			.from('User')
			.select(
				'id, username, firstName, lastName, email, phoneNumber, createdAt, Role(id, name)',
				{ count: 'exact' }
			)
			.order('id')
			.range(from, to);

		if (error) throw new Error(`${error.message} + ${error.code}`);

		return { data, pagination: { pageIndex, pageSize, count } };
	} catch (e: any) {
		throw new Error(`Error fetching users: ${e.message}`);
	}
}

export async function getUserRoles(pagination: PaginationState) {
	try {
		const { from, to, pageIndex, pageSize } = getPagination(pagination);
		const { data, error, count } = await supabase
			.from('Role')
			.select('*')
			.order('id')
			.range(from, to);

		if (error) throw new Error(`${error.message} + ${error.code}`);

		return { data, pagination: { pageIndex, pageSize, count } };
	} catch (e: any) {
		throw new Error(`Error fetching users: ${e.message}`);
	}
}

export async function createUserRole(input: {
	name: string;
	gearDiscount: number;
	studioDiscount: number;
}) {
	try {
		const { data, error } = await supabase
			.from('Role')
			.insert(input)
			.select('*')
			.single();

		if (error) throw new Error(`${error.message} + ${error.code}`);

		return data;
	} catch (e: any) {
		throw new Error(`Error creating user role: ${e.message}`);
	}
}

export async function updateUserRole(
	id: number,
	input: {
		name: string;
		gearDiscount: number;
		studioDiscount: number;
	}
) {
	try {
		const { data, error } = await supabase
			.from('Role')
			.update(input)
			.eq('id', id)
			.select('*')
			.single();

		if (error) throw new Error(`${error.message} + ${error.code}`);

		return data;
	} catch (e: any) {
		throw new Error(`Error updating user role: ${e.message}`);
	}
}

export async function deleteUserRole(id: number) {
	try {
		const { data, error } = await supabase
			.from('Role')
			.delete()
			.eq('id', id)
			.select('*')
			.single();

		if (error) throw new Error(`${error.message} + ${error.code}`);

		return data;
	} catch (e: any) {
		throw new Error(`Error deleting user role: ${e.message}`);
	}
}

export async function inviteUsers({
	emails,
	roleId,
}: {
	roleId: number;
	emails: string[];
}) {
	try {
		const set = new Set<string>();

		const input = await Promise.all(
			emails.map(async (email) => {
				const { data } = await supabase
					.from('User')
					.select('*')
					.eq('email', email)
					.single();

				if (data) return;
				if (set.has(email)) return;

				set.add(email);

				const token = await signInviteToken(email, { expiresIn: '48h' });
				return {
					email,
					roleId,
					token,
				};
			})
		);

		const { data, error } = await supabase
			.from('UserInvite')
			.insert(input.filter((v) => v !== undefined))
			.select('*, Role(*)');

		if (error) {
			throw new Error(error.message);
		}

		await Promise.all(
			data.map(async ({ token, email, Role }) => {
				const inviteLink = `${env.CLIENT_URL}/auth/signup?token=${token}`;

				await transporter.sendMail({
					from: env.EMAIL_FROM,
					to: email,
					subject: 'Signup to Santuri',
					html: await render(
						UserInvite({ email, inviteLink, role: Role?.name ?? '' })
					),
				});
			})
		);

		return {
			success: true,
			message: 'Successfully created user invites',
			data,
		};
	} catch (e: any) {
		throw new Error(`Error inviting users: ${e.message}`);
	}
}
