export const siteConfig = {
  name: "Chimeral Insight",
  description:
    "Official author site for Robin and the Chimeral Insight universe.",
  domain: "https://chimeralinsight.com",
  publicAuthorName: "Robin Rickards Author",
};

export function getSiteUrl() {
  return process.env.APP_URL || siteConfig.domain;
}
