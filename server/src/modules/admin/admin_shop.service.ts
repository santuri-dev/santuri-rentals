import supabase, { uploadFileToStorage } from '@/db';
import { Course, Product } from '../shop/shop.schema';
import { generateUniqueSlug, toSnakeCase } from '../../lib/helpers';
import { getPagination, PaginationState } from '@/lib/pagination';

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

// Get a course
export async function getCourseById(id: number) {
	const { data, error } = await supabase
		.from('Course')
		.select('*')
		.eq('id', id)
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
		.insert({
			...input,
			slug,
			categoryId: input.categoryId === 0 ? null : input.categoryId,
		})
		.select('name')
		.single();

	if (error) throw new Error(error.message);

	return {
		message: `Successfully added product: ${data.name}.`,
	};
}

// Fetch all products (admin)
export async function getAllProductsAdmin(pagination: PaginationState) {
	const { from, pageIndex, pageSize, to } = getPagination(pagination);

	const { data, error, count } = await supabase
		.from('Product')
		.select('*, Category(id, name)', { count: 'exact' })
		.order('id')
		.range(from, to);

	if (error) throw new Error(error.message);

	return { data, pagination: { pageIndex, pageSize, count } };
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

export async function getProductById(id: number) {
	const { data, error } = await supabase
		.from('Product')
		.select('*')
		.eq('id', id)
		.single();

	if (error) throw new Error(error.message);

	return data;
}

// Edit a product
export async function editProduct(id: string, input: Partial<Product>) {
	const { data, error } = await supabase
		.from('Product')
		.update({
			...input,
			categoryId: input.categoryId === 0 ? null : input.categoryId,
		})
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

// Get product categories
export async function getProductCategories() {
	const { data, error } = await supabase.from('Category').select('*');

	if (error) throw new Error(error.message);

	return data;
}

// Create product category
export async function createProductCategory(input: { name: string }) {
	const { error } = await supabase.from('Category').insert(input);

	if (error) throw new Error(error.message);

	return { message: `Successfully created product category ${input.name}` };
}

export async function deleteProductCategory(id: number) {
	const { data, error } = await supabase
		.from('Category')
		.delete()
		.eq('id', id)
		.select()
		.single();

	if (error) throw new Error(error.message);

	return { message: `Successfully deleted product category ${data.name}` };
}

/** 
  - [products]
    - [product-id]
      - `product_name_cover.png`

	- Save the product cover url
*/
export async function uploadProductFiles({
	id,
	cover,
}: {
	id: number;
	cover: File;
}) {
	try {
		const product = await getProductById(id);
		const productName = toSnakeCase(product.name);

		const { placeholder, publicUrl } = await uploadFileToStorage(
			cover,
			'products',
			`${product.id}/${productName}_cover`,
			cover.type
		);

		const { data } = await supabase
			.from('Product')
			.update({
				imagePlaceholder: placeholder,
				imageUrl: publicUrl,
			})
			.eq('id', id)
			.select('imageUrl, imagePlaceholder')
			.single();

		return { message: 'Successfully uploaded product cover image', data };
	} catch (e: any) {
		throw new Error(e.message);
	}
}

/** 
  - [products]
    - [product-id]
      - `product_name_cover.png`

	- Save the product cover url
*/
export async function uploadCourseFiles({
	id,
	cover,
}: {
	id: number;
	cover: File;
}) {
	try {
		const course = await getCourseById(id);
		const courseName = toSnakeCase(course.name);

		const { placeholder, publicUrl } = await uploadFileToStorage(
			cover,
			'courses',
			`${course.id}/${courseName}_cover`,
			cover.type
		);

		const { data } = await supabase
			.from('Course')
			.update({
				imagePlaceholder: placeholder,
				imageUrl: publicUrl,
			})
			.eq('id', id)
			.select('imageUrl, imagePlaceholder')
			.single();

		return { message: 'Successfully uploaded course cover image', data };
	} catch (e: any) {
		throw new Error(e.message);
	}
}
