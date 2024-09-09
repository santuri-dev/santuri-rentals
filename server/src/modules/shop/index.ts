import supabase from '@/db';
import { z } from 'zod';
import { Elysia, t } from 'elysia';

const shop = (app: Elysia) =>
	app.group('/shop', (app) =>
		app
			.guard({ detail: { tags: ['Shop'] } })

			// Route to list all courses
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

			// Route to add a new course
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
					body: t.Object({
						description: t.String(),
						name: t.String(),
						cost: t.Number(),
						startDate: t.String({ format: 'date' }),
						endDate: t.String({ format: 'date' }),
						location: t.String(),
					}),
				}
			)
	);

export default shop;

const CourseSchema = z.object({
	name: z.string().min(1, 'Course name cannot be empty'),
	description: z.string().min(1, 'Description cannot be empty'),
	cost: z.number().positive(),
	startDate: z.date(),
	endDate: z.date(),
	location: z.string().min(1, 'Location cannot be empty'),
});

// Fetch all courses
async function getAllCourses() {
	const { data, error } = await supabase.from('Course').select('*');

	if (error) throw new Error(error.message);
	return data;
}

// Add a new course
async function addCourse(input: {
	description: string;
	name: string;
	cost: number;
	startDate: string;
	endDate: string;
	location: string;
}) {
	const { data, error } = await supabase
		.from('Course')
		.insert(input)
		.select('name');

	if (error) throw new Error(error.message);

	return {
		message: `Successfully added course: ${data[0].name}.`,
	};
}
