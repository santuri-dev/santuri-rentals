import { Static, t } from 'elysia';

export const GearInventoryItemCondition = t.Union([
	t.Literal('mint'),
	t.Literal('good'),
	t.Literal('bad'),
]);

export const GearInventoryItemStatus = t.Union([
	t.Literal('available'),
	t.Literal('class'),
	t.Literal('borrowed'),
	t.Literal('lease'),
	t.Literal('overdue'),
]);

export const GearInventoryItemSchema = t.Object({
	name: t.String({ minLength: 1, errorMessage: 'Name cannot be empty' }),
	serialNumber: t.String({
		minLength: 1,
		errorMessage: 'Serial number cannot be empty',
	}),
	condition: GearInventoryItemCondition,
	peripherals: t.Array(t.String()),
	notes: t.Nullable(t.String()),
	status: GearInventoryItemStatus,
});

export const GearRequestSchema = t.Object({
	items: t.Array(t.Number()),
	pickupDate: t.String({ format: 'date-time' }),
	returnDate: t.String({ format: 'date-time' }),
});

export type GearRequest = Static<typeof GearRequestSchema>;

export type GearInventoryItem = Static<typeof GearInventoryItemSchema>;
