/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Allow JSON imports from config folder
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });
    return config;
  },
};

module.exports = nextConfig;