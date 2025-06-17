const path = require('path')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features
// const withTM = require('next-transpile-modules')([
//   '@fullcalendar/common',
//   '@fullcalendar/react',
//   '@fullcalendar/daygrid',
//   '@fullcalendar/list',
//   '@fullcalendar/timegrid'
// ])

// module.exports = withTM({
module.exports = {
  env: {
    baseUrl: process.env.BASE_URL
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  trailingSlash: true,
  reactStrictMode: false,
  experimental: {
    // esmExternals: false, // Removed as per Next.js warning
    // jsconfigPaths: true // Removed as per Next.js warning
  },
  transpilePackages: [
    '@mui/material',
    '@mui/icons-material',
    '@mui/lab',
    '@mui/x-data-grid',
    '@mui/x-date-pickers'
  ],
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
}
