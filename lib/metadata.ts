import type { Metadata } from "next";
import { siteConfig } from "./site-config";

const MAX_TITLE = 58;

function normalizeTitle(title: string) {
  const clean = title.replace(/\s+/g, " ").trim();
  return clean.length <= MAX_TITLE ? clean : clean.slice(0, MAX_TITLE).replace(/\s+\S*$/, "").trim();
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
  const seoTitle = normalizeTitle(title);
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
