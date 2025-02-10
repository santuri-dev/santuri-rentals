import { Elysia, t } from 'elysia';
import env from '@/lib/env';
import {
	createAdminSession,
	createAdminUser,
	fetchAdminUser,
	invalidateAdminSessions,
	signAdminAccessToken,
	signAdminRefreshToken,
	verifyAdminUser,
} from './service';
import { validatePassword, verifyJwt } from '@/lib/auth';
import { LocalUser } from '@/lib/types';
import { requireAdminUser } from '@/middleware/requireAdminUser';

export const authRoutes = (app: Elysia) =>
	app.group('/auth', (app) =>
		app
			.guard({ detail: { tags: ['Admin Auth'] } })
			.get(
				'/verify/:id/:verificationCode',
				async ({ params: { id, verificationCode }, redirect }) => {
					const res = await verifyAdminUser(id, verificationCode);
					return redirect(
						`${env.ADMIN_CLIENT_URL}/auth/login?verified=${res.success}`
					);
				},
				{
					params: t.Object({
						id: t.Numeric(),
						verificationCode: t.String(),
					}),
				}
			)
			.post(
				'/signup',
				async ({ body, set }) => {
					const { username, role, email, password } = body;

					const exists = await fetchAdminUser({
						field: 'email',
						value: email,
					});

					if (exists) {
						set.status = 400;
						return {
							success: false,
							data: null,
							message: 'Email address already in use.',
						};
					}

					const user = await createAdminUser({
						username,
						password,
						email,
						role,
					});

					return {
						success: true,
						message: 'Account created',
						data: {
							user,
						},
					};
				},
				{
					body: t.Object({
						username: t.String(),
						role: t.String({ default: 'admin' }),
						email: t.String({ format: 'email' }),
						password: t.String(),
					}),
				}
			)
			.post(
				'/login',
				async ({ body, set, headers }) => {
					const { email, password } = body;

					const adminUser = await fetchAdminUser({
						field: 'email',
						value: email,
					});

					const match = await validatePassword(adminUser.password, password);
					if (!match) {
						set.status = 400;
						return {
							success: false,
							data: null,
							message: 'Invalid credentials',
						};
					}

					if (!adminUser.emailVerified) {
						set.status = 400;
						return {
							success: false,
							data: null,
							message: 'Email is not verified',
						};
					}

					const accessToken = await signAdminAccessToken(
						{
							id: adminUser.id,
							name: adminUser.username,
							image: adminUser.image ?? '',
							imgPlaceholder: adminUser.image ?? '',
							role: adminUser.role,
						},
						{ expiresIn: env.ACCESS_TTL }
					);

					await invalidateAdminSessions(adminUser.id, headers['user-agent']!);
					const session = await createAdminSession(
						adminUser.id,
						headers['user-agent']!
					);

					if (!session)
						return {
							success: false,
							data: null,
							message: 'Failed to login',
						};

					const refreshToken = await signAdminRefreshToken(
						{
							id: session.id,
							adminUserId: adminUser.id,
							userAgent: headers['user-agent']!,
						},
						{ expiresIn: String(env.REFRESH_TTL) }
					);

					const newuser = await verifyJwt<LocalUser>(accessToken, 'ACCESS');
					// @ts-ignore
					delete newuser?.iat;
					// @ts-ignore
					delete newuser?.exp;
					return {
						success: true,
						data: {
							accessToken,
							refreshToken,
							user: newuser,
						},
						message: 'Login successful',
					};
				},
				{
					body: t.Object({
						email: t.String({ format: 'email' }),
						password: t.String({ minLength: 6 }),
					}),
				}
			)
			.use(requireAdminUser)
			.delete('/logout', async ({ user, headers }) => {
				if (user)
					await invalidateAdminSessions(user.id, headers['user-agent']!);
				return {
					success: true,
					data: null,
					message: 'Logout successful',
				};
			})
			.get('/me', ({ user, set }) => {
				if (!user) {
					set.status = 401;
					return {
						success: false,
						message: 'Unauthorized',
						data: null,
					};
				}

				return {
					success: true,
					message: 'Successfully fetched user details',
					data: user,
				};
			})
	);
