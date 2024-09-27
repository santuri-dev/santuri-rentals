import supabase from '@/db';
import { Course } from '../shop/shop.schema';
import { generateUniqueSlug } from '../../lib/helpers';

// Add a new course
export async function addCourse(input: Course) {
	const slug = await generateUniqueSlug(input.name, 'Course');

	const { data, error } = await supabase
		.from('Course')
		.insert({ ...input, slug })
		.select('name');

	if (error) throw new Error(error.message);

	return {
		message: `Successfully added course: ${data[0].name}.`,
	};
}

// Get a course
export async function getCourse(slug: string) {
	const { data, error } = await supabase
		.from('Course')
		.select('*')
		.eq('slug', slug)
		.single();

	if (error) throw new Error(error.message);

	return data;
}

export async function editCourse(id: string, input: Partial<Course>) {
	const { data, error } = await supabase
		.from('Course')
		.update(input)
		.eq('id', id)
		.select('name');

	if (error) throw new Error(error.message);

	return {
		message: `Successfully updated course: ${data[0].name}.`,
	};
}

// Delete a course
export async function deleteCourse(id: string) {
	const { data, error } = await supabase
		.from('Course')
		.delete()
		.eq('id', id)
		.select('name');

	if (error) throw new Error(error.message);

	return {
		message: `Successfully deleted course: ${data[0].name}.`,
	};
}
