const colors = require("../../src/styles/colors");

module.exports = {
  siteTitle: "Vinz", // <title>
  shortSiteTitle: "Vinz", // <title> ending for posts and pages
  siteDescription: "Vinz Fitness Club.",
  siteUrl: "",
  pathPrefix: "",
  siteImage: "preview.jpg",
  siteLanguage: "en",
  // author
  authorName: "Vinu Pillai",
  authorTwitterAccount: "greglobinski",
  // info
  infoTitle: "Vinz",
  infoTitleNote: "the fitness blog",
  // manifest.json
  manifestName: "Fitness Blog - Vinu Pilai",
  manifestShortName: "PersonalBlog", // max 12 characters
  manifestStartUrl: "/",
  manifestBackgroundColor: colors.background,
  manifestThemeColor: colors.background,
  manifestDisplay: "standalone",
  // contact
  contactEmail: "john@doe.com",
  // social
  authorSocialLinks: [
    { name: "instagram", url: "https://instagram.com/#" },
    { name: "twitter", url: "https://twitter.com/#" },
    { name: "facebook", url: "https://facebook.com/#" }
  ]
};
