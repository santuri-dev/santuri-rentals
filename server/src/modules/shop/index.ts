import { Elysia, t } from 'elysia';
import {
	createOrder,
	getAllCourses,
	getAllProducts,
	getOrder,
	getOrderStatus,
} from './shop.service';
import { env } from 'bun';

const shop = (app: Elysia) =>
	app.group('/shop', (app) =>
		app
			.guard({ detail: { tags: ['Shop'] } })
			.get('/courses', async ({ set }) => {
				try {
					const courses = await getAllCourses();
					return {
						success: true,
						message: 'Courses fetched successfully',
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
			.get('/products', async ({ set }) => {
				try {
					const courses = await getAllProducts();
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
			.post('/intasend-webhook', async ({ body, set }) => {
				if ((body as any).challenge === env.NODE_ENV) {
					await getOrderStatus((body as any).state, (body as any).api_ref);
				}
				set.status = 200;
			})
			.post(
				'/checkout',
				async ({ set, body }) => {
					try {
						const data = await createOrder(body);
						return {
							success: true,
							message: 'Order was created successfully',
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
					body: t.Object({
						items: t.Array(
							t.Object({ quantity: t.Number(), productId: t.Number() })
						),
						billingAddress: t.Object({
							firstName: t.String(),
							lastName: t.String(),
							email: t.String({ format: 'email' }),
							phoneNumber: t.String(),
						}),
					}),
				}
			)
			.get(
				'/checkout/:ref',
				async ({ set, params: { ref } }) => {
					try {
						const data = await getOrder(ref);

						if (!data)
							return {
								success: false,
								message:
									'Something went wrong fetching the order payment process',
								data: null,
							};

						return {
							success: true,
							message: 'Successfully fetched payment status',
							data,
						};
					} catch (error: any) {
						set.status = 400;
						return { success: false, message: error.message, data: null };
					}
				},
				{
					params: t.Object({ ref: t.String() }),
					query: t.Object({
						signature: t.String(),
						checkout_id: t.String(),
						tracking_id: t.String(),
					}),
				}
			)
	);

export default shop;
