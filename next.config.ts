/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true, // for example, to make svgs responsive like icons
            },
          },
        ],
        as: '*.js',
      },
    },
  },
};

module.exports = nextConfig;
