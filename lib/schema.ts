import { siteConfig } from "./site-config";

export function legalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: siteConfig.firmNameFull,
    url: siteConfig.siteUrl,
    image: `${siteConfig.siteUrl}/og-image.jpg`,
    priceRange: "$$",
    areaServed: "BR",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.line1,
      addressLocality: siteConfig.address.line2,
      addressCountry: "BR",
    },
    telephone: siteConfig.phoneDisplay,
    email: siteConfig.email,
    founder: {
      "@type": "Person",
      name: siteConfig.lawyerFullName,
      jobTitle: "Advogada",
    },
    knowsAbout: [
      "Direito Criminal",
      "Processo Penal",
      "Direito de Família",
      "Direito Civil",
      "Direito Empresarial",
    ],
  };
}

export function attorneySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Attorney",
    name: siteConfig.lawyerFullName,
    url: `${siteConfig.siteUrl}/sobre`,
    image: `${siteConfig.siteUrl}/images/advogada.jpg`,
    jobTitle: "Advogada Criminalista",
    worksFor: {
      "@type": "Organization",
      name: siteConfig.firmNameFull,
    },
    memberOf: {
      "@type": "Organization",
      name: "Ordem dos Advogados do Brasil",
    },
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
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
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.firmNameFull,
    },
    mainEntityOfPage: `${siteConfig.siteUrl}/blog/${post.slug}`,
  };
}
