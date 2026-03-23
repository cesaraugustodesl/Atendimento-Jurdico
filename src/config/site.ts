export type Page =
  | "home"
  | "how-it-works"
  | "areas"
  | "chat"
  | "contact"
  | "terms"
  | "privacy"
  | "simulator"
  | "simulators"
  | "blog";

export interface CorePageSeo {
  title: string;
  description: string;
}

export const siteConfig = {
  brand: {
    name: "Atendimento Juridico Inteligente",
    shortName: "Atendimento Juridico",
    tagline: "Triagem juridica clara, rapida e sem juridiques.",
  },
  contact: {
    whatsappNumber: "5511999999999",
    whatsappDisplay: "(11) 99999-9999",
    phoneDisplay: "(11) 9999-9999",
    email: "contato@exemplo.com.br",
    privacyEmail: "privacidade@exemplo.com.br",
    addressLine1: "Av. Exemplo, 1234 - Centro",
    addressLine2: "Sao Paulo - SP",
    addressFull: "Av. Exemplo, 1234 - Centro, Sao Paulo - SP",
    officeHours: "Segunda a Sexta, das 9h as 18h",
    registry: "OAB/SP 000.000",
  },
  seo: {
    siteUrl: "https://project-nu-one-39.vercel.app",
    defaultTitle: "Atendimento Juridico Inteligente",
    defaultDescription:
      "Triagem juridica com IA, simuladores juridicos, contato humano e conteudo pratico para organizar seu caso e decidir o proximo passo.",
    defaultOgImage: "/og-cover.svg",
    defaultOgType: "website",
  },
};

export const pageLabels: Record<Page, string> = {
  home: "Inicio",
  "how-it-works": "Como funciona",
  areas: "Areas de atuacao",
  chat: "Chat IA",
  contact: "Contato",
  terms: "Termos de uso",
  privacy: "Politica de privacidade",
  simulator: "Simulador trabalhista",
  simulators: "Simuladores",
  blog: "Blog",
};

export const pagePaths: Record<Page, string> = {
  home: "/",
  "how-it-works": "/como-funciona",
  areas: "/areas-de-atuacao",
  chat: "/chat-ia",
  contact: "/contato",
  terms: "/termos-de-uso",
  privacy: "/politica-de-privacidade",
  simulator: "/simulador-trabalhista",
  simulators: "/simuladores",
  blog: "/blog",
};

export const corePageSeo: Record<Page, CorePageSeo> = {
  home: {
    title: "Triagem juridica com IA, simulador trabalhista e consulta humana",
    description:
      "Entenda seu caso com linguagem clara, use o chat juridico, os simuladores juridicos e guias praticos para decidir entre triagem e atendimento humano.",
  },
  "how-it-works": {
    title: "Como funciona a triagem juridica e quando usar chat, simuladores ou contato",
    description:
      "Veja como funcionam o chat juridico, o hub de simuladores e o encaminhamento para atendimento humano em casos que pedem estrategia.",
  },
  areas: {
    title: "Areas de atuacao: trabalhista, familia, saude, contratos e golpes",
    description:
      "Conheca as principais areas atendidas, entenda em quais situacoes a triagem ajuda e quando vale levar o caso direto para analise humana.",
  },
  chat: {
    title: "Chat juridico com IA para triagem inicial e organizacao do caso",
    description:
      "Use o chat juridico para organizar fatos, documentos e proximos passos antes da consulta. Ideal para consumidor, familia, saude, contratos e golpes.",
  },
  contact: {
    title: "Contato para analise juridica humana",
    description:
      "Leve seu caso para atendimento humano quando houver urgencia, necessidade de estrategia, revisao documental ou depois de passar pelo chat e pelos simuladores.",
  },
  terms: {
    title: "Termos de uso da plataforma juridica",
    description:
      "Leia os termos de uso, limites da triagem inicial, responsabilidades da plataforma e orientacoes sobre uso correto do site.",
  },
  privacy: {
    title: "Politica de privacidade e tratamento inicial de dados",
    description:
      "Entenda como os dados sao tratados na triagem inicial, quais informacoes sao coletadas e como funciona a protecao de privacidade do site.",
  },
  simulator: {
    title: "Simulador trabalhista para estimar sinais de direitos nao pagos",
    description:
      "Simule sinais de credito trabalhista, organize informacoes sobre FGTS, horas extras, contrato e demissao e leve o caso para analise humana.",
  },
  simulators: {
    title: "Simuladores juridicos para triagem inicial de casos",
    description:
      "Acesse simuladores juridicos focados em dores especificas, como rescisao, horas extras, FGTS e golpe via PIX, para organizar o caso antes do atendimento humano.",
  },
  blog: {
    title: "Blog juridico com guias praticos para atrair e orientar usuarios",
    description:
      "Leia guias sobre trabalho, saude, familia, contratos e golpes para entender o caso, reunir documentos e melhorar a primeira consulta juridica.",
  },
};

export const pathToPage = Object.entries(pagePaths).reduce<Record<string, Page>>(
  (acc, [page, path]) => {
    acc[path] = page as Page;
    return acc;
  },
  {}
);

export const primaryNav: Array<{ id: Page; label: string; href: string }> = [
  { id: "home", label: "Inicio", href: pagePaths.home },
  { id: "simulators", label: "Simuladores", href: pagePaths.simulators },
  { id: "chat", label: "Chat IA", href: pagePaths.chat },
  { id: "areas", label: "Areas", href: pagePaths.areas },
  { id: "blog", label: "Blog", href: pagePaths.blog },
  { id: "contact", label: "Contato", href: pagePaths.contact },
];

export function normalizePath(pathname: string) {
  const sanitized = pathname.replace(/\/+$/, "");
  return sanitized || "/";
}

export function getPageFromPath(pathname: string): Page | undefined {
  return pathToPage[normalizePath(pathname)];
}

export function getAbsoluteUrl(pathname: string) {
  return `${siteConfig.seo.siteUrl}${pathname === "/" ? "" : pathname}`;
}

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}
