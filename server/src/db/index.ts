import { createClient } from '@supabase/supabase-js';
import env from '@/lib/env';
import { Database } from './types';
import sharp from 'sharp';

const supabase = createClient<Database>(env.SUPABASE_URL!, env.SUPABASE_KEY!);

export async function uploadFileToStorage(
	file: File,
	folder: string,
	fileName: string,
	contentType: string,
	returnPath = false
): Promise<{ publicUrl: string; placeholder: string }> {
	try {
		const { data, error } = await supabase.storage
			.from(folder)
			.upload(
				`${fileName}.${file.name.split('.')[1]}`,
				await file.arrayBuffer(),
				{
					cacheControl: '60',
					upsert: true,
					contentType: contentType,
				}
			);

		if (error) throw new Error(error.message);

		const {
			data: { publicUrl },
		} = supabase.storage.from(folder).getPublicUrl(data.path);

		if (contentType.startsWith('image/')) {
			return {
				publicUrl,
				placeholder: bufferToBase64(
					await sharp(await file.arrayBuffer())
						.resize({ width: 50, height: 50 })
						.toBuffer(),
					contentType
				),
			};
		}

		return { publicUrl: returnPath ? data.path : publicUrl, placeholder: '' };
	} catch (e: any) {
		throw new Error(e);
	}
}

function bufferToBase64(buffer: Buffer, contentType: string): string {
	return `data:${contentType};base64,${buffer.toString('base64')}`;
}

export default supabase;
