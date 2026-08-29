export type AreaTopic = {
  slug: string;
  code: string; // referência estilo "codificação legal", ex.: "ART. 2"
  title: string;
  shortDescription: string;
  metaDescription: string;
  intro: string;
  atuacao: string[];
};

export const areas: AreaTopic[] = [
  {
    slug: "direito-de-familia",
    code: "ART. 2",
    title: "Direito de Família",
    shortDescription:
      "Condução discreta e estratégica de questões familiares, com foco em soluções equilibradas.",
    metaDescription:
      "Advocacia em Direito de Família: divórcio, guarda, pensão alimentícia, partilha de bens e planejamento sucessório com atendimento personalizado e sigiloso.",
    intro:
      "Questões de família reúnem, ao mesmo tempo, aspectos patrimoniais, emocionais e de convívio. A atuação nessa área é conduzida com discrição e clareza técnica, priorizando soluções que preservem relações familiares sempre que possível, sem abrir mão da defesa firme dos interesses do cliente quando o litígio é inevitável.",
    atuacao: [
      "Divórcio consensual e litigioso",
      "Guarda, convivência e regulamentação de visitas",
      "Pensão alimentícia — fixação, revisão e execução",
      "Partilha de bens e União Estável",
      "Reconhecimento e dissolução de união estável",
      "Planejamento sucessório e inventário",
    ],
  },
  {
    slug: "direito-civil",
    code: "ART. 3",
    title: "Direito Civil",
    shortDescription:
      "Atuação em obrigações, responsabilidade civil e relações patrimoniais entre particulares.",
    metaDescription:
      "Advocacia em Direito Civil: responsabilidade civil, indenizações, obrigações e ações possessórias com atuação técnica e estratégica.",
    intro:
      "O Direito Civil regula boa parte das relações cotidianas entre pessoas e empresas. A atuação abrange desde a prevenção de conflitos até a condução de ações judiciais, sempre com avaliação criteriosa de riscos e viabilidade antes de qualquer medida.",
    atuacao: [
      "Ações de responsabilidade civil e reparação de danos",
      "Cobranças e execução de dívidas",
      "Ações possessórias e questões de propriedade",
      "Revisão e anulação de contratos e negócios jurídicos",
      "Direito de vizinhança",
    ],
  },
  {
    slug: "direito-empresarial",
    code: "ART. 4",
    title: "Direito Empresarial",
    shortDescription:
      "Suporte jurídico a empresas em constituição, contratos, governança e contencioso.",
    metaDescription:
      "Advocacia empresarial: constituição societária, contratos comerciais, compliance e contencioso empresarial para empresas de todos os portes.",
    intro:
      "Empresas enfrentam riscos jurídicos em praticamente todas as etapas de sua operação. A atuação empresarial combina consultoria preventiva — voltada a reduzir exposição — com defesa técnica em eventuais disputas comerciais e societárias.",
    atuacao: [
      "Constituição, alteração e dissolução societária",
      "Elaboração e revisão de contratos comerciais",
      "Compliance e prevenção de riscos jurídicos",
      "Disputas societárias entre sócios",
      "Recuperação de crédito empresarial",
      "Responsabilidade penal de sócios e administradores em crimes empresariais",
    ],
  },
  {
    slug: "direito-trabalhista",
    code: "ART. 5",
    title: "Direito Trabalhista",
    shortDescription:
      "Defesa de empregadores e trabalhadores em questões de relação de emprego.",
    metaDescription:
      "Advocacia trabalhista: rescisões, verbas rescisórias, assédio moral, acordos e defesa em reclamações trabalhistas.",
    intro:
      "As relações de trabalho envolvem regras específicas e prazos rígidos. A atuação trabalhista abrange tanto a orientação preventiva para empregadores quanto a defesa de direitos de trabalhadores, com avaliação realista das chances de êxito em cada caso.",
    atuacao: [
      "Reclamações trabalhistas — defesa e propositura",
      "Rescisão contratual e verbas rescisórias",
      "Assédio moral e sexual no ambiente de trabalho",
      "Acordos extrajudiciais e homologação",
      "Consultoria preventiva para empregadores",
    ],
  },
  {
    slug: "direito-previdenciario",
    code: "ART. 6",
    title: "Direito Previdenciário",
    shortDescription:
      "Orientação e defesa em benefícios do INSS e planejamento previdenciário.",
    metaDescription:
      "Advocacia previdenciária: aposentadoria, benefícios por incapacidade, revisões de benefício e planejamento previdenciário.",
    intro:
      "O sistema previdenciário é técnico e sujeito a mudanças constantes de regras. A atuação nessa área busca orientar o segurado sobre a melhor estratégia para reconhecimento e revisão de benefícios junto ao INSS, inclusive por via judicial quando necessário.",
    atuacao: [
      "Aposentadoria por tempo de contribuição, idade e especial",
      "Benefícios por incapacidade (auxílio-doença e invalidez)",
      "Revisão de benefícios já concedidos",
      "Planejamento previdenciário",
      "Recursos administrativos e ações judiciais contra o INSS",
    ],
  },
  {
    slug: "direito-imobiliario",
    code: "ART. 7",
    title: "Direito Imobiliário",
    shortDescription:
      "Segurança jurídica em compra, venda, locação e regularização de imóveis.",
    metaDescription:
      "Advocacia imobiliária: contratos de compra e venda, locação, usucapião, regularização e disputas imobiliárias.",
    intro:
      "Operações envolvendo imóveis costumam representar valores expressivos e exigem análise documental rigorosa. A atuação imobiliária busca prevenir litígios por meio de due diligence e contratos bem redigidos, e conduzir com firmeza os casos em que o conflito já existe.",
    atuacao: [
      "Contratos de compra, venda e permuta de imóveis",
      "Locação residencial e comercial",
      "Usucapião e regularização fundiária",
      "Due diligence imobiliária",
      "Disputas condominiais e possessórias",
    ],
  },
  {
    slug: "direito-do-consumidor",
    code: "ART. 8",
    title: "Direito do Consumidor",
    shortDescription:
      "Defesa de consumidores e empresas em relações de consumo.",
    metaDescription:
      "Advocacia em Direito do Consumidor: cobranças indevidas, vícios de produto e serviço, negativação indevida e ações contra fornecedores.",
    intro:
      "As relações de consumo têm proteção legal específica, com regras próprias de responsabilidade. A atuação abrange tanto a defesa de consumidores lesados quanto a orientação de empresas para adequação às normas consumeristas.",
    atuacao: [
      "Cobrança e negativação indevida",
      "Vícios e defeitos em produtos e serviços",
      "Práticas abusivas e publicidade enganosa",
      "Ações contra instituições financeiras e planos de saúde",
      "Adequação de empresas ao Código de Defesa do Consumidor",
    ],
  },
  {
    slug: "direito-contratual",
    code: "ART. 9",
    title: "Direito Contratual",
    shortDescription:
      "Elaboração, revisão e defesa técnica de contratos de qualquer natureza.",
    metaDescription:
      "Advocacia contratual: elaboração, revisão, negociação e disputas contratuais com foco em segurança jurídica.",
    intro:
      "Um contrato bem estruturado é a principal ferramenta de prevenção de litígios. A atuação contratual envolve elaboração e revisão criteriosa de instrumentos, negociação de cláusulas sensíveis e, quando necessário, a defesa judicial de direitos contratuais violados.",
    atuacao: [
      "Elaboração e revisão de contratos diversos",
      "Negociação de cláusulas e condições contratuais",
      "Rescisão contratual e cláusulas penais",
      "Ações de cumprimento e revisão contratual",
      "Análise de riscos pré-contratuais",
    ],
  },
  {
    slug: "lgpd-direito-digital",
    code: "ART. 10",
    title: "LGPD e Direito Digital",
    shortDescription:
      "Adequação à Lei Geral de Proteção de Dados e proteção jurídica no ambiente digital.",
    metaDescription:
      "Advocacia em LGPD e Direito Digital: adequação de empresas, incidentes de dados, crimes digitais e proteção de direitos no ambiente online.",
    intro:
      "A transformação digital trouxe novos riscos jurídicos, tanto para empresas quanto para pessoas físicas. A atuação em LGPD e Direito Digital combina adequação preventiva de empresas às exigências legais com resposta técnica a incidentes e violações no ambiente digital.",
    atuacao: [
      "Adequação de empresas à LGPD",
      "Elaboração de políticas de privacidade e termos de uso",
      "Resposta a incidentes e vazamento de dados",
      "Crimes digitais — assessoria à vítima e defesa",
      "Remoção de conteúdo e proteção de imagem na internet",
    ],
  },
  {
    slug: "consultoria-juridica-preventiva",
    code: "ART. 11",
    title: "Consultoria Jurídica Preventiva",
    shortDescription:
      "Orientação contínua para reduzir riscos jurídicos antes que se tornem litígios.",
    metaDescription:
      "Consultoria jurídica preventiva para pessoas físicas e empresas: análise de riscos, pareceres e acompanhamento contínuo.",
    intro:
      "Grande parte dos litígios pode ser evitada com orientação jurídica prévia. A consultoria preventiva funciona como um acompanhamento contínuo, permitindo que decisões pessoais e empresariais sejam tomadas com respaldo técnico, antes que um problema se instale.",
    atuacao: [
      "Pareceres jurídicos sob demanda",
      "Acompanhamento contínuo de questões jurídicas",
      "Análise prévia de riscos em decisões e negócios",
      "Orientação a empresas em rotinas de compliance",
      "Suporte jurídico recorrente para pessoas físicas",
    ],
  },
];

export function getAreaBySlug(slug: string) {
  return areas.find((a) => a.slug === slug);
}
