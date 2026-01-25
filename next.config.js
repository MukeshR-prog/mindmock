/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdf2json'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'pdf2json': 'commonjs pdf2json',
      });
    }
    return config;
  },
};

module.exports = nextConfig;
