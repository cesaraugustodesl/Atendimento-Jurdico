export interface ContentSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface ContentFaq {
  question: string;
  answer: string;
}

export interface ContentCta {
  title: string;
  text: string;
  href: string;
  label: string;
}

export interface ContentBase {
  slug: string;
  path: string;
  category: string;
  eyebrow: string;
  title: string;
  description: string;
  heroTitle: string;
  heroLead: string;
  intro: string[];
  sections: ContentSection[];
  faqs: ContentFaq[];
  relatedHrefs: string[];
  cta: ContentCta;
}

export interface ServicePage extends ContentBase {
  type: "service";
  searchIntent: string;
}

export interface BlogPost extends ContentBase {
  type: "blog";
  publishedAt: string;
  updatedAt: string;
  readTime: string;
}
