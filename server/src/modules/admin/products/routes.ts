import { Elysia, t } from 'elysia';
import { paginationQuerySchema } from '@/lib/pagination';
import { ProductSchema } from '../../shop/shop.schema';
import {
	addProduct,
	createProductCategory,
	deleteProduct,
	deleteProductCategory,
	editProduct,
	getAllProductsAdmin,
	getProduct,
	getProductCategories,
	uploadProductFiles,
} from './service';

export const productRoutes = (app: Elysia) =>
	app.group('/products', (app) =>
		app
			.guard({ detail: { tags: ['Admin Products'] } })
			.get(
				'',
				async ({ set, query }) => {
					try {
						const data = await getAllProductsAdmin(query);
						return {
							success: true,
							message: 'Products fetched successfully',
							...data,
						};
					} catch (error: any) {
						set.status = 400;
						return {
							success: false,
							message: error.message,
							data: null,
						};
					}
				},
				{ query: paginationQuerySchema }
			)
			.post(
				'',
				async ({ set, body }) => {
					try {
						const result = await addProduct(body);
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
				{ body: ProductSchema }
			)
			.get(
				'/:slug',
				async ({ set, params: { slug } }) => {
					try {
						const data = await getProduct(slug);
						return {
							success: true,
							data,
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
					params: t.Object({ slug: t.String() }),
				}
			)
			.put(
				'/:id',
				async ({ body, set, params: { id } }) => {
					try {
						const result = await editProduct(id, body);
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
					body: ProductSchema,
					params: t.Object({ id: t.String() }),
				}
			)
			.delete(
				'/:id',
				async ({ params: { id }, set }) => {
					try {
						const result = await deleteProduct(id);
						return { success: true, message: result.message };
					} catch (error: any) {
						set.status = 500;
						return { success: false, message: error.message };
					}
				},
				{
					params: t.Object({ id: t.String() }),
				}
			)
			.group('/categories', (app) =>
				app
					.get('', async ({ set }) => {
						try {
							const data = await getProductCategories();
							return {
								message: 'Successfully fetch product categories',
								success: true,
								data,
							};
						} catch (error: any) {
							return { success: false, message: error.message, data: null };
						}
					})
					.post(
						'',
						async ({ body }) => {
							try {
								const { message } = await createProductCategory(body);
								return {
									message,
									success: true,
								};
							} catch (error: any) {
								return {
									success: false,
									message: error.message,
									data: null,
								};
							}
						},
						{ body: t.Object({ name: t.String() }) }
					)
					.delete(
						'/:id',
						async ({ params }) => {
							try {
								const { message } = await deleteProductCategory(params.id);
								return {
									message,
									success: true,
								};
							} catch (error: any) {
								return {
									success: false,
									message: error.message,
									data: null,
								};
							}
						},
						{ params: t.Object({ id: t.Number() }) }
					)
			)
			.post(
				'/:id/cover',
				async ({ body: { cover }, set, params: { id } }) => {
					try {
						const res = await uploadProductFiles({
							id,
							cover,
						});
						return {
							success: true,
							...res,
						};
					} catch (error: any) {
						set.status = 400;
						return { success: false, message: error.message, data: null };
					}
				},
				{
					body: t.Object({
						cover: t.File({
							type: ['image/png', 'image/jpeg', 'image/webp'],
						}),
					}),
					params: t.Object({ id: t.Numeric() }),
				}
			)
	);
