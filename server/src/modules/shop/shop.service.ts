import supabase from '@/db';

// Fetch all courses
export async function getAllCourses() {
	const { data, error } = await supabase.from('Course').select('*');

	if (error) throw new Error(error.message);
	return data;
}
