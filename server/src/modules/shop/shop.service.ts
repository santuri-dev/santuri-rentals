import supabase from '@/db';

// Fetch all courses
export async function getAllCourses() {
	const { data, error } = await supabase.from('Course').select('*');

	if (error) throw new Error(error.message);
	return data;
}

// Fetch all products
export async function getAllProducts() {
	const { data, error } = await supabase
		.from('Product')
		.select(
			'id, name, description, slug, stock, price, currency, imageUrl, imagePlaceholder, Category(id, name)'
		);

	if (error) throw new Error(error.message);
	return data;
}
