export type Page =
  | "home"
  | "how-it-works"
  | "areas"
  | "chat"
  | "contact"
  | "terms"
  | "privacy"
  | "simulator";

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
    defaultTitle: "Atendimento Juridico Inteligente",
    defaultDescription:
      "Entenda seu caso com linguagem clara, organize documentos e decida o proximo passo com apoio de IA e atendimento humano.",
  },
};

export const pageTitles: Record<Page, string> = {
  home: "Inicio",
  "how-it-works": "Como Funciona",
  areas: "Areas de Atuacao",
  chat: "Chat IA",
  contact: "Contato",
  terms: "Termos de Uso",
  privacy: "Politica de Privacidade",
  simulator: "Simulador Trabalhista",
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
};

export const pathToPage = Object.entries(pagePaths).reduce<Record<string, Page>>(
  (acc, [page, path]) => {
    acc[path] = page as Page;
    return acc;
  },
  {}
);

export const primaryNav: Array<{ id: Page; label: string }> = [
  { id: "home", label: "Inicio" },
  { id: "simulator", label: "Simulador" },
  { id: "chat", label: "Chat IA" },
  { id: "areas", label: "Areas" },
  { id: "how-it-works", label: "Como funciona" },
  { id: "contact", label: "Contato" },
];

export function getPageFromPath(pathname: string): Page {
  const sanitized = pathname.replace(/\/+$/, "") || "/";
  return pathToPage[sanitized] ?? "home";
}

export function getDocumentTitle(page: Page): string {
  const label = pageTitles[page];
  return page === "home"
    ? siteConfig.seo.defaultTitle
    : `${label} | ${siteConfig.brand.name}`;
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}
