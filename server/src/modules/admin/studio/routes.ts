import { Elysia, t } from 'elysia';
import { paginationQuerySchema } from '@/lib/pagination';
import {
	approveStudioRequest,
	createStudioType,
	deleteStudioRestrictedDate,
	deleteStudioType,
	editStudioType,
	getAdminStudioRequests,
	getRestrictedStudioDatesAdmin,
	getStudioTypesAdmin,
	restrictStudioDates,
} from './service';
import { StudioTypeSchema } from '../../studio/studio.schema';

export const studioRoutes = (app: Elysia) =>
	app.group('/studio', (app) =>
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
			.get('/requests', async ({ set, query }) => {
				try {
					const data = await getAdminStudioRequests(query);
					return {
						success: true,
						message: 'Studio requests fetched successfully',
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
			})
			.group('/types', (app) =>
				app
					.get('', async ({ set, query }) => {
						try {
							const data = await getStudioTypesAdmin(query);
							return {
								success: true,
								message: 'Successfully fetched studio types',
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
					})
					.post('', async ({ set, body }) => {
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
					})
			)
	);
