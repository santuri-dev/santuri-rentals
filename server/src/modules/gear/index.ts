import Elysia, { t } from 'elysia';
import {
	getAvailableGearItems,
	getGearItemsById,
	requestGear,
} from './gear.service';
import { GearRequestSchema } from './gear.schema';
import { requireUser } from '@/middleware/requireUser';
import { paginationQuerySchema } from '@/lib/pagination';

const gear = (app: Elysia) =>
	app.group('/gear', (app) =>
		app
			.guard({ detail: { tags: ['Gear'] } })
			.get(
				'/available',
				async ({ set, query }) => {
					try {
						const data = await getAvailableGearItems(query);
						return { success: true, ...data };
					} catch (error: any) {
						set.status = 500;
						return { success: false, message: error.message };
					}
				},
				{ query: paginationQuerySchema }
			)
			.get(
				'/:id',
				async ({ params: { id }, set }) => {
					try {
						const items = await getGearItemsById(id);
						return { success: true, data: items };
					} catch (error: any) {
						set.status = 500;
						return { success: false, message: error.message };
					}
				},
				{
					params: t.Object({ id: t.Number() }),
				}
			)
			.use(requireUser)
			.post(
				'/request',
				async ({ body, set, user }) => {
					try {
						const items = await requestGear({ ...body, borrowerId: user.id });
						return { success: true, message: items };
					} catch (error: any) {
						set.status = 500;
						return { success: false, message: error.message };
					}
				},
				{ body: GearRequestSchema }
			)
	);

export default gear;
