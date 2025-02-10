import { Elysia, t } from 'elysia';
import { paginationQuerySchema } from '@/lib/pagination';
import { CourseSchema } from '../../shop/shop.schema';
import { getAllCourses } from '../../shop/shop.service';
import {
	addCourse,
	deleteCourse,
	editCourse,
	getCourse,
	uploadCourseFiles,
} from '../products/service';

export const courseRoutes = (app: Elysia) =>
	app.group('/courses', (app) =>
		app
			.guard({ detail: { tags: ['Admin Courses'] } })
			.get(
				'',
				async ({ set, query }) => {
					try {
						const data = await getAllCourses(query);
						return { success: true, ...data };
					} catch (error: any) {
						set.status = 500;
						return { success: false, message: error.message };
					}
				},
				{ query: paginationQuerySchema }
			)
			.post(
				'',
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
			.get(
				'/:slug',
				async ({ set, params: { slug } }) => {
					try {
						const data = await getCourse(slug);
						return {
							success: true,
							data,
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
					params: t.Object({ slug: t.String() }),
				}
			)
			.put(
				'/edit/:id',
				async ({ body, set, params: { id } }) => {
					try {
						const result = await editCourse(id, body);
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
					params: t.Object({ id: t.String() }),
				}
			)
			.delete(
				'/delete/:id',
				async ({ params: { id }, set }) => {
					try {
						const result = await deleteCourse(id);
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
			.post(
				'/:id/cover',
				async ({ body: { cover }, set, params: { id } }) => {
					try {
						const res = await uploadCourseFiles({
							id,
							cover,
						});
						return {
							success: true,
							...res,
						};
					} catch (error: any) {
						set.status = 400;
						return { success: false, message: error.message, data: null };
					}
				},
				{
					body: t.Object({
						cover: t.File({
							type: ['image/png', 'image/jpeg', 'image/webp'],
						}),
					}),
					params: t.Object({ id: t.Numeric() }),
				}
			)
	);
