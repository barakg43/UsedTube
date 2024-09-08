const root_api = process.env.NEXT_PUBLIC_HOST;
module.exports = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${root_api}/:path*`,
      },
    ];
  },
};
