import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/blog/queries";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const posts = await getPublishedPosts();

  const staticRoutes = ["", "/blog", "/contact", "/presskit", "/privacy", "/terms"].map(
    (path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
    })
  );

  const blogRoutes = posts.map((post: (typeof posts)[number]) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  return [...staticRoutes, ...blogRoutes];
}
