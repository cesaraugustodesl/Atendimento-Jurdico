export type Page =
  | "home" | "how-it-works" | "areas" | "chat" | "contact" | "client-area"
  | "office-panel" | "terms" | "privacy" | "simulator" | "simulators" | "blog";

export interface CorePageSeo { title: string; description: string; }

export const siteConfig = {
  brand: {
    name: "Pereira e Monteiro Advogados",
    shortName: "Pereira e Monteiro",
    tagline: "Advocacia estratégica para decisões que exigem experiência.",
  },
  contact: {
    whatsappNumber: "5511984394849",
    whatsappDisplay: "(11) 98439-4849",
    phoneDisplay: "(11) 98439-4849",
    email: "abrunamonteiro@gmail.com",
    privacyEmail: "abrunamonteiro@gmail.com",
    people: [
      { name: "Bruna Monteiro", phone: "+55 11 98439-4849", phoneDisplay: "(11) 98439-4849", whatsappNumber: "5511984394849", email: "abrunamonteiro@gmail.com" },
      { name: "Dulce Santos", phone: "+55 11 98749-9113", phoneDisplay: "(11) 98749-9113", whatsappNumber: "5511987499113", email: "dulcepereirasantos94@gmail.com" },
    ],
    addressLine1: "[ENDEREÇO DO ESCRITÓRIO]",
    addressLine2: "[CIDADE/UF]",
    addressFull: "[ENDEREÇO COMPLETO — PREENCHER]",
    officeHours: "Segunda a Sexta, das 9h às 18h",
    registry: "[OAB — PREENCHER]",
  },
  seo: {
    siteUrl: "https://www.pereiraemonteiroadvogados.com.br",
    defaultTitle: "Pereira e Monteiro Advogados | Direito Criminal",
    defaultDescription: "Advocacia estratégica, personalizada e sigilosa, com atuação em Direito Criminal e demais áreas jurídicas.",
    defaultOgImage: "/og-cover.svg",
    defaultOgType: "website",
  },
  portal: { clientAreaPath: "/area-do-cliente", officePanelPath: "/painel-do-escritorio" },
};

export const pageLabels: Record<Page, string> = {
  home: "Início", "how-it-works": "Atendimento", areas: "Áreas de atuação", chat: "Orientação", contact: "Contato",
  "client-area": "Área do Cliente", "office-panel": "Painel do Escritório", terms: "Termos de uso", privacy: "Privacidade",
  simulator: "Simulador", simulators: "Simuladores", blog: "Conteúdos",
};

export const pagePaths: Record<Page, string> = {
  home: "/", "how-it-works": "/como-funciona", areas: "/areas-de-atuacao", chat: "/orientacao",
  contact: "/contato", "client-area": siteConfig.portal.clientAreaPath, "office-panel": siteConfig.portal.officePanelPath,
  terms: "/termos-de-uso", privacy: "/politica-de-privacidade", simulator: "/simulador-trabalhista", simulators: "/simuladores", blog: "/blog",
};

export const corePageSeo: Record<Page, CorePageSeo> = {
  home: { title: "Pereira e Monteiro Advogados | Direito Criminal", description: "Advocacia estratégica para decisões que exigem experiência. Atuação personalizada, técnica e sigilosa, com destaque para Direito Criminal." },
  "how-it-works": { title: "Como funciona o atendimento | Pereira e Monteiro Advogados", description: "Conheça o processo de atendimento: primeiro contato, análise do caso, reunião estratégica, definição da atuação e acompanhamento jurídico." },
  areas: { title: "Áreas de atuação | Pereira e Monteiro Advogados", description: "Conheça a atuação do escritório em Direito Criminal, Família, Civil, Empresarial, Trabalhista, Previdenciário, Imobiliário e Direito Digital." },
  chat: { title: "Orientação jurídica | Pereira e Monteiro Advogados", description: "Entre em contato para uma avaliação inicial e encaminhamento adequado da sua demanda jurídica." },
  contact: { title: "Contato | Pereira e Monteiro Advogados", description: "Solicite atendimento jurídico personalizado, com discrição e análise individualizada do seu caso." },
  "client-area": { title: "Área do Cliente | Pereira e Monteiro Advogados", description: "Acesso reservado para clientes do escritório." },
  "office-panel": { title: "Painel do Escritório | Pereira e Monteiro Advogados", description: "Área interna do escritório." },
  terms: { title: "Termos de uso | Pereira e Monteiro Advogados", description: "Termos de utilização do site." },
  privacy: { title: "Política de privacidade | Pereira e Monteiro Advogados", description: "Informações sobre privacidade e tratamento de dados." },
  simulator: { title: "Simulador | Pereira e Monteiro Advogados", description: "Ferramenta de apoio à orientação jurídica." },
  simulators: { title: "Recursos jurídicos | Pereira e Monteiro Advogados", description: "Recursos informativos e ferramentas jurídicas." },
  blog: { title: "Conteúdos jurídicos | Pereira e Monteiro Advogados", description: "Artigos e conteúdos jurídicos produzidos para informar com clareza e responsabilidade." },
};

export const pathToPage = Object.entries(pagePaths).reduce<Record<string, Page>>((acc, [page, path]) => { acc[path] = page as Page; return acc; }, {});
export const primaryNav: Array<{ id: Page; label: string; href: string }> = [
  { id: "home", label: "Início", href: pagePaths.home },
  { id: "areas", label: "Áreas de atuação", href: pagePaths.areas },
  { id: "how-it-works", label: "Atendimento", href: pagePaths["how-it-works"] },
  { id: "blog", label: "Conteúdos", href: pagePaths.blog },
  { id: "contact", label: "Contato", href: pagePaths.contact },
];
export function normalizePath(pathname: string) { const sanitized = pathname.replace(/\/+$/, ""); return sanitized || "/"; }
export function getPageFromPath(pathname: string): Page | undefined { return pathToPage[normalizePath(pathname)]; }
export function getAbsoluteUrl(pathname: string) { return `${siteConfig.seo.siteUrl}${pathname === "/" ? "" : pathname}`; }
export function buildWhatsAppLink(message: string) { return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(message)}`; }
