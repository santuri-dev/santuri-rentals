/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lmmyifayydtcperivjkc.supabase.co',
			},
		],
		minimumCacheTTL: 60,
	},
};

export default nextConfig;
