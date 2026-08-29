export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO
  readingTime: string;
  content: string[]; // parágrafos
};

export const blogCategories = [
  "Direito Criminal",
  "Processo Penal",
  "Direitos Fundamentais",
  "Prisão e Liberdade",
  "Tribunal do Júri",
  "Direito de Família",
  "Direito Civil",
  "Direito Empresarial",
  "Direito Digital",
];

export const blogPosts: BlogPost[] = [
  {
    slug: "audiencia-de-custodia-o-que-esperar",
    title: "Audiência de custódia: o que esperar nas primeiras 24 horas",
    excerpt:
      "Entenda o que é avaliado em uma audiência de custódia e por que a presença de um advogado nessa fase é determinante.",
    category: "Prisão e Liberdade",
    date: "2026-06-12",
    readingTime: "6 min",
    content: [
      "A audiência de custódia foi criada para garantir que toda pessoa presa em flagrante seja apresentada, em curto prazo, a um juiz. Nessa oportunidade, avalia-se não apenas a legalidade formal da prisão, mas também se existem indícios de tortura ou maus-tratos durante a abordagem.",
      "Durante a audiência, o juiz pode decidir por três caminhos principais: o relaxamento da prisão, quando ela é considerada ilegal; a concessão de liberdade provisória, com ou sem medidas cautelares alternativas; ou a manutenção da prisão preventiva, quando presentes os requisitos legais para tanto.",
      "A presença de um advogado nesse momento é determinante porque a argumentação apresentada — sobre primariedade, vínculos familiares, residência fixa e demais circunstâncias pessoais — influencia diretamente a decisão judicial. Cada caso exige uma análise própria, não sendo possível antecipar resultados.",
      "Se você ou alguém próximo está enfrentando essa situação, o ideal é buscar orientação jurídica com a maior brevidade possível, preferencialmente antes da realização da audiência.",
    ],
  },
  {
    slug: "diferenca-entre-prisao-temporaria-e-preventiva",
    title: "Prisão temporária e prisão preventiva: quais as diferenças",
    excerpt:
      "As duas modalidades de prisão cautelar têm requisitos e finalidades distintas. Veja como cada uma funciona.",
    category: "Processo Penal",
    date: "2026-05-28",
    readingTime: "5 min",
    content: [
      "A prisão temporária é cabível durante a fase de investigação, com prazo determinado, e tem por objetivo viabilizar diligências que exigem a presença do investigado sob custódia, em hipóteses específicas previstas em lei.",
      "Já a prisão preventiva pode ser decretada em qualquer fase da investigação ou do processo, desde que presentes requisitos como garantia da ordem pública, da instrução criminal ou aplicação da lei penal, sempre de forma fundamentada.",
      "Ambas são medidas excepcionais, e sua decretação deve observar os princípios da necessidade e da proporcionalidade. É possível, em determinados casos, requerer a substituição da prisão por medidas cautelares diversas.",
    ],
  },
  {
    slug: "como-funciona-o-tribunal-do-juri",
    title: "Como funciona o Tribunal do Júri, passo a passo",
    excerpt:
      "Do recebimento da denúncia ao julgamento em plenário: entenda as etapas de um processo de competência do júri popular.",
    category: "Tribunal do Júri",
    date: "2026-04-15",
    readingTime: "7 min",
    content: [
      "O processo perante o Tribunal do Júri é dividido em duas grandes fases. A primeira, chamada de judicium accusationis, tem como objetivo verificar se existem indícios suficientes de autoria e materialidade para levar o réu a julgamento popular.",
      "Ao final dessa primeira fase, o juiz pode pronunciar o réu, impronunciá-lo, absolvê-lo sumariamente ou desclassificar a conduta para outro crime que não seja de competência do júri.",
      "Sendo o réu pronunciado, inicia-se a segunda fase, que culmina no julgamento em plenário perante sete jurados sorteados. Nessa etapa, acusação e defesa apresentam seus argumentos oralmente, e os jurados decidem por meio de votação sigilosa.",
      "A preparação técnica para o plenário do júri é particularmente detalhada, pois envolve não apenas os aspectos jurídicos do caso, mas também a forma de apresentação dos argumentos a um corpo de jurados leigos.",
    ],
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
