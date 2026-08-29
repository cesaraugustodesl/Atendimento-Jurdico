import type { Metadata } from "next";
import { siteConfig } from "./site-config";

const MAX_TITLE = 58;
const BRAND_SUFFIX = ` | ${siteConfig.firmName}`;

function buildSeoTitle(title: string) {
  const clean = title.replace(/\s+/g, " ").trim();
  const withoutBrand = clean.replace(new RegExp(`\\s*\\|\\s*${siteConfig.firmName.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`), "").trim();
  const available = MAX_TITLE - BRAND_SUFFIX.length;
  const base = withoutBrand.length > available
    ? withoutBrand.slice(0, available).replace(/\s+\S*$/, "").trim()
    : withoutBrand;
  return `${base}${BRAND_SUFFIX}`;
}

export function buildMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const seoTitle = buildSeoTitle(title);
  const url = `${siteConfig.siteUrl}${path}`;
  const ogImage = image ?? `${siteConfig.siteUrl}/og-image.jpg`;

  return {
    title: seoTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: seoTitle,
      description,
      url,
      siteName: siteConfig.firmName,
      locale: "pt_BR",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description,
      images: [ogImage],
    },
  };
}
