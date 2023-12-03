const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three"],
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@import "@/styles/variables.scss";`,
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      // use: ["raw-loader", "glslify-loader"],
      type: "asset/source",
    });

    return config;
  },
};

module.exports = nextConfig;
