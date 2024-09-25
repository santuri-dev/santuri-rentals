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

export async function editCourse(id: string, input: Partial<Course>) {
	let slug;

	if (input.name) {
		slug = await generateUniqueSlug(input.name, 'Course');
	}

	const updateData = {
		...input,
		...(slug && { slug }),
	};

	const { data, error } = await supabase
		.from('Course')
		.update(updateData)
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
