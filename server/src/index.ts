import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import env from './lib/env';
import auth from './modules/auth';
import gear from './modules/gear';
import shop from './modules/shop';
import admin from './modules/admin';

const swaggerConfig = {
	documentation: {
		info: {
			title: 'Santuri Documentation',
			version: '1.0.0',
			description: 'Official documentation for the Santuri Backend API',
		},
		tags: [
			{
				name: 'Auth',
				description: 'Endpoints for the auth service',
			},
			{
				name: 'Admin Auth',
				description: 'Endpoints for the admin auth service',
			},
			{
				name: 'Admin Gear',
				description: 'Endpoints for the admin gear service',
			},
			{
				name: 'Admin Courses',
				description: 'Endpoints for the admin course service',
			},
			{
				name: 'User',
				description: 'Endpoints for the user service',
			},
			{
				name: 'Shop',
				description: 'Endpoints for the shop service',
			},
			{
				name: 'Studio',
				description: 'Endpoints for the studio booking service',
			},
			{
				name: 'Gear',
				description:
					'Endpoints for the public gear rental and inventory service',
			},
		],
	},
	path: '/docs',
};

const app = new Elysia()
	.use(cors())
	.use((app) => {
		if (env.NODE_ENV === 'local') {
			app.use(swagger(swaggerConfig));
		}
		return app;
	})
	.group('/api', (app) =>
		app
			.get('/health', () => 'OK', { tags: ['health'] })
			.use(auth)
			.use(admin)
			.use(gear)
			.use(shop)
	)
	.listen(env.PORT);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port} (${env.NODE_ENV})`
);

export type App = typeof app;
