import supabase from '@/db';
import { Course, Product } from '../shop/shop.schema';
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

// Add a new product
export async function addProduct(input: Product) {
	const slug = await generateUniqueSlug(input.name, 'Product');

	const { data, error } = await supabase
		.from('Product')
		.insert({ ...input, slug })
		.select('name')
		.single();

	if (error) throw new Error(error.message);

	return {
		message: `Successfully added product: ${data.name}.`,
	};
}

// Fetch all products (admin)
export async function getAllProductsAdmin() {
	const { data, error } = await supabase
		.from('Product')
		.select('*, Category(id, name)');

	if (error) throw new Error(error.message);
	return data;
}

// Get a product
export async function getProduct(slug: string) {
	const { data, error } = await supabase
		.from('Product')
		.select('*')
		.eq('slug', slug)
		.single();

	if (error) throw new Error(error.message);

	return data;
}

// Edit a product
export async function editProduct(id: string, input: Partial<Product>) {
	const { data, error } = await supabase
		.from('Product')
		.update(input)
		.eq('id', id)
		.select('name');

	if (error) throw new Error(error.message);

	return {
		message: `Successfully updated product: ${data[0].name}.`,
	};
}

// Delete a product
export async function deleteProduct(id: string) {
	const { data, error } = await supabase
		.from('Product')
		.delete()
		.eq('id', id)
		.select('name');

	if (error) throw new Error(error.message);

	return {
		message: `Successfully deleted product: ${data[0].name}.`,
	};
}
