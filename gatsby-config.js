module.exports = {
  siteMetadata: {
    title: "IPv6-adresse.dk",
    siteUrl: 'https://ipv6-adresse.dk'
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
    {
      resolve: 'gatsby-plugin-react-svg',
    },
  ],
};
