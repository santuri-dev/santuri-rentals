import { t, Static } from 'elysia';

export const CourseSchema = t.Object({
	name: t.String({
		minLength: 1,
		errorMessage: 'Course name cannot be empty',
	}),
	description: t.String({
		minLength: 1,
		errorMessage: 'Description cannot be empty',
	}),
	cost: t.Number({ minimum: 0.01 }), // Positive number
	startDate: t.String({ format: 'date-time' }), // Dates are stored as ISO strings in TypeBox
	endDate: t.String({ format: 'date-time' }),
	location: t.String({
		minLength: 1,
		errorMessage: 'Location cannot be empty',
	}),
	applicationDeadline: t.String({ format: 'date-time' }),
});

export const ProductSchema = t.Object({
	name: t.String({
		minLength: 1,
		errorMessage: 'Product name cannot be empty',
	}),
	description: t.String({
		minLength: 1,
		errorMessage: 'Description cannot be empty',
	}),
	status: t.String({ default: 'draft' }),
	price: t.Number({ minimum: 0.01 }),
	currency: t.String({ default: 'KES' }),
	stock: t.Number(),
	categoryId: t.Optional(t.Number()),
});

export type Product = Static<typeof ProductSchema>;
export type Course = Static<typeof CourseSchema>;
