import { siteConfig } from "./site-config";

const address = {
  "@type": "PostalAddress",
  addressLocality: "São Paulo",
  addressRegion: "SP",
  addressCountry: "BR",
};

export function legalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: siteConfig.firmName,
    url: siteConfig.siteUrl,
    image: `${siteConfig.siteUrl}/og-image.jpg`,
    areaServed: { "@type": "City", name: "São Paulo" },
    address,
    telephone: siteConfig.phoneDisplay,
    founder: {
      "@type": "Person",
      name: siteConfig.lawyerFullName,
      jobTitle: "Advogada Criminalista",
    },
    knowsAbout: [
      "Direito Criminal",
      "Processo Penal",
      "Audiência de Custódia",
      "Habeas Corpus",
      "Inquérito Policial",
      "Tribunal do Júri",
    ],
  };
}

export function attorneySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.lawyerFullName,
    url: `${siteConfig.siteUrl}/sobre`,
    jobTitle: "Advogada Criminalista",
    worksFor: {
      "@type": "LegalService",
      name: siteConfig.firmName,
      url: siteConfig.siteUrl,
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.firmName,
    url: siteConfig.siteUrl,
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleSchema(post: {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: siteConfig.lawyerFullName,
      url: `${siteConfig.siteUrl}/sobre`,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.firmName,
      url: siteConfig.siteUrl,
    },
    mainEntityOfPage: `${siteConfig.siteUrl}/blog/${post.slug}`,
  };
}
