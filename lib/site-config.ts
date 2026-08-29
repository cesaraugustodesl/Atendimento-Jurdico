// ---------------------------------------------------------------------------
// CONFIGURAÇÃO CENTRAL DO SITE
// ---------------------------------------------------------------------------
// Nome do escritório e da advogada são FICTÍCIOS (a pedido do cliente, para
// fins de desenvolvimento). Tudo o que é dado factual sensível — OAB,
// endereço, telefone, e-mail, avaliações, número de casos — é mantido como
// PLACEHOLDER explícito e deve ser substituído antes da publicação.
// Busque por "PREENCHER:" no projeto para achar todos os pontos pendentes.
// ---------------------------------------------------------------------------

export const siteConfig = {
  lawyerName: "Helena Marchetti",
  lawyerFullName: "Dra. Helena Marchetti",
  firmName: "Marchetti Advocacia",
  firmNameFull: "Marchetti Advocacia Criminal",
  oab: "PREENCHER: OAB/UF nº 000.000",
  siteUrl: "https://www.marchettiadvocacia.com.br", // PREENCHER: domínio definitivo
  email: "PREENCHER: contato@marchettiadvocacia.com.br",
  phoneDisplay: "PREENCHER: (00) 0000-0000",
  whatsappNumber: "5500000000000", // PREENCHER: DDI+DDD+número, apenas dígitos
  whatsappMessage:
    "Olá, gostaria de falar com a Dra. Helena Marchetti sobre uma questão jurídica.",
  address: {
    line1: "PREENCHER: Rua/Avenida, número, sala",
    line2: "PREENCHER: Bairro, Cidade – UF, CEP",
    mapsEmbedUrl: "PREENCHER: URL de incorporação do Google Maps",
  },
  hours: [
    { label: "Segunda a sexta", value: "9h às 18h" },
    { label: "Plantão criminal", value: "24 horas, mediante contato prévio" },
  ],
  social: {
    instagram: "PREENCHER: https://instagram.com/...",
    linkedin: "PREENCHER: https://linkedin.com/in/...",
  },
};

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const primaryNav: NavItem[] = [
  { label: "Sobre", href: "/sobre" },
  { label: "Direito Criminal", href: "/direito-criminal" },
  {
    label: "Áreas de Atuação",
    href: "/areas",
    children: [], // preenchido dinamicamente a partir de lib/areas-data.ts
  },
  { label: "Atendimento", href: "/atendimento" },
  { label: "Conteúdos", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contato", href: "/contato" },
];

export function whatsappHref(customMessage?: string) {
  const msg = encodeURIComponent(customMessage ?? siteConfig.whatsappMessage);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${msg}`;
}
