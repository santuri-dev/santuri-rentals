import * as z from 'zod';

const envSchema = z.object({
	SUPABASE_URL: z.string(),
	SUPABASE_KEY: z.string(),
	ACCESS_PRIVATE: z.string(),
	REFRESH_PRIVATE: z.string(),
	RESET_PRIVATE: z.string(),
	INVITE_PRIVATE: z.string(),
	SALT_WORK_FACTOR: z.string().refine((v) => !isNaN(parseInt(v))),
	ACCESS_TTL: z.string(),
	REFRESH_TTL: z.string(),
	SERVER_URL: z.string().url(),
	EMAIL_DOMAIN: z.string(),
	EMAIL_FROM: z.string().email(),
	EMAIL_SERVER_HOST: z.string(),
	EMAIL_SERVER_PORT: z
		.string()
		.refine((v) => !isNaN(parseInt(v)))
		.transform((v) => parseInt(v)),
	EMAIL_SERVER_USER: z.string(),
	EMAIL_SERVER_PASSWORD: z.string(),
	CLIENT_URL: z.string().url(),
	ADMIN_CLIENT_URL: z.string().url(),
	NODE_ENV: z.string(),
	PORT: z.string().refine((v) => !isNaN(parseInt(v))),
	INTASEND_PUBLISHABLE_KEY: z.string(),
	INTASEND_API_TOKEN: z.string(),
});

const results = envSchema.safeParse(Bun.env);

if (!results.success) {
	throw new Error(
		`Missing ${results.error.errors
			.map(({ path }) => `${path}`)
			.join(', ')} env variables.`
	);
} else {
	console.log('🔥 Successfully loaded env');
}

export default results.data;
