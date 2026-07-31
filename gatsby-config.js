module.exports = {
  siteMetadata: {
    title: "IPv6-adresse.dk",
    siteUrl: 'https://ipv6-adresse.dk'
  },
  // Gatsby 5.12+ auto-detects a deployment adapter. Cloudflare Pages' build
  // image is Netlify-derived, so detection installs gatsby-adapter-netlify,
  // which then dies copying output into Netlify's /opt/build/cache (EACCES).
  // This site is plain static output plus the _headers file that onPostBuild
  // writes, so no adapter is needed. Declaring one skips auto-detection.
  // `adapt` is a required func in Gatsby's config schema; the manager guards
  // the call, so a no-op is enough.
  adapter: {
    name: 'none',
    adapt: () => {},
  },
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    "gatsby-transformer-json",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `data`,
        path: `${__dirname}/data`
      }
    },
    'gatsby-plugin-react-svg',
  ],
};
