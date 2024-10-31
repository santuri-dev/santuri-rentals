import { t, Static } from 'elysia';

export const StudioRequestSchema = t.Object({
	typeId: t.Number(),
	startTime: t.String({ format: 'date-time' }),
	endTime: t.String({ format: 'date-time' }),
});

export const StudioTypeSchema = t.Object({
	name: t.String(),
	description: t.String(),
	pricing: t.Number(),
});

export type StudioRequest = Static<typeof StudioRequestSchema>;
export type StudioType = Static<typeof StudioTypeSchema>;
