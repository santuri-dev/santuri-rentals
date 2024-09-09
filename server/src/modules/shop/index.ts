import { Elysia } from 'elysia';
import { addCourse, getAllCourses } from './shop.service';
import { CourseSchema } from './shop.schema';

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
			.post(
				'/courses',
				async ({ body, set }) => {
					try {
						const result = await addCourse(body);
						return {
							success: true,
							message: result.message,
						};
					} catch (error: any) {
						set.status = 400;
						return {
							success: false,
							message: error.message,
						};
					}
				},
				{
					body: CourseSchema,
				}
			)
	);

export default shop;
