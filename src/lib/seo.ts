import { blogIndexMeta, type BlogPost, type ContentBase, type ServicePage } from "../content";
import { corePageSeo, getAbsoluteUrl, pageLabels, pagePaths, siteConfig } from "../config/site";
import type { Page } from "../config/site";
import type { ResolvedRoute } from "./routing";
import type { SimulatorDefinition } from "./simulators/types";

interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface SeoDocument {
  title: string;
  description: string;
  canonicalPath: string;
  canonicalUrl: string;
  ogType: "website" | "article";
  imageUrl: string;
  robots: string;
  breadcrumbs: BreadcrumbItem[];
  structuredData: Array<Record<string, unknown>>;
}

function buildTitle(title: string) {
  return `${title} | ${siteConfig.brand.name}`;
}

function getCoreBreadcrumbs(page: Page): BreadcrumbItem[] {
  if (page === "home") {
    return [{ name: pageLabels.home, path: pagePaths.home }];
  }

  return [
    { name: pageLabels.home, path: pagePaths.home },
    { name: pageLabels[page], path: pagePaths[page] },
  ];
}

function getContentBreadcrumbs(entry: ContentBase, sectionLabel: string): BreadcrumbItem[] {
  return [
    { name: pageLabels.home, path: pagePaths.home },
    { name: "Blog", path: pagePaths.blog },
    { name: sectionLabel, path: entry.path },
  ];
}

function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: siteConfig.brand.name,
    url: siteConfig.seo.siteUrl,
    telephone: siteConfig.contact.phoneDisplay,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.addressLine1,
      addressLocality: "Sao Paulo",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    areaServed: "BR",
    openingHours: siteConfig.contact.officeHours,
  };
}

function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brand.name,
    url: siteConfig.seo.siteUrl,
    description: siteConfig.seo.defaultDescription,
  };
}

function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getAbsoluteUrl(item.path),
    })),
  };
}

function getFaqSchema(entry: ContentBase) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entry.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function getServiceSchema(entry: ServicePage) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.description,
    mainEntityOfPage: getAbsoluteUrl(entry.path),
    author: {
      "@type": "Organization",
      name: siteConfig.brand.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.brand.name,
    },
  };
}

function getBlogSchema(entry: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: entry.title,
    description: entry.description,
    datePublished: entry.publishedAt,
    dateModified: entry.updatedAt,
    mainEntityOfPage: getAbsoluteUrl(entry.path),
    author: {
      "@type": "Organization",
      name: siteConfig.brand.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.brand.name,
    },
  };
}

function getSimulatorBreadcrumbs(entry: SimulatorDefinition): BreadcrumbItem[] {
  return [
    { name: pageLabels.home, path: pagePaths.home },
    { name: pageLabels.simulators, path: pagePaths.simulators },
    { name: entry.name, path: entry.path },
  ];
}

function getSimulatorSchema(entry: SimulatorDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: entry.name,
    description: entry.seoDescription,
    url: getAbsoluteUrl(entry.path),
    about: entry.area,
  };
}

function getStaticPageDocument(page: Page): SeoDocument {
  const meta = corePageSeo[page];
  const canonicalPath = pagePaths[page];
  const breadcrumbs = getCoreBreadcrumbs(page);
  const shouldIndex = page !== "terms" && page !== "privacy";

  return {
    title: buildTitle(meta.title),
    description: meta.description,
    canonicalPath,
    canonicalUrl: getAbsoluteUrl(canonicalPath),
    ogType: "website",
    imageUrl: getAbsoluteUrl(siteConfig.seo.defaultOgImage),
    robots: shouldIndex ? "index,follow" : "noindex,follow",
    breadcrumbs,
    structuredData: [
      getWebsiteSchema(),
      getOrganizationSchema(),
      getBreadcrumbSchema(breadcrumbs),
    ],
  };
}

function getBlogIndexDocument(): SeoDocument {
  const breadcrumbs = [
    { name: pageLabels.home, path: pagePaths.home },
    { name: "Blog", path: pagePaths.blog },
  ];

  return {
    title: buildTitle(blogIndexMeta.title),
    description: blogIndexMeta.description,
    canonicalPath: blogIndexMeta.path,
    canonicalUrl: getAbsoluteUrl(blogIndexMeta.path),
    ogType: "website",
    imageUrl: getAbsoluteUrl(siteConfig.seo.defaultOgImage),
    robots: "index,follow",
    breadcrumbs,
    structuredData: [
      getWebsiteSchema(),
      getOrganizationSchema(),
      getBreadcrumbSchema(breadcrumbs),
    ],
  };
}

function getServiceDocument(entry: ServicePage): SeoDocument {
  const breadcrumbs = getContentBreadcrumbs(entry, entry.title);
  return {
    title: buildTitle(entry.title),
    description: entry.description,
    canonicalPath: entry.path,
    canonicalUrl: getAbsoluteUrl(entry.path),
    ogType: "article",
    imageUrl: getAbsoluteUrl(siteConfig.seo.defaultOgImage),
    robots: "index,follow",
    breadcrumbs,
    structuredData: [
      getWebsiteSchema(),
      getOrganizationSchema(),
      getBreadcrumbSchema(breadcrumbs),
      getServiceSchema(entry),
      getFaqSchema(entry),
    ],
  };
}

