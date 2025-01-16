const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.plugins.push(new MiniCssExtractPlugin());
    return config;
  },
};

module.exports = nextConfig;
