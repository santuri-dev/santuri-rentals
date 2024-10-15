import { Elysia, t } from 'elysia';
import { createCheckout, getAllCourses, getAllProducts } from './shop.service';

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
			.post(
				'/checkout',
				async ({ set, body }) => {
					try {
						const courses = await createCheckout(body);
						return {
							success: true,
							message: 'Order was created successfully',
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
	);

export default shop;
