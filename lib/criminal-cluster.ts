export type CriminalClusterPage = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  bullets: string[];
};

export const criminalCluster: CriminalClusterPage[] = [
  {
    slug: "advogado-criminalista-sao-paulo",
    title: "Advogado Criminalista em São Paulo",
    metaTitle: "Advogado Criminalista em São Paulo",
    description: "Atuação em Direito Criminal em São Paulo, com atendimento sigiloso e estratégia jurídica personalizada.",
    intro: "A defesa criminal exige análise individual do caso, compreensão dos fatos e definição de estratégia compatível com o momento processual. O atendimento é direcionado a pessoas que precisam de orientação ou defesa técnica em São Paulo.",
    sections: [
      { heading: "Quando procurar um advogado criminalista", paragraphs: ["A orientação pode ser necessária desde uma investigação, intimação ou abordagem policial até uma ação penal já em andamento. Quanto antes os fatos forem analisados, maior a capacidade de organizar documentos, avaliar riscos e preservar direitos."] },
      { heading: "Como funciona a atuação", paragraphs: ["O trabalho começa pela compreensão dos fatos e documentos disponíveis. Em seguida, são avaliadas as medidas jurídicas cabíveis, os prazos relevantes e a estratégia de defesa adequada ao caso concreto."] },
      { heading: "Atendimento em São Paulo", paragraphs: ["O escritório atua em São Paulo – SP, com atendimento mediante contato prévio e comunicação direta com a advogada."] },
    ],
    bullets: ["Investigação e inquérito policial", "Prisão em flagrante e audiência de custódia", "Habeas corpus", "Defesa em ações penais", "Tribunal do Júri"],
  },
  {
    slug: "audiencia-de-custodia",
    title: "Audiência de Custódia",
    metaTitle: "Audiência de Custódia | Defesa Criminal",
    description: "Entenda a audiência de custódia, seus objetivos e como a defesa criminal pode atuar após uma prisão.",
    intro: "A audiência de custódia é o momento em que a prisão é submetida à apreciação judicial. A defesa pode apresentar argumentos e elementos relevantes para a análise da legalidade da prisão e das medidas cautelares cabíveis.",
    sections: [
      { heading: "O que acontece na audiência", paragraphs: ["O juiz analisa as circunstâncias da prisão e as informações apresentadas pelas partes, observando os requisitos legais aplicáveis ao caso."] },
      { heading: "Como a defesa pode atuar", paragraphs: ["A atuação depende das circunstâncias concretas, dos documentos disponíveis e dos fundamentos apresentados para a prisão. A defesa deve organizar os argumentos relevantes e requerer as providências juridicamente cabíveis."] },
      { heading: "Depois da audiência", paragraphs: ["A decisão pode exigir novas medidas defensivas. O caso deve continuar sendo acompanhado conforme a investigação ou processo avance."] },
    ],
    bullets: ["Análise da prisão", "Pedido de liberdade provisória", "Medidas cautelares", "Avaliação de eventual ilegalidade", "Orientação imediata à família"],
  },
  {
    slug: "habeas-corpus",
    title: "Habeas Corpus",
    metaTitle: "Habeas Corpus | Defesa Criminal",
    description: "Orientação sobre habeas corpus e análise das hipóteses jurídicas aplicáveis à liberdade de locomoção.",
    intro: "O habeas corpus é um instrumento constitucional destinado à proteção da liberdade de locomoção diante de ilegalidade ou abuso de poder, observados os requisitos jurídicos do caso.",
    sections: [
      { heading: "Quando pode ser utilizado", paragraphs: ["A possibilidade de impetração depende da existência de situação concreta que possa caracterizar constrangimento ilegal ou ameaça à liberdade, conforme a legislação e a jurisprudência aplicáveis."] },
      { heading: "O que precisa ser analisado", paragraphs: ["É necessário examinar a decisão ou ato questionado, os fatos, os documentos disponíveis e a autoridade responsável, definindo a medida processual adequada."] },
      { heading: "Cada caso exige análise própria", paragraphs: ["Habeas corpus não é uma solução automática. A estratégia deve considerar o processo, seus fundamentos e o entendimento aplicável ao tribunal competente."] },
    ],
    bullets: ["Prisão preventiva", "Excesso de prazo", "Constrangimento ilegal", "Decisões judiciais questionáveis", "Análise de medidas cautelares"],
  },
  {
    slug: "inquerito-policial",
    title: "Inquérito Policial",
    metaTitle: "Inquérito Policial | Defesa Criminal",
    description: "Atuação defensiva durante o inquérito policial, com análise de intimações, depoimentos e medidas investigativas.",
    intro: "O inquérito policial reúne elementos destinados à apuração de uma possível infração penal. A atuação defensiva desde a investigação pode ser relevante para proteger direitos e organizar a estratégia do caso.",
    sections: [
      { heading: "Por que a fase de investigação importa", paragraphs: ["Decisões e declarações tomadas durante a investigação podem influenciar etapas posteriores. Por isso, a análise jurídica deve ocorrer antes de medidas relevantes sempre que possível."] },
      { heading: "Como a defesa atua", paragraphs: ["A atuação pode envolver análise de intimações, acompanhamento de atos, requerimentos cabíveis, avaliação documental e orientação sobre depoimentos e demais providências."] },
      { heading: "Antes de prestar depoimento", paragraphs: ["A pessoa intimada deve compreender sua situação jurídica e seus direitos antes de prestar declarações, especialmente quando houver risco de autoincriminação."] },
    ],
    bullets: ["Análise de intimações", "Orientação para depoimentos", "Acompanhamento de investigação", "Análise de documentos", "Medidas defensivas cabíveis"],
  },
  {
    slug: "prisao-em-flagrante",
    title: "Prisão em Flagrante",
    metaTitle: "Prisão em Flagrante | Defesa Criminal",
    description: "Orientação jurídica após prisão em flagrante e análise das medidas defensivas cabíveis.",
    intro: "A prisão em flagrante exige resposta jurídica rápida. A análise deve considerar a legalidade da prisão, as circunstâncias registradas e as medidas que podem ser discutidas na sequência.",
    sections: [
      { heading: "O que deve ser analisado", paragraphs: ["É necessário examinar as circunstâncias da prisão, o auto de prisão em flagrante, os elementos disponíveis e os fundamentos utilizados pelas autoridades."] },
      { heading: "Atuação imediata", paragraphs: ["A defesa pode orientar o custodiado, acompanhar os atos cabíveis e preparar os pedidos adequados à situação concreta, inclusive para a audiência de custódia."] },
      { heading: "Prisão não encerra a estratégia", paragraphs: ["Após a prisão, o caso continua exigindo análise técnica. A estratégia pode mudar conforme novos documentos e decisões sejam incorporados ao procedimento."] },
    ],
    bullets: ["Análise do auto de prisão", "Orientação ao custodiado", "Audiência de custódia", "Liberdade provisória", "Medidas cautelares"],
  },
  {
    slug: "tribunal-do-juri",
    title: "Tribunal do Júri",
    metaTitle: "Tribunal do Júri | Defesa Criminal",
    description: "Defesa criminal em processos submetidos ao Tribunal do Júri, com preparação técnica e estratégica.",
    intro: "A atuação perante o Tribunal do Júri exige preparação específica, domínio dos elementos do processo e construção de uma estratégia defensiva coerente com as provas e com a tese jurídica do caso.",
    sections: [
      { heading: "Como funciona o Tribunal do Júri", paragraphs: ["Nos crimes dolosos contra a vida submetidos à competência do júri, a defesa participa de uma dinâmica processual própria, com etapas e decisões que precisam ser analisadas individualmente."] },
      { heading: "Preparação da defesa", paragraphs: ["A preparação envolve estudo dos autos, análise das provas, definição das teses possíveis e planejamento da atuação em plenário, respeitando os limites jurídicos e éticos da advocacia."] },
      { heading: "Atuação em plenário", paragraphs: ["A sustentação oral deve ser construída a partir dos elementos concretos do processo e apresentada de forma clara ao Conselho de Sentença."] },
    ],
    bullets: ["Análise integral dos autos", "Construção da estratégia defensiva", "Preparação para plenário", "Atuação perante o Conselho de Sentença", "Recursos e medidas posteriores"],
  },
  {
    slug: "defesa-criminal",
    title: "Defesa Criminal",
    metaTitle: "Defesa Criminal | Pereira e Monteiro",
    description: "Defesa técnica em investigações e processos criminais, com estratégia personalizada e acompanhamento do caso.",
    intro: "A defesa criminal deve ser construída sobre os fatos, as provas e o estágio do procedimento. O objetivo é garantir uma atuação técnica, estratégica e compatível com os direitos do cliente.",
    sections: [
      { heading: "Da investigação ao processo", paragraphs: ["A atuação pode começar antes da ação penal e continuar durante as diferentes fases do processo, sempre de acordo com as necessidades concretas do caso."] },
      { heading: "Estratégia individualizada", paragraphs: ["Não existe uma defesa criminal única. A análise deve considerar provas, versões, decisões judiciais, prazos e riscos específicos."] },
      { heading: "Comunicação com o cliente", paragraphs: ["O cliente deve compreender os próximos passos, as alternativas jurídicas e os riscos envolvidos, sem promessas de resultado."] },
    ],
    bullets: ["Investigações criminais", "Ações penais", "Prisões e medidas cautelares", "Audiências", "Recursos e acompanhamento processual"],
  },
  {
    slug: "crimes-contra-a-pessoa",
    title: "Crimes Contra a Pessoa",
    metaTitle: "Crimes Contra a Pessoa | Defesa",
    description: "Atuação defensiva em investigações e processos relacionados a crimes contra a pessoa.",
    intro: "Casos envolvendo crimes contra a pessoa podem apresentar elevada complexidade probatória e consequências relevantes. A defesa deve analisar os fatos e as provas antes de definir a estratégia.",
    sections: [
      { heading: "Análise do caso", paragraphs: ["A avaliação considera depoimentos, documentos, perícias, registros e demais elementos que possam influenciar a compreensão dos fatos."] },
      { heading: "Estratégia defensiva", paragraphs: ["A estratégia depende do tipo de imputação, da fase processual e dos elementos existentes nos autos. O trabalho é desenvolvido de forma individualizada."] },
      { heading: "Atuação técnica", paragraphs: ["A defesa acompanha as etapas relevantes e adota as medidas processuais cabíveis conforme a evolução do caso."] },
    ],
    bullets: ["Homicídio", "Lesão corporal", "Ameaça", "Crimes submetidos ao Tribunal do Júri", "Investigações e ações penais"],
  },
];

export function getCriminalClusterPage(slug: string) {
  return criminalCluster.find((page) => page.slug === slug);
}
