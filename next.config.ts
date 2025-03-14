import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.alias['quill'] = require.resolve('quill')
    return config
  },
}

export default nextConfig
