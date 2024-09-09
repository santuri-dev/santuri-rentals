import Elysia, { t } from 'elysia';
import { verifyUser } from './user.service';
import env from '@/lib/env';

const user = (app: Elysia) =>
	app.group('/user', (app) =>
		app.guard({ detail: { tags: ['User'] } }).get(
			'/verify/:id/:verificationCode',
			async ({ params: { id, verificationCode }, redirect }) => {
				const res = await verifyUser(id, verificationCode);
				return redirect(
					`${env.CLIENT_URL}/auth/login?verified=${res.success}${
						res.data?.email ? `&email=${res.data?.email}` : ''
					}`
				);
			},
			{
				params: t.Object({ id: t.Numeric(), verificationCode: t.String() }),
			}
		)
	);

export default user;
