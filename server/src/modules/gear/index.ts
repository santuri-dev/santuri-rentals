import Elysia, { t } from 'elysia';
import {
	getAllItems,
	getAvailableItems,
	addItem,
	editItem,
	deleteItem,
	getItemsById,
	getInventoryStats,
} from './gear.service';
import { InventoryItemSchema } from './gear.service';
import { z } from 'zod';
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
			.get('/', async ({ set }) => {
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
						const newItem = await addItem(
							body as unknown as z.infer<typeof InventoryItemSchema>
						);
						return { success: true, message: newItem.message };
					} catch (error: any) {
						set.status = 400;
						return { success: false, message: error.message };
					}
				},
				{
					body: t.Object({
						name: t.String(),
						serialNumber: t.String(),
						condition: t.Any(),
						accessories: t.Array(t.String()),
						status: t.Any(),
					}),
				}
			)
			.put(
				'/edit/:id',
				async ({ params: { id }, body, set }) => {
					try {
						const updatedItem = await editItem({
							id,
							data: body as unknown as z.infer<typeof InventoryItemSchema>,
						});
						return { success: true, message: updatedItem.message };
					} catch (error: any) {
						set.status = 400;
						return { success: false, message: error.message };
					}
				},
				{
					params: t.Object({ id: t.String() }),
					body: t.Object({
						name: t.String(),
						serialNumber: t.String(),
						condition: t.Any(),
						accessories: t.Array(t.String()),
						status: t.Any(),
					}),
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
				'/item/:id',
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
	);

export default gear;
