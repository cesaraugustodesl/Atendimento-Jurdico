export type CriminalClusterPage = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  bullets: string[];
  source?: { label: string; url: string }[];
};

const cpp = { label: "Código de Processo Penal — Planalto", url: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del3689compilado.htm" };

export const criminalCluster: CriminalClusterPage[] = [
  {
    slug: "advogado-criminalista-sao-paulo", title: "Advogado Criminalista em São Paulo", metaTitle: "Advogado Criminalista em São Paulo",
    description: "Atuação em Direito Criminal em São Paulo, com atendimento sigiloso, análise individual e defesa técnica nas diferentes fases da persecução penal.",
    intro: "A defesa criminal começa pela compreensão precisa dos fatos, da fase em que o caso se encontra e dos elementos já produzidos. A partir disso, são avaliados os riscos, os direitos envolvidos e as medidas juridicamente cabíveis.",
    sections: [
      { heading: "Quando procurar um advogado criminalista", paragraphs: ["A orientação pode ser necessária desde uma investigação, intimação ou abordagem policial até uma prisão, audiência ou ação penal em andamento. Procurar orientação cedo permite organizar documentos e evitar decisões tomadas sem conhecimento das consequências jurídicas.", "Em situações urgentes, como prisão em flagrante ou audiência de custódia, a prioridade é compreender imediatamente a situação processual e os instrumentos disponíveis."] },
      { heading: "Como funciona a análise do caso", paragraphs: ["O atendimento começa pela reconstrução dos fatos e pela identificação do procedimento existente. Depois são examinados documentos, decisões, provas disponíveis, prazos e possíveis medidas defensivas.", "Não existe estratégia universal. A medida adequada depende do conjunto probatório e do momento processual, e não de uma promessa prévia de resultado."] },
      { heading: "Atendimento em São Paulo", paragraphs: ["Pereira e Monteiro Advogados atua em São Paulo – SP, com atendimento mediante contato prévio. A comunicação é direta e o caso é tratado de forma individualizada, respeitando o sigilo profissional."] },
      { heading: "Principais frentes de atuação", paragraphs: ["A atuação criminal inclui investigação e inquérito policial, prisões e medidas cautelares, audiência de custódia, habeas corpus, ações penais e Tribunal do Júri, conforme a natureza do caso."] }
    ], bullets: ["Investigação e inquérito policial", "Prisão em flagrante e audiência de custódia", "Habeas corpus", "Defesa em ações penais", "Tribunal do Júri"], source: [cpp]
  },
  {
    slug: "audiencia-de-custodia", title: "Audiência de Custódia", metaTitle: "Audiência de Custódia | Defesa Criminal",
    description: "Entenda a audiência de custódia, seus objetivos, decisões possíveis e como a defesa criminal pode atuar após uma prisão.",
    intro: "A audiência de custódia integra o controle judicial da prisão. O Código de Processo Penal prevê a apresentação da pessoa presa ao juiz em até 24 horas e disciplina as decisões que podem ser tomadas após o auto de prisão em flagrante.",
    sections: [
      { heading: "O que acontece na audiência", paragraphs: ["O juiz analisa o auto de prisão e as circunstâncias apresentadas. Conforme o caso e os requisitos legais, pode relaxar uma prisão ilegal, converter o flagrante em preventiva ou conceder liberdade provisória, com ou sem fiança.", "A decisão depende das circunstâncias concretas e da fundamentação apresentada no procedimento; a audiência não representa garantia de liberdade ou de manutenção da prisão."] },
      { heading: "Como a defesa atua", paragraphs: ["A defesa verifica a legalidade da prisão, os elementos documentados e os fundamentos utilizados para eventual manutenção da custódia. Também apresenta os pedidos e elementos relevantes ao juiz.", "A legislação assegura entrevista prévia e reservada entre a pessoa presa e seu defensor, inclusive nas hipóteses de audiência por videoconferência."] },
      { heading: "O que acontece depois", paragraphs: ["A decisão da audiência não encerra necessariamente a questão criminal. Dependendo do resultado, pode ser necessário acompanhar investigação, ação penal ou novas decisões sobre medidas cautelares."] },
      { heading: "Por que a orientação rápida é importante", paragraphs: ["As primeiras horas concentram atos processuais relevantes. Ter a situação analisada permite identificar documentos, prazos e pedidos que precisam ser apresentados no momento adequado."] }
    ], bullets: ["Análise da legalidade da prisão", "Pedido de liberdade provisória", "Medidas cautelares diversas da prisão", "Análise de eventual prisão preventiva", "Orientação sobre os próximos atos"], source: [cpp]
  },
  {
    slug: "habeas-corpus", title: "Habeas Corpus", metaTitle: "Habeas Corpus | Defesa Criminal",
    description: "Orientação sobre habeas corpus e análise das hipóteses jurídicas relacionadas à liberdade de locomoção.",
    intro: "O habeas corpus é um instrumento voltado à proteção da liberdade de locomoção diante de ilegalidade ou abuso de poder. Seu cabimento depende das circunstâncias concretas e da autoridade competente.",
    sections: [
      { heading: "Quando pode ser utilizado", paragraphs: ["A análise é pertinente quando existe restrição ou ameaça concreta à liberdade que possa caracterizar constrangimento ilegal. O Código de Processo Penal disciplina o instituto e admite sua impetração em favor próprio ou de outra pessoa."] },
      { heading: "O que precisa ser analisado", paragraphs: ["É necessário examinar a decisão ou ato questionado, os fatos, documentos disponíveis, autoridade responsável e tribunal competente. A medida deve ser construída a partir do caso concreto."] },
      { heading: "Urgência e estratégia", paragraphs: ["Casos envolvendo liberdade exigem avaliação rápida. Isso não significa garantia de concessão: o resultado depende da análise judicial dos fundamentos apresentados e dos elementos existentes."] },
      { heading: "Habeas corpus não substitui toda defesa criminal", paragraphs: ["O instrumento possui finalidade específica. Quando a questão exige discussão probatória ampla ou outra providência processual, pode haver medida mais adequada. A escolha depende da situação jurídica analisada."] }
    ], bullets: ["Prisão preventiva", "Constrangimento ilegal", "Excesso de prazo quando juridicamente caracterizado", "Decisões que afetam a liberdade", "Análise de medidas cautelares"], source: [cpp]
  },
  {
    slug: "inquerito-policial", title: "Inquérito Policial", metaTitle: "Inquérito Policial | Defesa Criminal",
    description: "Atuação defensiva durante o inquérito policial, com análise de intimações, depoimentos, provas e medidas investigativas.",
    intro: "O inquérito policial reúne elementos destinados à apuração de uma possível infração penal. A atuação defensiva durante essa fase pode ser decisiva para preservar direitos e organizar a estratégia antes de eventual ação penal.",
    sections: [
      { heading: "Por que a investigação importa", paragraphs: ["Atos praticados durante a investigação podem influenciar a evolução do caso. Intimações, depoimentos, perícias e documentos devem ser avaliados dentro do contexto do procedimento."] },
      { heading: "Acesso aos elementos da investigação", paragraphs: ["O Código de Processo Penal assegura ao investigado e ao defensor acesso aos elementos informativos e provas produzidos no âmbito da investigação, ressalvadas, nos limites legais, diligências que ainda estejam em andamento."] },
      { heading: "Antes de prestar depoimento", paragraphs: ["A pessoa intimada deve compreender sua condição jurídica e seus direitos antes de prestar declarações. A orientação deve considerar o conteúdo da intimação e os fatos já conhecidos no procedimento."] },
      { heading: "Estratégia defensiva", paragraphs: ["A defesa pode acompanhar atos, analisar documentos, formular requerimentos cabíveis e preparar a atuação para eventual denúncia ou arquivamento, sempre conforme os elementos concretos da investigação."] }
    ], bullets: ["Análise de intimações", "Orientação para depoimentos", "Acompanhamento de investigação", "Análise de documentos e provas", "Medidas defensivas cabíveis"], source: [cpp]
  },
  {
    slug: "prisao-em-flagrante", title: "Prisão em Flagrante", metaTitle: "Prisão em Flagrante | Defesa Criminal",
    description: "Orientação jurídica após prisão em flagrante e análise das medidas defensivas cabíveis.",
    intro: "A prisão em flagrante exige resposta jurídica rápida. O Código de Processo Penal define as situações de flagrância e disciplina os atos que devem ocorrer depois da prisão.",
    sections: [
      { heading: "O que caracteriza o flagrante", paragraphs: ["A legislação considera em flagrante, entre outras hipóteses, quem está cometendo a infração, acaba de cometê-la, é perseguido logo após o fato nas condições legais ou é encontrado logo depois com elementos que façam presumir sua autoria."] },
      { heading: "O que acontece depois da prisão", paragraphs: ["É elaborado o auto de prisão em flagrante e a situação é submetida ao controle judicial. A audiência de custódia e as decisões posteriores devem observar os requisitos legais aplicáveis."] },
      { heading: "O que a defesa verifica", paragraphs: ["A análise inclui circunstâncias da abordagem, auto de prisão, depoimentos, documentos, eventual apreensão de objetos e fundamentos apresentados para manutenção da custódia."] },
      { heading: "Atuação imediata", paragraphs: ["A defesa pode orientar a pessoa presa, acompanhar os atos pertinentes e formular os pedidos cabíveis. A estratégia continua sendo revista conforme novos documentos e decisões sejam produzidos."] }
    ], bullets: ["Análise do auto de prisão", "Orientação ao custodiado", "Audiência de custódia", "Liberdade provisória", "Medidas cautelares"], source: [cpp]
  },
  {
    slug: "tribunal-do-juri", title: "Tribunal do Júri", metaTitle: "Tribunal do Júri | Defesa Criminal",
    description: "Defesa criminal em processos submetidos ao Tribunal do Júri, com preparação técnica e estratégica para cada etapa.",
    intro: "O Tribunal do Júri possui procedimento próprio e exige preparação específica. A estratégia defensiva deve partir das provas, da imputação e das decisões já tomadas no processo.",
    sections: [
      { heading: "Como funciona o procedimento", paragraphs: ["O procedimento do júri possui fases distintas até a sessão de julgamento. Cada etapa pode produzir decisões relevantes para a acusação e para a defesa, exigindo acompanhamento técnico."] },
      { heading: "Preparação da defesa", paragraphs: ["A preparação envolve estudo dos autos, análise das provas, avaliação das teses juridicamente possíveis e planejamento da atuação em plenário. A defesa deve trabalhar com os elementos efetivamente existentes no processo."] },
      { heading: "Atuação em plenário", paragraphs: ["No plenário, a defesa apresenta sua tese dentro das regras do procedimento e busca comunicar os pontos relevantes do processo de forma clara ao Conselho de Sentença."] },
      { heading: "Após o julgamento", paragraphs: ["A análise não termina necessariamente com o veredicto. Dependendo do resultado e das circunstâncias processuais, podem existir medidas ou recursos juridicamente cabíveis."] }
    ], bullets: ["Análise integral dos autos", "Construção da estratégia defensiva", "Preparação para plenário", "Atuação perante o Conselho de Sentença", "Análise de medidas posteriores"], source: [cpp]
  },
  {
    slug: "defesa-criminal", title: "Defesa Criminal", metaTitle: "Defesa Criminal | Pereira e Monteiro",
    description: "Defesa técnica em investigações e processos criminais, com estratégia personalizada, acompanhamento e comunicação clara.",
    intro: "Defesa criminal não é apenas participação em audiências. Envolve compreender a acusação, examinar as provas, identificar questões processuais e construir uma estratégia compatível com os fatos e com a legislação aplicável.",
    sections: [
      { heading: "Da investigação ao processo", paragraphs: ["A atuação pode começar antes da ação penal e continuar durante as diferentes fases do processo. O momento de entrada da defesa influencia quais medidas podem ser avaliadas."] },
      { heading: "Análise de provas", paragraphs: ["A defesa examina documentos, depoimentos, perícias e demais elementos disponíveis. A relevância de cada prova depende de sua origem, conteúdo, contexto e relação com os demais elementos do caso."] },
      { heading: "Estratégia individualizada", paragraphs: ["Não existe uma defesa criminal única. A estratégia deve considerar fatos, provas, decisões, prazos, riscos e objetivos juridicamente possíveis."] },
      { heading: "Transparência sobre riscos", paragraphs: ["Uma advocacia responsável não promete absolvição, liberdade ou outro resultado específico. O cliente deve conhecer alternativas, riscos e próximos passos antes das decisões relevantes."] }
    ], bullets: ["Investigações criminais", "Ações penais", "Prisões e medidas cautelares", "Audiências", "Recursos e acompanhamento processual"], source: [cpp]
  },
  {
    slug: "crimes-contra-a-pessoa", title: "Crimes Contra a Pessoa", metaTitle: "Crimes Contra a Pessoa | Defesa",
    description: "Atuação defensiva em investigações e processos relacionados a crimes contra a pessoa, conforme as provas e circunstâncias do caso.",
    intro: "Casos envolvendo crimes contra a pessoa podem apresentar elevada complexidade probatória e consequências relevantes. A defesa deve analisar os fatos e as provas antes de definir a estratégia.",
    sections: [
      { heading: "Análise individual do caso", paragraphs: ["A classificação jurídica depende dos fatos, das circunstâncias e das provas. A defesa deve evitar conclusões antecipadas e trabalhar com os elementos concretos da investigação ou do processo."] },
      { heading: "Provas e perícias", paragraphs: ["Depoimentos, documentos, registros e provas periciais podem ter papel relevante. A análise técnica considera a consistência dos elementos e sua compatibilidade com o restante dos autos."] },
      { heading: "Quando procurar orientação", paragraphs: ["Intimação, investigação, prisão, denúncia ou processo são situações em que a orientação de um advogado criminalista pode ajudar a compreender direitos, riscos e próximos passos."] },
      { heading: "Casos submetidos ao Júri", paragraphs: ["Quando a imputação estiver dentro da competência do Tribunal do Júri, a defesa exige preparação específica para as etapas do procedimento e eventual atuação em plenário."] }
    ], bullets: ["Homicídio", "Lesão corporal", "Ameaça", "Crimes submetidos ao Tribunal do Júri", "Investigações e ações penais"], source: [cpp]
  },
];

export function getCriminalClusterPage(slug: string) { return criminalCluster.find((page) => page.slug === slug); }
