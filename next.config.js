/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'cdn.noitatnemucod.net',
      }
    ],
  },
  
  // output: 'export',
  // exportPathMap: async function (defaultPathMap,
  //    { dev, dir, outDir, distDir, buildId }) {
  //     const filteredPathMap = Object.keys(defaultPathMap).reduce((acc, path) => {
  //         if (path !== '/app/api/anime/FetchTopAiring/route') {
  //             acc[path] = defaultPathMap[path];
  //         }
  //         return acc;
  //     }, {});

  //     return filteredPathMap;
  // },
}

module.exports = nextConfig;
