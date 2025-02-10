import { Elysia, t } from 'elysia';
import { paginationQuerySchema } from '@/lib/pagination';
import {
	createUserRole,
	deleteUserRole,
	getUserRoles,
	getUsers,
	inviteUsers,
	updateUserRole,
} from '../users/service';

const UserRoleSchema = t.Object({
	name: t.String(),
	gearDiscount: t.Number(),
	studioDiscount: t.Number(),
});

export const userRoutes = (app: Elysia) =>
	app.group('/users', (app) =>
		app
			.guard({ detail: { tags: ['Admin User Management'] } })
			.get(
				'',
				async ({ set, query }) => {
					try {
						const data = await getUsers(query);
						return {
							success: true,
							...data,
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
				},
				{ query: paginationQuerySchema }
			)
			.get(
				'/roles',
				async ({ set, query }) => {
					try {
						const data = await getUserRoles(query);
						return {
							success: true,
							...data,
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
				},
				{ query: paginationQuerySchema }
			)
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
			.post(
				'/invites',
				async ({ set, body }) => {
					try {
						return await inviteUsers(body);
					} catch (error: any) {
						set.status = 400;
						return {
							success: false,
							data: null,
							message: error.message,
						};
					}
				},
				{
					body: t.Object({
						roleId: t.Number(),
						emails: t.Array(t.String({ format: 'email' })),
					}),
				}
			)
	);
