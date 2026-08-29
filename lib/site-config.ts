// ---------------------------------------------------------------------------
// CONFIGURAÇÃO CENTRAL DO SITE
// ---------------------------------------------------------------------------
// Dados factuais como OAB, endereço, telefone, e-mail e redes sociais devem
// ser preenchidos antes da publicação.
// ---------------------------------------------------------------------------

export const siteConfig = {
  lawyerName: "Pereira e Monteiro",
  lawyerFullName: "Pereira e Monteiro",
  firmName: "Pereira e Monteiro Advogados",
  firmNameFull: "Pereira e Monteiro Advogados Criminal",
  oab: "PREENCHER: OAB/UF nº 000.000",
  siteUrl: "https://www.pereiraemonteiroadvogados.com.br", // PREENCHER: domínio definitivo
  email: "PREENCHER: contato@pereiraemonteiroadvogados.com.br",
  phoneDisplay: "PREENCHER: (00) 0000-0000",
  whatsappNumber: "5500000000000", // PREENCHER: DDI+DDD+número, apenas dígitos
  whatsappMessage:
    "Olá, gostaria de falar com Pereira e Monteiro Advogados sobre uma questão jurídica.",
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
