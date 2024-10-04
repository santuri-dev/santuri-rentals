import { verifyJwt } from '@/lib/auth';
import env from '@/lib/env';
import { AdminDecodedRefresh, LocalUser } from '@/lib/types';
import {
	refreshAdminAccessToken,
	signAdminAccessToken,
} from '@/modules/admin/admin_auth.service';
import Elysia from 'elysia';

export const requireAdminUser = (app: Elysia) =>
	app.derive(async ({ set, headers }) => {
		const accessToken = `${headers.authorization?.replace('Bearer ', '')}`;
		const refreshToken = `${headers['x-refresh']}`;

		const decoded = await verifyJwt<LocalUser>(accessToken, 'ACCESS');
		const decodedRefresh = await verifyJwt<AdminDecodedRefresh>(
			refreshToken,
			'REFRESH'
		);
		// @ts-ignore
		delete decoded?.iat;
		// @ts-ignore
		delete decoded?.exp;
		if (decoded) {
			return {
				user: decoded as unknown as LocalUser,
			};
		}

		if (decodedRefresh) {
			try {
				const user = await refreshAdminAccessToken(
					decodedRefresh as unknown as AdminDecodedRefresh
				);
				const newAccessToken = await signAdminAccessToken(
					{
						id: user.id,
						name: user.username,
						image: user.image ?? '',
						imgPlaceholder: user.image ?? '',
					},
					{ expiresIn: env.ACCESS_TTL }
				);
				set.headers = {
					'x-access-token': newAccessToken,
					'Access-Control-Allow-Headers': '*',
					'Access-Control-Allow-Credentials': 'true',
					Vary: '*',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': '*',
					'Access-Control-Expose-Headers': '*',
				};

				const newuser = await verifyJwt<LocalUser>(newAccessToken, 'ACCESS');

				if (!newuser) {
					set.status = 401;
					throw new Error('Unauthorized');
				}

				// @ts-ignore
				delete newuser?.iat;
				// @ts-ignore
				delete newuser?.exp;
				return {
					user: newuser,
				};
			} catch (error: any) {
				set.status = 401;
				throw new Error(error.message);
			}
		} else {
			set.status = 401;
			throw new Error('Unauthorized');
		}
	});
