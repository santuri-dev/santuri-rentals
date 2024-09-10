import Elysia, { t } from 'elysia';
import {
	getAllItems,
	getAvailableItems,
	addItem,
	editItem,
	deleteItem,
	getItemsById,
	getInventoryStats,
	requestGear,
} from './gear.service';
import { GearRequestSchema, InventoryItemSchema } from './gear.schema';
import { requireUser } from '@/middleware/requireUser';

const gear = (app: Elysia) =>
	app.group('/gear', (app) =>
		app
			.guard({ detail: { tags: ['Gear'] } })
			.get('/available', async ({ set }) => {
				try {
					const items = await getAvailableItems();
					return { success: true, data: items };
				} catch (error: any) {
					set.status = 500;
					return { success: false, message: error.message };
				}
			})
			.use(requireUser)
			.get('', async ({ set }) => {
				try {
					const items = await getAllItems();
					return { success: true, data: items };
				} catch (error: any) {
					set.status = 500;
					return { success: false, message: error.message };
				}
			})
			.post(
				'/add',
				async ({ body, set }) => {
					try {
						const newItem = await addItem(body);
						return { success: true, message: newItem.message };
					} catch (error: any) {
						set.status = 400;
						return { success: false, message: error.message };
					}
				},
				{
					body: InventoryItemSchema,
				}
			)
			.put(
				'/edit/:id',
				async ({ params: { id }, body, set }) => {
					try {
						const updatedItem = await editItem({
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
					body: InventoryItemSchema,
				}
			)
			.delete(
				'/delete/:id',
				async ({ params: { id }, set }) => {
					try {
						const result = await deleteItem(id);
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
			.get('/stats', async ({ set }) => {
				try {
					const stats = await getInventoryStats();
					return { success: true, data: stats };
				} catch (error: any) {
					set.status = 500;
					return { success: false, message: error.message };
				}
			})
			.get(
				'/:id',
				async ({ params: { id }, set }) => {
					try {
						const items = await getItemsById(id);
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
