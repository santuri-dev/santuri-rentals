import { Elysia } from 'elysia';
import { getAllCourses, getAllProducts } from './shop.service';

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
	);

export default shop;
