import { Elysia, t } from 'elysia';
import { paginationQuerySchema } from '@/lib/pagination';
import {
	addGearItem,
	deleteGearItem,
	editGearItem,
	getAllGearItems,
	getGearInventoryStats,
	getManyGearItems,
	getPendingGearRequests,
} from '../../gear/gear.service';
import {
	GearInventoryItemSchema,
	GearInventoryItemStatus,
} from '../../gear/gear.schema';
import {
	approveGearRequest,
	closeGearRequest,
	getAllLeases,
} from '../gear/service';

export const gearRoutes = (app: Elysia) =>
	app.group('/gear', (app) =>
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
			.get(
				'',
				async ({ set, query }) => {
					try {
						const { data, pagination } = await getAllGearItems(query);
						return { success: true, data, pagination };
					} catch (error: any) {
						set.status = 500;
						return { success: false, message: error.message };
					}
				},
				{
					query: paginationQuerySchema,
				}
			)
			.post(
				'/bulk',
				async ({ set, body: { ids, status }, query }) => {
					try {
						const res = await getManyGearItems(ids, query, status);
						return { success: true, ...res };
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
					query: paginationQuerySchema,
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
					.get(
						'',
						async ({ set, query }) => {
							try {
								const res = await getPendingGearRequests(query);
								return { success: true, ...res };
							} catch (error: any) {
								set.status = 500;
								return { success: false, message: error.message };
							}
						},
						{
							query: paginationQuerySchema,
						}
					)
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
				app.get(
					'',
					async ({ set, query }) => {
						try {
							const res = await getAllLeases(query);
							return { success: true, ...res };
						} catch (error: any) {
							set.status = 500;
							return { success: false, message: error.message };
						}
					},
					{ query: paginationQuerySchema }
				)
			)
	);
