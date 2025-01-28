import { validatePassword, verifyJwt } from '@/lib/auth';
import { requireUser } from '@/middleware/requireUser';
import { Elysia, t } from 'elysia';
import {
	createSession,
	invalidateSessions,
	requestResetToken,
	resetPassword,
	signAccessToken,
	signRefreshToken,
} from './auth.service';
import {
	createUser,
	createUserWithToken,
	fetchUser,
	verifyUser,
} from '../user/user.service';
import { DecodedInvite, LocalUser } from '@/lib/types';
import env from '@/lib/env';

const auth = (app: Elysia) =>
	app.group('/auth', (app) =>
		app
			.guard({ detail: { tags: ['Auth'] } })
			.post(
				'/reset-password-token',
				async ({ body, set }) => {
					try {
						return await requestResetToken(body.email);
					} catch (error: any) {
						set.status = 400;
						return { success: false, message: error.message };
					}
				},
				{
					body: t.Object({ email: t.String({ format: 'email' }) }),
				}
			)
			.post(
				'/reset-password',
				async ({ body, set }) => {
					try {
						return await resetPassword(body);
					} catch (error: any) {
						set.status = 400;
						return { success: false, message: error.message };
					}
				},
				{
					body: t.Object({ token: t.String(), password: t.String() }),
				}
			)
			.post(
				'/signup',
				async ({ body, set }) => {
					const { username, email, password, token } = body;
					if (email) {
						const emailExists = await fetchUser({
							field: 'email',
							value: email,
						});

						const usernameExists = await fetchUser({
							field: 'username',
							value: username,
						});

						if (emailExists) {
							set.status = 'Conflict';
							return {
								success: false,
								data: null,
								message: `${email} is already in use`,
							};
						}

						if (usernameExists) {
							set.status = 'Conflict';
							return {
								success: false,
								data: null,
								message: `${username} is already in use`,
							};
						}

						const user = await createUser({ username, password, email });
						return {
							success: true,
							message: 'Account created',
							data: {
								user,
							},
						};
					} else if (token) {
						const decoded = await verifyJwt<DecodedInvite>(token, 'INVITE');

						if (decoded) {
							const emailExists = await fetchUser({
								field: 'email',
								value: decoded.email,
							});

							const usernameExists = await fetchUser({
								field: 'username',
								value: username,
							});

							if (emailExists) {
								set.status = 'Conflict';
								return {
									success: false,
									data: null,
									message: `${email} is already in use`,
								};
							}

							if (usernameExists) {
								set.status = 'Conflict';
								return {
									success: false,
									data: null,
									message: `${username} is already in use`,
								};
							}

							const user = await createUserWithToken(
								{ username, password },
								token
							);
							return {
								success: true,
								message: 'Account created',
								data: {
									user,
								},
							};
						} else {
							return {
								success: false,
								message: 'Invalid token. Failed to create account.',
								data: null,
							};
						}
					}
				},
				{
					body: t.Object({
						username: t.String(),
						email: t.Optional(t.String({ format: 'email' })),
						password: t.String(),
						token: t.Optional(t.String()),
					}),
				}
			)
			.post(
				'/login',
				async ({ body, set, headers }) => {
					const { email, password } = body;

					const user = await fetchUser({
						field: 'email',
						value: email,
					});

					const match = await validatePassword(user.password, password);
					if (!match) {
						set.status = 400;
						return {
							success: false,
							data: null,
							message: 'Invalid credentials',
						};
					}

					if (!user.emailVerified) {
						set.status = 400;
						return {
							success: false,
							data: null,
							message: 'Email is not verified',
						};
					}

					const accessToken = await signAccessToken(
						{
							id: user.id,
							name: user.username,
							image: user.image ?? '',
							imgPlaceholder: user.imgPlaceholder ?? '',
							role: user.Role?.name ?? '',
						},
						{ expiresIn: env.ACCESS_TTL }
					);

					await invalidateSessions(user.id, headers['user-agent']!);
					const session = await createSession(user.id, headers['user-agent']!);

					if (!session)
						return { success: false, data: null, message: 'Failed to login' };

					const refreshToken = await signRefreshToken(
						{
							id: session.id,
							userId: user.id,
							userAgent: headers['user-agent']!,
						},
						{ expiresIn: env.REFRESH_TTL }
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
			.get(
				'/verify/:id/:verificationCode',
				async ({ params: { id, verificationCode }, redirect }) => {
					const res = await verifyUser(id, verificationCode);
					return redirect(
						`${env.CLIENT_URL}/auth/login?verified=${res.success}${
							res.data?.email ? `&email=${res.data?.email}` : ''
						}`
					);
				},
				{
					params: t.Object({ id: t.Numeric(), verificationCode: t.String() }),
				}
			)
			.use(requireUser)
			.delete('/logout', async ({ user, headers }) => {
				if (user) await invalidateSessions(user.id, headers['user-agent']!);
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

export default auth;
