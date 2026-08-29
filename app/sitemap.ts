import type { MetadataRoute } from "next";
import { areas } from "@/lib/areas-data";
import { blogPosts } from "@/lib/blog-data";
import { criminalCluster } from "@/lib/criminal-cluster";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl;

  const staticRoutes = [
    "",
    "/sobre",
    "/direito-criminal",
    "/atendimento",
    "/contato",
    "/faq",
    "/blog",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const areaRoutes = areas.map((area) => ({
    url: `${base}/areas/${area.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const criminalRoutes = criminalCluster.map((page) => ({
    url: `${base}/atuacao-criminal/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: page.slug === "advogado-criminalista-sao-paulo" ? 0.95 : 0.85,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...criminalRoutes, ...areaRoutes, ...blogRoutes];
}
