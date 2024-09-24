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
} from './admin_auth.service';
import { validatePassword, verifyJwt } from '@/lib/auth';
import { LocalUser } from '@/lib/types';
import { requireAdminUser } from '@/middleware/requireAdminUser';
import {
	addGearItem,
	deleteGearItem,
	editGearItem,
	getAllGearItems,
	getGearInventoryStats,
	getManyGearItems,
	getPendingGearRequests,
} from '../gear/gear.service';
import {
	GearInventoryItemSchema,
	GearInventoryItemStatus,
} from '../gear/gear.schema';
import {
	approveGearRequest,
	closeGearRequest,
	getAllLeases,
} from './admin_gear.service';

const admin = (app: Elysia) =>
	app.group('/admin', (app) =>
		app
			.guard({ detail: { tags: ['Admin'] } })
			.group('/auth', (app) =>
				app
					.guard({ detail: { tags: ['Admin Auth'] } })
					.get(
						'/verify/:id/:verificationCode',
						async ({ params: { id, verificationCode }, redirect }) => {
							const res = await verifyAdminUser(id, verificationCode);
							redirect(
								`${env.ADMIN_CLIENT_URL}/auth/login?verified=${res.success}`
							);
							return res;
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
							const { firstName, lastName, role, email, password } = body;

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
								firstName,
								lastName,
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
								firstName: t.String(),
								lastName: t.String(),
								role: t.String(),
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

							const match = await validatePassword(
								adminUser.password,
								password
							);
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
									name: adminUser.firstName,
									image: adminUser.image ?? '',
									imgPlaceholder: adminUser.image ?? '',
								},
								{ expiresIn: env.ACCESS_TTL }
							);

							await invalidateAdminSessions(
								adminUser.id,
								headers['user-agent']!
							);
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
			)
			.use(requireAdminUser)
			.group('/gear', (app) =>
				app
					.guard({ detail: { tags: ['Admin Gear'] } })
					.get('/stats', async ({ set }) => {
						try {
							const stats = await getGearInventoryStats();
							return { success: true, data: stats };
						} catch (error: any) {
							set.status = 500;
							return { success: false, message: error.message };
						}
					})
					.get('', async ({ set }) => {
						try {
							const items = await getAllGearItems();
							return { success: true, data: items };
						} catch (error: any) {
							set.status = 500;
							return { success: false, message: error.message };
						}
					})
					.post(
						'/bulk',
						async ({ set, body: { ids, status } }) => {
							try {
								const items = await getManyGearItems(ids, status);
								return { success: true, data: items };
							} catch (error: any) {
								set.status = 500;
								return { success: false, message: error.message };
							}
						},
						{
							body: t.Object({
								ids: t.Array(t.Number()),
								status: t.Optional(GearInventoryItemStatus),
							}),
						}
					)
					.post(
						'/add',
						async ({ body, set }) => {
							try {
								const newItem = await addGearItem(body);
								return { success: true, message: newItem.message };
							} catch (error: any) {
								set.status = 400;
								return { success: false, message: error.message };
							}
						},
						{
							body: GearInventoryItemSchema,
						}
					)
					.put(
						'/edit/:id',
						async ({ params: { id }, body, set }) => {
							try {
								const updatedItem = await editGearItem({
									id,
									data: body,
								});
								return { success: true, message: updatedItem.message };
							} catch (error: any) {
								set.status = 400;
								return { success: false, message: error.message };
							}
						},
						{
							params: t.Object({ id: t.String() }),
							body: GearInventoryItemSchema,
						}
					)
					.delete(
						'/delete/:id',
						async ({ params: { id }, set }) => {
							try {
								const result = await deleteGearItem(id);
								return { success: true, message: result.message };
							} catch (error: any) {
								set.status = 500;
								return { success: false, message: error.message };
							}
						},
						{
							params: t.Object({ id: t.String() }),
						}
					)
					.group('/requests', (app) =>
						app
							.get('', async ({ set }) => {
								try {
									const data = await getPendingGearRequests();
									return { success: true, data };
								} catch (error: any) {
									set.status = 500;
									return { success: false, message: error.message };
								}
							})
							.post(
								'/approve',
								async ({ body: { checkoutId, items }, set, user }) => {
									try {
										const message = await approveGearRequest(
											checkoutId,
											items,
											user.id
										);
										return { message, success: true };
									} catch (error: any) {
										set.status = 500;
										return { success: false, message: error.message };
									}
								},
								{
									body: t.Object({
										checkoutId: t.Number(),
										items: t.Array(t.Number()),
									}),
								}
							)
							.post(
								'/close',
								async ({ body: { id }, set, user }) => {
									try {
										const message = await closeGearRequest(id, user.id);
										return { message, success: true };
									} catch (error: any) {
										set.status = 500;
										return { success: false, message: error.message };
									}
								},
								{
									body: t.Object({
										id: t.Number(),
									}),
								}
							)
					)
					.group('/leases', (app) =>
						app.get('', async ({ set }) => {
							try {
								const leases = await getAllLeases();
								return { success: true, data: leases };
							} catch (error: any) {
								set.status = 500;
								return { success: false, message: error.message };
							}
						})
					)
			)
	);

export default admin;
