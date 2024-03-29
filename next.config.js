/** @type {import('next').NextConfig} */
const nextConfig = {
    headers: [
        {
             key: 'X-Frame-Options',
             value: 'SAMEORIGIN'
        },
    ],
    images: {
        domains: ["static-cdn.jtvnw.net"]
    },
    rewrites: async () => {
        return [
            {
                source: '/api/:path*',
                destination:
                    process.env.NODE_ENV === 'development'
                        ? 'http://127.0.0.1:8000/api/:path*'
                        : '/api/',
            },
            {
                source: '/docs',
                destination:
                    process.env.NODE_ENV === 'development'
                        ? 'http://127.0.0.1:8000/docs'
                        : '/api/docs',
            },
            {
                source: '/openapi.json',
                destination:
                    process.env.NODE_ENV === 'development'
                        ? 'http://127.0.0.1:8000/openapi.json'
                        : '/api/openapi.json',
            },
        ];
    },
    experimental: {
        outputFileTracingExcludes: {
            '*': [
                // prettier-ignore
                // './.next',
                // './.next/**',
                // 'node_modules/@swc/core-linux-x64-gnu',
                // 'node_modules/@swc/core-linux-x64-musl',
                // 'node_modules/@esbuild/linux-x64',
            ],
        },
    },
};

module.exports = nextConfig;