function getSimulatorDocument(entry: SimulatorDefinition): SeoDocument {
  const breadcrumbs = getSimulatorBreadcrumbs(entry);

  return {
    title: buildTitle(entry.seoTitle),
    description: entry.seoDescription,
    canonicalPath: entry.path,
    canonicalUrl: getAbsoluteUrl(entry.path),
    ogType: "website",
    imageUrl: getAbsoluteUrl(siteConfig.seo.defaultOgImage),
    robots: "index,follow",
    breadcrumbs,
    structuredData: [
      getWebsiteSchema(),
      getOrganizationSchema(),
      getBreadcrumbSchema(breadcrumbs),
      getSimulatorSchema(entry),
    ],
  };
}

function getBlogPostDocument(entry: BlogPost): SeoDocument {
  const breadcrumbs = getContentBreadcrumbs(entry, entry.title);
  return {
    title: buildTitle(entry.title),
    description: entry.description,
    canonicalPath: entry.path,
    canonicalUrl: getAbsoluteUrl(entry.path),
    ogType: "article",
    imageUrl: getAbsoluteUrl(siteConfig.seo.defaultOgImage),
    robots: "index,follow",
    breadcrumbs,
    structuredData: [
      getWebsiteSchema(),
      getOrganizationSchema(),
      getBreadcrumbSchema(breadcrumbs),
      getBlogSchema(entry),
      getFaqSchema(entry),
    ],
  };
}

function getNotFoundDocument(pathname: string): SeoDocument {
  return {
    title: buildTitle("Pagina nao encontrada"),
    description:
      "A pagina solicitada nao foi encontrada. Volte para a home, blog ou contato e siga para o conteudo principal do site.",
    canonicalPath: pathname,
    canonicalUrl: getAbsoluteUrl(pathname),
    ogType: "website",
    imageUrl: getAbsoluteUrl(siteConfig.seo.defaultOgImage),
    robots: "noindex,nofollow",
    breadcrumbs: [
      { name: pageLabels.home, path: pagePaths.home },
      { name: "Pagina nao encontrada", path: pathname },
    ],
    structuredData: [getWebsiteSchema(), getOrganizationSchema()],
  };
}

export function getSeoDocument(route: ResolvedRoute): SeoDocument {
  switch (route.kind) {
    case "core":
      return getStaticPageDocument(route.page);
    case "simulator-detail":
      return getSimulatorDocument(route.entry);
    case "blog-index":
      return getBlogIndexDocument();
    case "service":
      return getServiceDocument(route.entry);
    case "blog-post":
      return getBlogPostDocument(route.entry);
    case "not-found":
      return getNotFoundDocument(route.path);
  }
}

function ensureMeta(selector: string, create: () => HTMLElement) {
  const existing = document.head.querySelector(selector);
  if (existing) {
    return existing as HTMLElement;
  }

  const element = create();
  document.head.appendChild(element);
  return element;
}

function setMetaProperty(property: string, content: string) {
  const meta = ensureMeta(`meta[property="${property}"]`, () => {
    const element = document.createElement("meta");
    element.setAttribute("property", property);
    return element;
  });
  meta.setAttribute("content", content);
}

function setMetaName(name: string, content: string) {
  const meta = ensureMeta(`meta[name="${name}"]`, () => {
    const element = document.createElement("meta");
    element.setAttribute("name", name);
    return element;
  });
  meta.setAttribute("content", content);
}

export function applySeoDocument(documentData: SeoDocument) {
  document.title = documentData.title;

  setMetaName("description", documentData.description);
  setMetaName("robots", documentData.robots);
  setMetaName("twitter:card", "summary_large_image");
  setMetaName("twitter:title", documentData.title);
  setMetaName("twitter:description", documentData.description);
  setMetaName("twitter:image", documentData.imageUrl);

  setMetaProperty("og:title", documentData.title);
  setMetaProperty("og:description", documentData.description);
  setMetaProperty("og:type", documentData.ogType);
  setMetaProperty("og:url", documentData.canonicalUrl);
  setMetaProperty("og:image", documentData.imageUrl);

  const canonical = ensureMeta('link[rel="canonical"]', () => {
    const element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    return element;
  });
  canonical.setAttribute("href", documentData.canonicalUrl);

  document
    .querySelectorAll('script[data-seo-structured="true"]')
    .forEach((node) => node.remove());

  for (const item of documentData.structuredData) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seoStructured = "true";
    script.text = JSON.stringify(item);
    document.head.appendChild(script);
  }
}

export function buildHeadMarkup(documentData: SeoDocument) {
  const structuredData = documentData.structuredData
    .map(
      (item) =>
        `<script type="application/ld+json" data-seo-structured="true">${JSON.stringify(
          item
        )}</script>`
    )
    .join("");

  return [
    `<title>${escapeHtml(documentData.title)}</title>`,
    `<meta name="description" content="${escapeHtml(documentData.description)}" />`,
    `<meta name="robots" content="${escapeHtml(documentData.robots)}" />`,
    `<meta property="og:title" content="${escapeHtml(documentData.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(documentData.description)}" />`,
    `<meta property="og:type" content="${escapeHtml(documentData.ogType)}" />`,
    `<meta property="og:url" content="${escapeHtml(documentData.canonicalUrl)}" />`,
    `<meta property="og:image" content="${escapeHtml(documentData.imageUrl)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(documentData.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(documentData.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(documentData.imageUrl)}" />`,
    `<link rel="canonical" href="${escapeHtml(documentData.canonicalUrl)}" />`,
    structuredData,
  ].join("");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
