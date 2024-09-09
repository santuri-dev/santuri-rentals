import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import env from './lib/env';
import auth from './modules/auth';
import user from './modules/user';
import gear from './modules/gear';
import shop from './modules/shop';

const app = new Elysia().use(cors());

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

if (Bun.env.LOCAL) app.use(swagger(swaggerConfig));

app
	.group('/api', (app) =>
		app
			.get('/health', () => 'OK', { tags: ['health'] })
			.use(auth)
			.use(user)
			.use(gear)
			.use(shop)
	)
	.listen(env.PORT);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port} (${env.NODE_ENV})`
);
