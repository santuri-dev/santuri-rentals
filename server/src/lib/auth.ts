import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import env from './env';

export type KeyName = 'ACCESS' | 'REFRESH' | 'RESET';

export const verifyJwt = async <T>(
	token: string,
	keyName: KeyName
): Promise<Awaited<T> | null> => {
	const signingKey = env[`${keyName}_PRIVATE`];
	try {
		return Promise.resolve(jwt.verify(token, signingKey) as T);
	} catch (e: any) {
		return null;
	}
};

export const signJwt = async (
	payload: object,
	options: SignOptions,
	keyName: KeyName
) => {
	const privateKey = env[`${keyName}_PRIVATE`];

	return jwt.sign(payload, privateKey, {
		...(options && options),
		algorithm: 'HS256',
	});
};

export async function validatePassword(
	userPassword: string,
	passwordInput: string
) {
	return await bcrypt.compare(passwordInput, userPassword);
}

export async function hashPassword(password: string) {
	const salt = await bcrypt.genSalt(Number(env.SALT_WORK_FACTOR));
	return await bcrypt.hash(password, salt);
}
