// ---------------------------------------------------------------------------
// CONFIGURAÇÃO CENTRAL DO SITE
// ---------------------------------------------------------------------------
// Dados factuais como OAB, e-mail e redes sociais devem ser preenchidos antes
// da publicação. O escritório não possui endereço físico; atendimento em SP/SP.
// ---------------------------------------------------------------------------

export const siteConfig = {
  lawyerName: "Pereira e Monteiro",
  lawyerFullName: "Pereira e Monteiro",
  firmName: "Pereira e Monteiro Advogados",
  firmNameFull: "Pereira e Monteiro Advogados Criminal",
  oab: "PREENCHER: OAB/UF nº 000.000",
  siteUrl: "https://www.pereiraemonteiroadvogados.com.br",
  email: "PREENCHER: contato@pereiraemonteiroadvogados.com.br",
  phoneDisplay: "+55 (11) 98439-4849",
  whatsappNumber: "5511984394849",
  whatsappMessage:
    "Olá, gostaria de falar com Pereira e Monteiro Advogados sobre uma questão jurídica.",
  address: {
    line1: "São Paulo – SP",
    line2: "Atendimento mediante contato prévio",
    mapsEmbedUrl: "",
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
  { label: "Áreas de Atuação", href: "/areas", children: [] },
  { label: "Atendimento", href: "/atendimento" },
  { label: "Conteúdos", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contato", href: "/contato" },
];

export function whatsappHref(customMessage?: string) {
  const msg = encodeURIComponent(customMessage ?? siteConfig.whatsappMessage);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${msg}`;
}
