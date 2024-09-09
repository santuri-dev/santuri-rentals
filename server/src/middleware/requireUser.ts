import { DecodedRefresh, LocalUser } from '@/lib/types';
import { verifyJwt } from '@/lib/auth';
import {
	refreshAccessToken,
	signAccessToken,
} from '@/modules/auth/auth.service';
import Elysia from 'elysia';
import env from '@/lib/env';

export const requireUser = (app: Elysia) =>
	app.derive(async ({ set, headers }) => {
		const accessToken = `${headers.authorization?.replace('Bearer ', '')}`;
		const refreshToken = `${headers['x-refresh']}`;

		const decoded = await verifyJwt<LocalUser>(accessToken, 'ACCESS');
		const decodedRefresh = await verifyJwt<DecodedRefresh>(
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
				const user = await refreshAccessToken(
					decodedRefresh as unknown as DecodedRefresh
				);
				const newAccessToken = await signAccessToken(
					{
						id: user.id,
						name: user.username,
						image: user.image ?? '',
						imgPlaceholder: user.imgPlaceholder ?? '',
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
