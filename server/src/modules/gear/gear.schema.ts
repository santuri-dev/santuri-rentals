import { Static, t } from 'elysia';

export const InventoryItemCondition = t.Union([
	t.Literal('mint'),
	t.Literal('good'),
	t.Literal('bad'),
]);

export const InventoryItemStatus = t.Union([
	t.Literal('available'),
	t.Literal('class'),
	t.Literal('borrowed'),
	t.Literal('lease'),
	t.Literal('overdue'),
]);

export const InventoryItemSchema = t.Object({
	name: t.String({ minLength: 1, errorMessage: 'Name cannot be empty' }),
	serialNumber: t.String({
		minLength: 1,
		errorMessage: 'Serial number cannot be empty',
	}),
	condition: InventoryItemCondition,
	accessories: t.Optional(t.String()),
	notes: t.Optional(t.String()),
	status: InventoryItemStatus,
});

export type InventoryItem = Static<typeof InventoryItemSchema>;
