import { Elysia } from 'elysia';
import { authRoutes } from './auth/routes';
import { gearRoutes } from './gear/routes';
import { studioRoutes } from './studio/routes';
import { productRoutes } from './products/routes';
import { userRoutes } from './users/routes';
import { courseRoutes } from './courses/routes';
import { requireAdminUser } from '@/middleware/requireAdminUser';

const admin = (app: Elysia) =>
	app.group('/admin', (app) =>
		app
			.guard({ detail: { tags: ['Admin'] } })
			.use(authRoutes)
			.use(requireAdminUser)
			.use(gearRoutes)
			.use(studioRoutes)
			.use(productRoutes)
			.use(userRoutes)
			.use(courseRoutes)
	);

export default admin;
