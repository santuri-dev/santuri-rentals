import supabase from '@/db';
import slugify from 'slugify';

type SlugResource = 'Course';

const getExisting = async (slug: string, resource: SlugResource) => {
	const { data, error } = await supabase
		.from(resource)
		.select('*')
		.eq('slug', slug);
	return !!data && data.length > 0 && !error;
};

export async function generateUniqueSlug(name: string, resource: SlugResource) {
	let baseSlug = slugify(name, { lower: true, strict: true });
	let uniqueSlug = baseSlug;
	let suffix = 1;

	while (true) {
		const exists = await getExisting(uniqueSlug, resource);
		if (!exists) break;
		uniqueSlug = `${baseSlug}-${suffix}`;
		suffix++;
	}

	return uniqueSlug;
}
