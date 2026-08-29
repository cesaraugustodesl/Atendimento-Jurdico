export type FaqItem = {
  question: string;
  answer: string;
  category: string;
};

export const faqItems: FaqItem[] = [
  {
    category: "Prisão em flagrante",
    question: "O que fazer imediatamente após uma prisão em flagrante?",
    answer:
      "O contato com um advogado deve ser feito o quanto antes, idealmente ainda durante a lavratura do auto de prisão em flagrante. A presença de um advogado nessa fase permite avaliar a legalidade do procedimento e orientar sobre os passos seguintes, incluindo a audiência de custódia.",
  },
  {
    category: "Audiência de custódia",
    question: "O que é a audiência de custódia e qual o seu prazo?",
    answer:
      "É a audiência em que a pessoa presa em flagrante é apresentada a um juiz, em regra em até 24 horas, para que sejam avaliadas a legalidade da prisão e a necessidade de sua manutenção ou de medidas alternativas.",
  },
  {
    category: "Habeas corpus",
    question: "Quando cabe a impetração de um habeas corpus?",
    answer:
      "O habeas corpus é cabível sempre que houver ameaça ou violação ilegal à liberdade de locomoção de uma pessoa, seja por prisão ilegal, seja por excesso de prazo ou outras ilegalidades processuais.",
  },
  {
    category: "Investigação criminal",
    question: "É possível ter um advogado durante o inquérito policial?",
    answer:
      "Sim. O investigado tem direito a acompanhamento técnico durante todo o inquérito policial, incluindo orientação para depoimentos, acesso aos autos e requerimento de diligências que possam ser relevantes para a defesa.",
  },
  {
    category: "Processo criminal",
    question: "Quanto tempo dura um processo criminal?",
    answer:
      "A duração varia conforme a complexidade do caso, o volume de provas, o número de réus e a fase em que o processo se encontra. Não é possível estimar um prazo genérico sem a análise concreta de cada situação.",
  },
  {
    category: "Tribunal do Júri",
    question: "Como funciona a defesa em um processo do Tribunal do Júri?",
    answer:
      "O processo é dividido em duas fases: a instrução preliminar, que define se o réu será ou não levado a julgamento popular (pronúncia), e o julgamento em plenário perante os jurados. Cada fase exige preparação técnica específica.",
  },
  {
    category: "Atendimento emergencial",
    question: "É possível atendimento fora do horário comercial?",
    answer:
      "Casos urgentes, como prisões em flagrante, são tratados em regime de prioridade. O contato inicial pode ser feito pelo WhatsApp para triagem imediata da urgência.",
  },
  {
    category: "Sigilo profissional",
    question: "As informações compartilhadas com o escritório são confidenciais?",
    answer:
      "Sim. O sigilo profissional é um dos princípios centrais da advocacia e é observado em todas as etapas do atendimento, da consulta inicial ao encerramento do caso.",
  },
  {
    category: "Consulta jurídica",
    question: "Como funciona a primeira consulta?",
    answer:
      "A primeira consulta é dedicada a entender o caso, esclarecer dúvidas iniciais e avaliar, em linhas gerais, as possibilidades de atuação. A partir daí, é possível definir os próximos passos de forma estruturada.",
  },
];
