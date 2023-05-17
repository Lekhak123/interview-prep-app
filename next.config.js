/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    reactStrictMode: true,
    compiler: {
      // Enables the styled-components SWC transform
      styledComponents: true
    }
  };
   
  module.exports = nextConfig;