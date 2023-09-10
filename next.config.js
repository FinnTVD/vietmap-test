/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		formats: ["image/avif", "image/webp"],
		minimumCacheTTL: 60,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "kangnam-okhub.s3.ap-southeast-1.amazonaws.com",
			},
		],
	},
};

module.exports = nextConfig;
