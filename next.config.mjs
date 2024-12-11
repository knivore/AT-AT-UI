/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    async redirects() {
        return [
            {
                source: '/',
                destination: '/dashboard',
                permanent: true, // or false, based on your requirement
            },
        ];
    }
};

export default nextConfig;
