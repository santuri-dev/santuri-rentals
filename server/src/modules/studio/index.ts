import { Elysia, t } from 'elysia';
import {
	createStudioRequest,
	getRestrictedStudioDates,
	getStudioRequests,
	getStudioTypes,
	getUserDiscounts,
	getUserStudioRequest,
	getUserStudioRequests,
} from './studio.service';
import { StudioRequestSchema } from './studio.schema';
import { requireUser } from '@/middleware/requireUser';
import { paginationQuerySchema } from '@/lib/pagination';

const studio = (app: Elysia) =>
	app.group('/studio', (app) =>
		app
			.guard({ detail: { tags: ['Studio'] } })
			.post(
				'/requests',
				async ({ set, body }) => {
					try {
						const data = await getStudioRequests(body);
						return { success: true, data };
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
					body: t.Object({
						date: t.String({ format: 'date-time' }),
						status: t.String(),
					}),
				}
			)
			.get('/types', async ({ set }) => {
				try {
					const data = await getStudioTypes();
					return { success: true, data };
				} catch (error: any) {
					set.status = 400;
					return {
						success: false,
						message: error.message,
						data: null,
					};
				}
			})
			.get('/restricted-dates', async ({ set }) => {
				try {
					const data = await getRestrictedStudioDates();
					return {
						success: true,
						message: 'Succesfully fetched restricted dates',
						data,
					};
				} catch (error: any) {
					set.status = 400;
					return { success: false, message: error.message, data: null };
				}
			})
			.use(requireUser)
			.get(
				'/discounts',
				async ({ query: { role }, set }) => {
					try {
						return await getUserDiscounts(role);
					} catch (error: any) {
						set.status = 400;
						return {
							success: false,
							message: error.message,
							data: null,
						};
					}
				},
				{ query: t.Object({ role: t.String() }) }
			)
			.post(
				'',
				async ({ set, body, user }) => {
					try {
						const res = await createStudioRequest(body, user.id);
						return {
							success: true,
							...res,
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
					body: t.Intersect([
						StudioRequestSchema,
						t.Object({ gearItems: t.Array(t.Number()) }),
					]),
				}
			)
			.get(
				'/requests',
				async ({ set, user, query }) => {
					try {
						const data = await getUserStudioRequests(user.id, query);
						return {
							message: 'Successfully fetched studio requests',
							success: true,
							...data,
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
				{ query: paginationQuerySchema }
			)
			.get(
				'/requests/:id',
				async ({ set, user, params }) => {
					try {
						const data = await getUserStudioRequest(user.id, params.id);
						return {
							success: true,
							data,
							message: 'Successfully fetched studio request',
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
				{ params: t.Object({ id: t.Numeric() }) }
			)
	);

export default studio;
