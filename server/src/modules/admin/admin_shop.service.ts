import supabase from '@/db';
import { Course } from '../shop/shop.schema';

// Add a new course
export async function addCourse(input: Course) {
	const { data, error } = await supabase
		.from('Course')
		.insert(input)
		.select('name');

	if (error) throw new Error(error.message);

	return {
		message: `Successfully added course: ${data[0].name}.`,
	};
}

// Edit an existing course
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
