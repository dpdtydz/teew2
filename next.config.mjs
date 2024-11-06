/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: { ignoreDuringBuilds: true },
    async rewrites() {
        return [{
            source: '/api/:path*',
            destination: 'http://localhost:8080/api/:path*'
        }];
    },
    images: { unoptimized: true },
    webpack: (config, { isServer, dev }) => {
        if (!isServer && dev) {
            config.optimization.moduleIds = 'named'
        }
        return config
    }
};