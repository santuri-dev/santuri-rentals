import { t, Static } from 'elysia';

export const StudioRequestSchema = t.Object({
	type: t.String({
		minLength: 1,
		errorMessage: 'Type cannot be empty',
	}),
	startTime: t.String({ format: 'date-time' }),
	endTime: t.String({ format: 'date-time' }),
});

export type StudioRequest = Static<typeof StudioRequestSchema>;
