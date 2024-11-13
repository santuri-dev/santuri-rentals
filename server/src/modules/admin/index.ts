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
import { getAllCourses } from '../shop/shop.service';
import { CourseSchema, ProductSchema } from '../shop/shop.schema';
import {
	addCourse,
	addProduct,
	createProductCategory,
	deleteCourse,
	deleteProduct,
	deleteProductCategory,
	editCourse,
	editProduct,
	getAllProductsAdmin,
	getCourse,
	getProduct,
	getProductCategories,
	uploadCourseFiles,
	uploadProductFiles,
} from './admin_shop.service';
import {
	approveStudioRequest,
	createStudioType,
	deleteStudioType,
	editStudioType,
	getAdminStudioRequests,
	getStudioTypesAdmin,
} from './admin_studio.service';
import { StudioTypeSchema } from '../studio/studio.schema';
import {
	createUserRole,
	deleteUserRole,
	getUserRoles,
	getUsers,
	updateUserRole,
} from './admin_user.service';

const UserRoleSchema = t.Object({
	name: t.String(),
	gearDiscount: t.Number(),
	studioDiscount: t.Number(),
});

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
									name: adminUser.username,
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
			.group('/courses', (app) =>
				app
					.guard({ detail: { tags: ['Admin Courses'] } })
					.get('', async ({ set }) => {
						try {
							const data = await getAllCourses();
							return { success: true, data };
						} catch (error: any) {
							set.status = 500;
							return { success: false, message: error.message };
						}
					})
					.post(
						'',
						async ({ body, set }) => {
							try {
								const result = await addCourse(body);
								return {
									success: true,
									message: result.message,
								};
							} catch (error: any) {
								set.status = 400;
								return {
									success: false,
									message: error.message,
								};
							}
						},
						{
							body: CourseSchema,
						}
					)
					.get(
						'/:slug',
						async ({ set, params: { slug } }) => {
							try {
								const data = await getCourse(slug);
								return {
									success: true,
									data,
								};
							} catch (error: any) {
								set.status = 400;
								return {
									success: false,
									message: error.message,
								};
							}
						},
						{
							params: t.Object({ slug: t.String() }),
						}
					)
					.put(
						'/edit/:id',
						async ({ body, set, params: { id } }) => {
							try {
								const result = await editCourse(id, body);
								return {
									success: true,
									message: result.message,
								};
							} catch (error: any) {
								set.status = 400;
								return {
									success: false,
									message: error.message,
								};
							}
						},
						{
							body: CourseSchema,
							params: t.Object({ id: t.String() }),
						}
					)
					.delete(
						'/delete/:id',
						async ({ params: { id }, set }) => {
							try {
								const result = await deleteCourse(id);
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
					.post(
						'/:id/cover',
						async ({ body: { cover }, set, params: { id } }) => {
							try {
								const res = await uploadCourseFiles({
									id,
									cover,
								});
								return {
									success: true,
									...res,
								};
							} catch (error: any) {
								set.status = 400;
								return { success: false, message: error.message, data: null };
							}
						},
						{
							body: t.Object({
								cover: t.File({
									type: ['image/png', 'image/jpeg', 'image/webp'],
								}),
							}),
							params: t.Object({ id: t.Numeric() }),
						}
					)
			)
			.group('/studio', (app) =>
				app
					.guard({ detail: { tags: ['Admin Studio'] } })
					.post('/approve/:id', async ({ set, params: { id } }) => {
						try {
							const data = await approveStudioRequest(parseInt(id));
							return {
								success: true,
								message: 'Studio request created successfully',
								data,
							};
						} catch (error: any) {
							set.status = 400;
							return {
								success: false,
								message: error.message,
								data: null,
							};
						}
					})
					.get('/requests', async ({ set }) => {
						try {
							const data = await getAdminStudioRequests();
							return {
								success: true,
								message: 'Studio requests fetched successfully',
								data,
							};
						} catch (error: any) {
							set.status = 400;
							return {
								success: false,
								message: error.message,
								data: null,
							};
						}
					})
					.group('/types', (app) =>
						app
							.get('', async ({ set }) => {
								try {
									const data = await getStudioTypesAdmin();
									return {
										success: true,
										message: 'Successfully fetched studio types',
										data,
									};
								} catch (error: any) {
									set.status = 400;
									return {
										success: false,
										message: error.message,
										data: null,
									};
								}
							})
							.post(
								'',
								async ({ set, body }) => {
									try {
										const data = await createStudioType(body);
										return {
											success: true,
											message: 'Successfully created studio type',
											data,
										};
									} catch (error: any) {
										set.status = 400;
										return {
											success: false,
											message: error.message,
											data: null,
										};
									}
								},
								{
									body: StudioTypeSchema,
								}
							)
							.put(
								'/:id',
								async ({ set, body, params: { id } }) => {
									try {
										const data = await editStudioType({ id, ...body });
										return {
											success: true,
											message: 'Successfully edited studio type',
											data,
										};
									} catch (error: any) {
										set.status = 400;
										return {
											success: false,
											message: error.message,
											data: null,
										};
									}
								},
								{
									body: StudioTypeSchema,
									params: t.Object({ id: t.Numeric() }),
								}
							)
							.delete(
								'/:id',
								async ({ set, params: { id } }) => {
									try {
										await deleteStudioType(id);
										return {
											success: true,
											message: 'Successfully deleted studio type',
										};
									} catch (error: any) {
										set.status = 400;
										return {
											success: false,
											message: error.message,
											data: null,
										};
									}
								},
								{
									params: t.Object({ id: t.Numeric() }),
								}
							)
					)
			)
			.group('/products', (app) =>
				app
					.guard({ detail: { tags: ['Admin Products'] } })
					.get('', async ({ set }) => {
						try {
							const courses = await getAllProductsAdmin();
							return {
								success: true,
								message: 'Products fetched successfully',
								data: courses,
							};
						} catch (error: any) {
							set.status = 400;
							return {
								success: false,
								message: error.message,
								data: null,
							};
						}
					})
					.post(
						'',
						async ({ set, body }) => {
							try {
								const result = await addProduct(body);
								return {
									success: true,
									message: result.message,
								};
							} catch (error: any) {
								set.status = 400;
								return {
									success: false,
									message: error.message,
								};
							}
						},
						{ body: ProductSchema }
					)
					.get(
						'/:slug',
						async ({ set, params: { slug } }) => {
							try {
								const data = await getProduct(slug);
								return {
									success: true,
									data,
								};
							} catch (error: any) {
								set.status = 400;
								return {
									success: false,
									message: error.message,
								};
							}
						},
						{
							params: t.Object({ slug: t.String() }),
						}
					)
					.put(
						'/:id',
						async ({ body, set, params: { id } }) => {
							try {
								const result = await editProduct(id, body);
								return {
									success: true,
									message: result.message,
								};
							} catch (error: any) {
								set.status = 400;
								return {
									success: false,
									message: error.message,
								};
							}
						},
						{
							body: ProductSchema,
							params: t.Object({ id: t.String() }),
						}
					)
					.delete(
						'/:id',
						async ({ params: { id }, set }) => {
							try {
								const result = await deleteProduct(id);
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
					.group('/categories', (app) =>
						app
							.get('', async ({ set }) => {
								try {
									const data = await getProductCategories();
									return {
										message: 'Successfully fetch product categories',
										success: true,
										data,
									};
								} catch (error: any) {
									return { success: false, message: error.message, data: null };
								}
							})
							.post(
								'',
								async ({ body }) => {
									try {
										const { message } = await createProductCategory(body);
										return {
											message,
											success: true,
										};
									} catch (error: any) {
										return {
											success: false,
											message: error.message,
											data: null,
										};
									}
								},
								{ body: t.Object({ name: t.String() }) }
							)
							.delete(
								'/:id',
								async ({ params }) => {
									try {
										const { message } = await deleteProductCategory(params.id);
										return {
											message,
											success: true,
										};
									} catch (error: any) {
										return {
											success: false,
											message: error.message,
											data: null,
										};
									}
								},
								{ params: t.Object({ id: t.Number() }) }
							)
					)
					.post(
						'/:id/cover',
						async ({ body: { cover }, set, params: { id } }) => {
							try {
								const res = await uploadProductFiles({
									id,
									cover,
								});
								return {
									success: true,
									...res,
								};
							} catch (error: any) {
								set.status = 400;
								return { success: false, message: error.message, data: null };
							}
						},
						{
							body: t.Object({
								cover: t.File({
									type: ['image/png', 'image/jpeg', 'image/webp'],
								}),
							}),
							params: t.Object({ id: t.Numeric() }),
						}
					)
			)
			.group('/users', (app) =>
				app
					.guard({ detail: { tags: ['User Management'] } })
					.get('', async ({ set }) => {
						try {
							const users = await getUsers();
							return {
								success: true,
								data: users,
								message: 'Successfully fetch users',
							};
						} catch (error: any) {
							set.status = 400;
							return {
								success: false,
								data: null,
								message: 'Failed to fetch users: ' + error.message,
							};
						}
					})
					.get('/roles', async ({ set }) => {
						try {
							const roles = await getUserRoles();
							return {
								success: true,
								data: roles,
								message: 'Successfully fetch user roles',
							};
						} catch (error: any) {
							set.status = 400;
							return {
								success: false,
								data: null,
								message: 'Failed to fetch user roles: ' + error.message,
							};
						}
					})
					.post(
						'/roles',
						async ({ body, set }) => {
							try {
								const data = await createUserRole(body);

								return {
									success: true,
									data,
									message: 'Successfully created user role',
								};
							} catch (error: any) {
								set.status = 400;
								return {
									success: false,
									data: null,
									message: 'Failed to create user role: ' + error.message,
								};
							}
						},
						{
							body: UserRoleSchema,
						}
					)
					.put(
						'/roles/:id',
						async ({ body, set, params: { id } }) => {
							try {
								const data = await updateUserRole(id, body);

								return {
									success: true,
									data,
									message: 'Successfully updated user role',
								};
							} catch (error: any) {
								set.status = 400;
								return {
									success: false,
									data: null,
									message: 'Failed to update user role: ' + error.message,
								};
							}
						},
						{
							body: UserRoleSchema,
							params: t.Object({ id: t.Numeric() }),
						}
					)
					.delete(
						'/roles/:id',
						async ({ set, params: { id } }) => {
							try {
								const data = await deleteUserRole(id);

								return {
									success: true,
									data,
									message: 'Successfully deleted user role',
								};
							} catch (error: any) {
								set.status = 400;
								return {
									success: false,
									data: null,
									message: 'Failed to delete user role: ' + error.message,
								};
							}
						},
						{
							params: t.Object({ id: t.Numeric() }),
						}
					)
			)
	);

export default admin;
