require("dotenv").config();
const config = require("./content/meta/config");

const query = `{
  allMarkdownRemark(filter: { id: { regex: "//posts|pages//" } }) {
    edges {
      node {
        objectID: id
        fields {
          slug
        }
        internal {
          content
        }
        frontmatter {
          title
          subTitle
        }
      }
    }
  }
}`;

const queries = [
  {
    query,
    transformer: ({ data }) => data.allMarkdownRemark.edges.map(({ node }) => node)
  }
];

module.exports = {
  siteMetadata: {
    title: config.siteTitle,
    description: config.siteDescription,
    siteUrl: config.siteUrl,
    pathPrefix: config.pathPrefix,
    algolia: {
      appId: process.env.ALGOLIA_APP_ID ? process.env.ALGOLIA_APP_ID : "",
      searchOnlyApiKey: process.env.ALGOLIA_SEARCH_ONLY_API_KEY
        ? process.env.ALGOLIA_SEARCH_ONLY_API_KEY
        : "",
      indexName: process.env.ALGOLIA_INDEX_NAME ? process.env.ALGOLIA_INDEX_NAME : ""
    },
    facebook: {
      appId: process.env.FB_APP_ID ? process.env.FB_APP_ID : ""
    }
  },
  plugins: [
    `gatsby-plugin-react-next`,
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.ALGOLIA_APP_ID ? process.env.ALGOLIA_APP_ID : "",
        apiKey: process.env.ALGOLIA_ADMIN_API_KEY ? process.env.ALGOLIA_ADMIN_API_KEY : "",
        indexName: process.env.ALGOLIA_INDEX_NAME ? process.env.ALGOLIA_INDEX_NAME : "",
        queries,
        chunkSize: 10000 // default: 1000
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/posts/`,
        name: "posts"
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/pages/`,
        name: "pages"
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `parts`,
        path: `${__dirname}/content/parts/`
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-plugin-sharp`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              backgroundColor: "transparent"
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 2em`
            }
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`
        ]
      }
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-catch-links`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: config.manifestName,
        short_name: config.manifestShortName,
        start_url: config.manifestStartUrl,
        background_color: config.manifestBackgroundColor,
        theme_color: config.manifestThemeColor,
        display: config.manifestDisplay,
        icons: [
          {
            src: "/icons/icon-48x48.png",
            sizes: "48x48",
            type: "image/png"
          },
          {
            src: "/icons/icon-96x96.png",
            sizes: "96x96",
            type: "image/png"
          },
          {
            src: "/icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png"
          },
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png"
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        importWorkboxFrom: `local`,
        modifyUrlPrefix: {
          //   // If `pathPrefix` is configured by user, we should replace
          //   // the default prefix with `pathPrefix`.
          "/": config.pathPrefix
        },
        cacheId: `gatsby-plugin-offline`,
        // Don't cache-bust JS or CSS files, and anything in the static directory,
        // since these files have unique URLs and their contents will never change
        dontCacheBustUrlsMatching: /(\.js$|\.css$|\/static\/)/,
        runtimeCaching: [
          {
            // Use cacheFirst since these don't need to be revalidated (same RegExp
            // and same reason as above)
            urlPattern: /(\.js$|\.css$|\/static\/)/,
            handler: `cacheFirst`
          },
          {
            // Add runtime caching of various other page resources
            urlPattern: /^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/,
            handler: `staleWhileRevalidate`
          },
          {
            // Google Fonts CSS (doesn't end in .css so we need to specify it)
            urlPattern: /^https?:\/\/fonts\.googleapis\.com\/css/,
            handler: `staleWhileRevalidate`
          }
        ],
        skipWaiting: true,
        clientsClaim: true
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GOOGLE_ANALYTICS_ID
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }]
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: { order: DESC, fields: [fields___prefix] },
                  filter: { id: { regex: "//posts//" } }
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields {
                        slug
                        prefix
                      }
                      frontmatter {
                        title
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml"
          }
        ]
      }
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        include: /svg-icons/
      }
    },
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        headers: {}, // option to add more headers. `Link` headers are transformed by the below criteria
        allPageHeaders: [], // option to add headers for all pages. `Link` headers are transformed by the below criteria
        mergeSecurityHeaders: true, // boolean to turn off the default security headers
        mergeLinkHeaders: true, // boolean to turn off the default gatsby js headers
        mergeCachingHeaders: true, // boolean to turn off the default caching headers
        transformHeaders: (headers, path) => headers, // optional transform for manipulating headers under each path (e.g.sorting), etc.
        generateMatchPathRewrites: true, // boolean to turn off automatic creation of redirect rules for client only paths
      }
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/some-other-sitemap.xml`,
        // Exclude specific pages or groups of pages using glob parameters
        // See: https://github.com/isaacs/minimatch
        // The example below will exclude the single `path/to/page` and all routes beginning with `category`
        exclude: ["/category/*", `/path/to/page`],
        query: `
        {
          site {
            siteMetadata {
              siteUrl
            }
          }

          allSitePage {
            edges {
              node {
                path
              }
            }
          }
      }`
      }
    }
  ]
};
