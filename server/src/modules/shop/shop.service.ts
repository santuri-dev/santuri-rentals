import supabase from '@/db';

// Fetch all courses
export async function getAllCourses() {
	const { data, error } = await supabase.from('Course').select('*');

	if (error) throw new Error(error.message);
	return data;
}

// Add a new course
export async function addCourse(input: {
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
