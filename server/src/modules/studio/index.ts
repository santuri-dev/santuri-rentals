import { Elysia, t } from 'elysia';
import {
	approveStudioRequest,
	createStudioRequest,
	getStudioRequests,
} from './studio.service';
import { StudioRequestSchema } from './studio.schema';

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
			.post(
				'',
				async ({ set, body }) => {
					try {
						const res = await createStudioRequest(body);
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
	);

export default studio;

// 2024-09-21T00:00:00Z
