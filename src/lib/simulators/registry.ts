import { pagePaths } from "../../config/site";
import {
  computeResult as computeLaborResult,
  type ContractType,
  type Violations,
} from "../../utils/laborCalculator";
import type {
  LeadClassification,
  SimulatorDefinition,
  SimulatorFormValues,
  SimulatorOutcome,
} from "./types";

const yesNoOptions = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Nao" },
];

const laborViolationOptions = [
  {
    value: "horasExtrasNaoPagas",
    label: "Horas extras nao pagas",
    description: "Trabalhava alem do horario e nao recebia corretamente.",
  },
  {
    value: "domingosFeriados",
    label: "Domingos e feriados",
    description: "Trabalhava sem folga compensatoria adequada.",
  },
  {
    value: "intervaloIrregular",
    label: "Intervalo irregular",
    description: "Almoco ou descanso menor do que o devido.",
  },
  {
    value: "trabalhoNoturno",
    label: "Trabalho noturno",
    description: "Atuava apos as 22h sem adicional correto.",
  },
  {
    value: "insalubridade",
    label: "Insalubridade ou periculosidade",
    description: "Havia risco ou agente nocivo sem adicional devido.",
  },
  {
    value: "fgtsNaoPago",
    label: "FGTS nao depositado",
    description: "O extrato indica ausencia ou irregularidade de depositos.",
  },
  {
    value: "demissaoProblematica",
    label: "Demissao irregular",
    description: "As verbas rescisorias nao foram pagas como deveriam.",
  },
  {
    value: "tempoMaisTresAnos",
    label: "Mais de 3 anos na empresa",
    description: "Tempo maior de contrato tende a aumentar a exposicao financeira.",
  },
];

function toNumber(values: SimulatorFormValues, key: string) {
  const value = values[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function toText(values: SimulatorFormValues, key: string) {
  const value = values[key];
  return typeof value === "string" ? value : "";
}

function toList(values: SimulatorFormValues, key: string) {
  const value = values[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function classificationFromScore(score: number): LeadClassification {
  if (score <= 34) {
    return "baixa";
  }

  if (score <= 67) {
    return "media";
  }

  return "alta";
}

function potentialLabel(classification: LeadClassification) {
  if (classification === "alta") {
    return "Potencial inicial alto";
  }

  if (classification === "media") {
    return "Potencial inicial medio";
  }

  return "Potencial inicial baixo";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function asYes(value: string) {
  return value === "sim";
}

function buildLaborViolations(selected: string[]): Violations {
  return {
    horasExtrasNaoPagas: selected.includes("horasExtrasNaoPagas"),
    domingosFeriados: selected.includes("domingosFeriados"),
    intervaloIrregular: selected.includes("intervaloIrregular"),
    trabalhoNoturno: selected.includes("trabalhoNoturno"),
    insalubridade: selected.includes("insalubridade"),
    fgtsNaoPago: selected.includes("fgtsNaoPago"),
    demissaoProblematica: selected.includes("demissaoProblematica"),
    tempoMaisTresAnos: selected.includes("tempoMaisTresAnos"),
  };
}

function buildWorkSummary(values: SimulatorFormValues) {
  const salary = toNumber(values, "salary");
  const yearsWorked = toNumber(values, "yearsWorked");
  return `${yearsWorked} ano${yearsWorked === 1 ? "" : "s"} de contrato e salario aproximado de ${formatCurrency(
    salary
  )}`;
}

function computeLaborGeneral(values: SimulatorFormValues): SimulatorOutcome {
  const contractType = (toText(values, "contractType") || "clt") as ContractType;
  const salary = toNumber(values, "salary");
  const yearsWorked = toNumber(values, "yearsWorked");
  const selectedViolations = toList(values, "violations");
  const violations = buildLaborViolations(selectedViolations);
  const result = computeLaborResult({
    contractType,
    salary,
    yearsWorked,
    violations,
    name: "",
    whatsapp: "",
    email: "",
  });

  return {
    score: result.score,
    classification: result.classification,
    potentialLabel: potentialLabel(result.classification),
    summary: `${result.contractInsight} Base informada: ${buildWorkSummary(values)}.`,
    findings:
      result.identifiedRights.length > 0
        ? result.identifiedRights
        : ["Nenhum sinal forte foi marcado na triagem trabalhista inicial."],
    recommendations: [
      "Separe carteira, holerites, extrato do FGTS, espelho de ponto e mensagens relevantes.",
      "Compare o periodo trabalhado com os direitos efetivamente pagos para validar as teses.",
      "Se houver prazo correndo apos o fim do contrato, priorize atendimento humano.",
    ],
    caution:
      "A faixa abaixo e preliminar. Valor real depende de documentos, periodo exato e estrategia juridica.",
    estimate: {
      label: "Faixa estimada preliminar",
      min: result.estimateMin,
      max: result.estimateMax,
      helper: "Leitura inicial baseada nos sinais informados no formulario.",
    },
    comparisonTags: selectedViolations,
    whatsappSummary: `Triagem trabalhista geral com score ${result.score}/100 e sinais como ${result.identifiedRights
      .slice(0, 3)
      .join(", ") || "poucos indicios fortes"}.`,
  };
}

function computeTermination(values: SimulatorFormValues): SimulatorOutcome {
  const dismissalType = toText(values, "dismissalType");
  const salary = toNumber(values, "salary");
  const yearsWorked = toNumber(values, "yearsWorked");
  const receivedAll = asYes(toText(values, "receivedAll"));
  const noticePaid = asYes(toText(values, "noticePaid"));
  const fgtsDeposited = asYes(toText(values, "fgtsDeposited"));
  const multaPaid = asYes(toText(values, "multaPaid"));
  const vacationPending = asYes(toText(values, "vacationPending"));
  const thirteenthPending = asYes(toText(values, "thirteenthPending"));

  const monthsWorked = Math.max(1, Math.round(yearsWorked * 12));
  const fgtsBase = salary * 0.08 * monthsWorked;
  let estimate = 0;
  let score = 18;
  const findings: string[] = [];
  const comparisonTags: string[] = ["demissaoProblematica"];

  if (!receivedAll) {
    estimate += salary;
    score += 18;
    findings.push("Ha indicio de verbas rescisorias pendentes.");
  }

  if (!noticePaid && dismissalType !== "pedido-demissao") {
    estimate += salary;
    score += 10;
    findings.push("Aviso previo pode nao ter sido pago corretamente.");
  }

  if (vacationPending) {
    estimate += salary * 1.33;
    score += 8;
    findings.push("Ferias vencidas ou proporcionais podem estar em aberto.");
  }

  if (thirteenthPending) {
    estimate += salary * 0.5;
    score += 8;
    findings.push("Ha sinal de 13o proporcional ou saldo nao quitado.");
  }

  if (!fgtsDeposited) {
    estimate += fgtsBase;
    score += 16;
    comparisonTags.push("fgtsNaoPago");
    findings.push("Depositos de FGTS parecem irregulares ou ausentes.");
  }

  if (!multaPaid && dismissalType !== "pedido-demissao") {
    estimate += fgtsBase * 0.4;
    score += 10;
    findings.push("A multa de 40% do FGTS pode nao ter sido paga.");
  }

  if (yearsWorked >= 3) {
    score += 6;
    comparisonTags.push("tempoMaisTresAnos");
  }

  if (dismissalType === "sem-justa-causa") {
    score += 8;
  }

  const finalScore = clampScore(score);
  const classification = classificationFromScore(finalScore);

  return {
    score: finalScore,
    classification,
    potentialLabel: potentialLabel(classification),
    summary: `A triagem indica uma rescisao com pontos de revisao em ${dismissalType.replace(
      /-/g,
      " "
    )}, considerando ${buildWorkSummary(values)}.`,
    findings:
      findings.length > 0
        ? findings
        : ["Pelos dados informados, nao apareceu um indicio forte de diferenca rescisoria relevante."],
    recommendations: [
      "Reuna TRCT, comprovante de saque do FGTS, chave de conectividade e holerites finais.",
      "Confira se saldo, aviso, ferias, 13o e FGTS foram pagos com a base salarial correta.",
      "Se o desligamento foi recente, vale revisar rapidamente para nao perder prova e documentos.",
    ],
    caution:
      "A estimativa abaixo e apenas orientativa. Rescisao depende de rubricas especificas e documentos do encerramento do contrato.",
    estimate: {
      label: "Faixa preliminar de diferencas rescisorias",
      min: Math.round(estimate * 0.8),
      max: Math.round(estimate * 1.2),
      helper: "Faixa conservadora para orientar triagem, nao para prometer valor final.",
    },
    comparisonTags,
    whatsappSummary: `Triagem de rescisao trabalhista com score ${finalScore}/100, foco em verbas rescisorias e faixa inicial de ${formatCurrency(
      Math.round(estimate * 0.8)
    )} a ${formatCurrency(Math.round(estimate * 1.2))}.`,
  };
}

function computeOvertime(values: SimulatorFormValues): SimulatorOutcome {
  const salary = toNumber(values, "salary");
  const yearsWorked = toNumber(values, "yearsWorked");
  const contractualHours = toNumber(values, "contractualHours");
  const actualHours = toNumber(values, "actualHours");
  const daysPerWeek = toNumber(values, "daysPerWeek");
  const intervalRegular = asYes(toText(values, "intervalRegular"));
  const sundayWork = asYes(toText(values, "sundayWork"));
  const holidayWork = asYes(toText(values, "holidayWork"));
  const nightWork = asYes(toText(values, "nightWork"));
  const paidCorrectly = asYes(toText(values, "paidCorrectly"));

  const hourlyRate = salary > 0 ? salary / 220 : 0;
  const extraHoursPerDay = Math.max(actualHours - contractualHours, 0);
  const monthlyExtraHours = extraHoursPerDay * Math.max(daysPerWeek, 1) * 4.3;
  const monthsWorked = Math.max(1, Math.round(yearsWorked * 12));

  let estimate = monthlyExtraHours * hourlyRate * 1.5 * monthsWorked;
  let score = 20;
  const findings: string[] = [];
  const comparisonTags = ["horasExtrasNaoPagas"];

  if (extraHoursPerDay > 0) {
    score += 18;
    findings.push(
      `A jornada informada sugere cerca de ${Math.round(
        monthlyExtraHours
      )} horas extras por mes.`
    );
  }

  if (!paidCorrectly) {
    score += 18;
    findings.push("Voce indicou que o pagamento das horas extras nao era correto.");
  }

  if (!intervalRegular) {
    estimate += salary * 0.08 * monthsWorked;
    score += 10;
    comparisonTags.push("intervaloIrregular");
    findings.push("O intervalo intrajornada pode gerar reflexos adicionais.");
  }

  if (sundayWork || holidayWork) {
    estimate += salary * 0.06 * monthsWorked;
    score += 10;
    comparisonTags.push("domingosFeriados");
    findings.push("Trabalho em domingos ou feriados sem compensacao aumenta a exposicao.");
  }

  if (nightWork) {
    estimate += salary * 0.05 * monthsWorked;
    score += 8;
    comparisonTags.push("trabalhoNoturno");
    findings.push("Ha indicio de adicional noturno e reflexos correlatos.");
  }

  if (yearsWorked >= 3) {
    score += 6;
    comparisonTags.push("tempoMaisTresAnos");
  }

  const finalScore = clampScore(score);
  const classification = classificationFromScore(finalScore);

  return {
    score: finalScore,
    classification,
    potentialLabel: potentialLabel(classification),
    summary: `A triagem aponta um quadro de jornada acima do contratado, com base em ${buildWorkSummary(
      values
    )}.`,
    findings:
      findings.length > 0
        ? findings
        : ["Pelas horas informadas, nao apareceu um excesso relevante de jornada nesta leitura inicial."],
    recommendations: [
      "Separe espelhos de ponto, mensagens, escalas, holerites e comprovantes de jornada real.",
      "Anote horario medio de entrada, saida, intervalo e frequencia em domingos ou feriados.",
      "Se a empresa pagava parte das horas, vale comparar rubricas e reflexos com o horario efetivo.",
    ],
    caution:
      "Horas extras dependem de prova consistente de jornada. A faixa serve para triagem e nao substitui calculo tecnico.",
    estimate: {
      label: "Faixa preliminar de horas extras e reflexos",
      min: Math.round(estimate * 0.75),
      max: Math.round(estimate * 1.15),
      helper: "Leitura prudente conforme jornada informada e adicionais possiveis.",
    },
    comparisonTags,
    whatsappSummary: `Triagem de horas extras com score ${finalScore}/100 e faixa inicial de ${formatCurrency(
      Math.round(estimate * 0.75)
    )} a ${formatCurrency(Math.round(estimate * 1.15))}.`,
  };
}

function computeFgts(values: SimulatorFormValues): SimulatorOutcome {
  const salary = toNumber(values, "salary");
  const monthsWorked = toNumber(values, "monthsWorked");
  const checkedStatement = asYes(toText(values, "checkedStatement"));
  const companyActive = asYes(toText(values, "companyActive"));
  const employmentEnded = asYes(toText(values, "employmentEnded"));
  const hasProof = asYes(toText(values, "hasProof"));
  const absenceLevel = toText(values, "absenceLevel");

  const ratioMap: Record<string, number> = {
    alguns: 0.25,
    muitos: 0.55,
    quaseTodos: 0.9,
  };

  const missingRatio = ratioMap[absenceLevel] ?? 0.25;
  let estimate = salary * 0.08 * Math.max(monthsWorked, 1) * missingRatio;
  let score = 18;
  const findings: string[] = [];
  const comparisonTags = ["fgtsNaoPago"];

  if (checkedStatement) {
    score += 15;
    findings.push("Voce ja conferiu o extrato, o que fortalece a triagem inicial.");
  }

  if (hasProof) {
    score += 12;
    findings.push("Ha indicacao de documentos para confrontar depositos com o contrato.");
  }

  if (absenceLevel === "muitos" || absenceLevel === "quaseTodos") {
    score += 18;
    findings.push("A suspeita envolve varios meses sem deposito regular de FGTS.");
  }

  if (employmentEnded) {
    estimate += estimate * 0.4;
    score += 10;
    comparisonTags.push("demissaoProblematica");
    findings.push("Como o contrato ja encerrou, pode haver reflexo adicional ligado a multa rescisoria.");
  }

  if (monthsWorked >= 36) {
    score += 8;
    comparisonTags.push("tempoMaisTresAnos");
  }

  if (!companyActive) {
    score += 6;
    findings.push("A situacao da empresa pode exigir mais rapidez na estrategia de cobranca.");
  }

  const finalScore = clampScore(score);
  const classification = classificationFromScore(finalScore);

  return {
    score: finalScore,
    classification,
    potentialLabel: potentialLabel(classification),
    summary: `A leitura inicial indica possivel irregularidade de FGTS em um contrato com cerca de ${monthsWorked} mes${
      monthsWorked === 1 ? "" : "es"
    } e salario medio de ${formatCurrency(salary)}.`,
    findings:
      findings.length > 0
        ? findings
        : ["A triagem indica suspeita inicial, mas ainda sem sinal forte de extensao da irregularidade."],
    recommendations: [
      "Separe extrato analitico do FGTS, holerites, contrato e comprovantes de desligamento, se houver.",
      "Cruze meses sem deposito com o periodo efetivo do contrato para medir o tamanho da diferenca.",
      "Se a empresa nao estiver mais ativa ou houver desligamento recente, vale acelerar a revisao do caso.",
    ],
    caution:
      "Essa faixa e preliminar e depende do extrato detalhado do FGTS para validacao do numero exato.",
    estimate: {
      label: "Faixa preliminar de FGTS possivelmente nao depositado",
      min: Math.round(estimate * 0.85),
      max: Math.round(estimate * 1.15),
      helper: "Pode incluir reflexos rescisorios quando o contrato ja terminou.",
    },
    comparisonTags,
    whatsappSummary: `Triagem de FGTS com score ${finalScore}/100 e indicio inicial de ${formatCurrency(
      Math.round(estimate * 0.85)
    )} a ${formatCurrency(Math.round(estimate * 1.15))} em valores possivelmente nao depositados.`,
  };
}

function computePix(values: SimulatorFormValues): SimulatorOutcome {
  const amount = toNumber(values, "amount");
  const elapsed = toText(values, "elapsed");
  const notifiedBank = asYes(toText(values, "notifiedBank"));
  const filedReport = asYes(toText(values, "filedReport"));
  const hasProof = asYes(toText(values, "hasProof"));
  const triedPlatform = asYes(toText(values, "triedPlatform"));
  const knowsRecipient = asYes(toText(values, "knowsRecipient"));
  const fraudType = toText(values, "fraudType");

  let score = 12;
  const findings: string[] = [];

  if (elapsed === "ate24h") {
    score += 24;
    findings.push("A comunicacao rapida tende a melhorar a resposta inicial do caso.");
  } else if (elapsed === "ate7dias") {
    score += 14;
    findings.push("O intervalo ainda e relativamente curto para triagem inicial.");
  } else if (elapsed === "ate30dias") {
    score += 6;
  }

  if (notifiedBank) {
    score += 18;
    findings.push("Voce informou que o banco foi avisado, o que e um passo importante.");
  }

  if (filedReport) {
    score += 12;
    findings.push("Boletim de ocorrencia ajuda a organizar a narrativa do caso.");
  }

  if (hasProof) {
    score += 18;
    findings.push("Existem comprovantes ou registros para sustentar a cronologia do golpe.");
  }

  if (triedPlatform || knowsRecipient) {
    score += 8;
    findings.push("Houve tentativa de rastrear ou contestar administrativamente a transferencia.");
  }

  if (amount >= 3000) {
    score += 8;
  }

  const finalScore = clampScore(score);
  const classification = classificationFromScore(finalScore);
  const amountLabel = amount > 0 ? formatCurrency(amount) : "valor nao informado";

  return {
    score: finalScore,
    classification,
    potentialLabel:
      classification === "alta"
        ? "Potencial inicial relevante, com necessidade de agir rapido"
        : potentialLabel(classification),
    summary: `A triagem analisa um golpe via PIX no valor de ${amountLabel}, em um contexto de ${fraudType.replace(
      /-/g,
      " "
    )}.`,
    findings:
      findings.length > 0
        ? findings
        : ["Sem comunicacao rapida ou prova relevante, o caso tende a exigir avaliacao mais cautelosa."],
    recommendations: [
      "Organize comprovante do PIX, conversas, protocolos, BO e resposta do banco.",
      "Monte uma linha do tempo com horario do golpe, horario da comunicacao e canais acionados.",
      "Se a comunicacao foi muito recente, priorize contato humano imediato para definir a estrategia.",
    ],
    caution:
      "Golpe via PIX depende muito de tempo de comunicacao, provas e postura do banco. A triagem nao substitui analise individual.",
    estimate: {
      label: "Valor informado como prejuizo",
      valueText: amountLabel,
      helper: "Nao representa valor de recuperacao garantido, apenas o impacto economico narrado.",
    },
    whatsappSummary: `Triagem de golpe via PIX com score ${finalScore}/100 e prejuizo informado de ${amountLabel}.`,
  };
}

export const simulatorRegistry: SimulatorDefinition[] = [
  {
    id: "labor-general",
    slug: "trabalhista-geral",
    path: pagePaths.simulator,
    name: "Simulador trabalhista",
    shortDescription:
      "Triagem ampla para direitos trabalhistas nao pagos, com score, faixa inicial e comparacao publica.",
    longDescription:
      "Use este simulador quando a pergunta central for se existem direitos trabalhistas nao pagos no contrato. Ele faz uma triagem geral antes da analise humana.",
    heroTitle: "Use este fluxo quando a pergunta central for: existe direito trabalhista nao pago aqui?",
    heroDescription:
      "O simulador organiza sinais de risco, gera uma faixa estimada e indica se faz sentido levar o caso para atendimento humano.",
    area: "Trabalhista",
    timeToComplete: "3 a 5 minutos",
    eyebrow: "simulador trabalhista",
    introBullets: [
      "Leitura inicial para contrato CLT, PJ com subordinacao ou trabalho sem registro.",
      "Bom para quem ainda nao sabe qual tese trabalhista faz mais sentido.",
      "Pode cruzar o resumo com a base publica trabalhista do projeto.",
    ],
    stepLabels: ["Contrato", "Emprego", "Sinais"],
    seoTitle: "Simulador trabalhista para direitos nao pagos e triagem inicial",
    seoDescription:
      "Estime sinais de direitos trabalhistas nao pagos, organize contrato, jornada, FGTS e demissao e leve o caso para analise humana.",
    initialValues: {
      contractType: "",
      salary: 0,
      yearsWorked: 0,
      violations: [],
    },
    steps: [
      {
        id: "contract",
        title: "Qual era seu tipo de contratacao?",
        description: "Selecione a opcao que melhor descreve o vinculo principal.",
        fields: [
          {
            id: "contractType",
            label: "Tipo de contratacao",
            type: "choice",
            required: true,
            options: [
              { value: "clt", label: "CLT", description: "Carteira assinada" },
              { value: "pj", label: "PJ", description: "Pessoa juridica ou MEI" },
              {
                value: "informal",
                label: "Sem registro",
                description: "Trabalho informal ou sem carteira",
              },
            ],
          },
        ],
      },
      {
        id: "employment",
        title: "Dados do contrato",
        description: "Essas informacoes ajudam a estimar exposicao economica inicial.",
        fields: [
          {
            id: "salary",
            label: "Quanto voce recebia por mes? (salario bruto)",
            type: "currency",
            required: true,
            placeholder: "Ex: R$ 3.000",
          },
          {
            id: "yearsWorked",
            label: "Quantos anos trabalhou nessa empresa?",
            type: "number",
            required: true,
            placeholder: "Ex: 4",
            min: 0.5,
            step: 0.5,
          },
        ],
      },
      {
        id: "violations",
        title: "O que acontecia no trabalho?",
        description: "Marque tudo que se aplica ao seu caso.",
        fields: [
          {
            id: "violations",
            label: "Sinais trabalhistas",
            type: "multiselect",
            required: true,
            options: laborViolationOptions,
          },
        ],
      },
    ],
    supportsPublicCaseComparison: true,
    comparisonTitle: "Casos publicos comparaveis",
    comparisonSubtitle:
      "Comparacao montada a partir do resumo informado no formulario e dos sinais trabalhistas marcados na triagem.",
    computeResult: (values) => computeLaborGeneral(values),
  },
  {
    id: "termination",
    slug: "rescisao-trabalhista",
    path: "/simuladores/rescisao-trabalhista",
    name: "Simulador de rescisao trabalhista",
    shortDescription:
      "Triagem focada em verbas rescisorias, aviso previo, FGTS e multa de 40%.",
    longDescription:
      "Use este simulador quando a principal duvida for sobre rescisao, verbas pendentes e diferencas de encerramento do contrato.",
    heroTitle: "Descubra se a sua rescisao pode ter verbas pendentes",
    heroDescription:
      "Este fluxo faz uma leitura inicial sobre desligamento, verbas rescisorias, FGTS, aviso previo e outros itens do fim do contrato.",
    area: "Trabalhista",
    timeToComplete: "3 minutos",
    eyebrow: "rescisao trabalhista",
    introBullets: [
      "Focado em desligamento e valores rescisorios possivelmente nao pagos.",
      "Ajuda a separar o que pode compor a conta inicial.",
      "Cruza o resumo com a base publica trabalhista quando fizer sentido.",
    ],
    stepLabels: ["Desligamento", "Verbas"],
    seoTitle: "Simulador de rescisao trabalhista e verbas pendentes",
    seoDescription:
      "Analise verbal rescisorias, FGTS, aviso previo e sinais de diferencas no encerramento do contrato de trabalho.",
    initialValues: {
      dismissalType: "",
      salary: 0,
      yearsWorked: 0,
      receivedAll: "",
      noticePaid: "",
      fgtsDeposited: "",
      multaPaid: "",
      vacationPending: "",
      thirteenthPending: "",
    },
    steps: [
      {
        id: "dismissal",
        title: "Como foi o desligamento?",
        description: "Comece pelo formato da demissao e pela base salarial do contrato.",
        fields: [
          {
            id: "dismissalType",
            label: "Tipo de desligamento",
            type: "choice",
            required: true,
            options: [
              { value: "sem-justa-causa", label: "Sem justa causa" },
              { value: "justa-causa", label: "Com justa causa" },
              { value: "pedido-demissao", label: "Pedido de demissao" },
              { value: "acordo", label: "Acordo" },
            ],
          },
          {
            id: "salary",
            label: "Salario bruto mensal",
            type: "currency",
            required: true,
            placeholder: "Ex: R$ 4.200",
          },
          {
            id: "yearsWorked",
            label: "Tempo total na empresa (anos)",
            type: "number",
            required: true,
            min: 0.5,
            step: 0.5,
            placeholder: "Ex: 2.5",
          },
        ],
      },
      {
        id: "termination-rights",
        title: "O que faltou na rescisao?",
        description: "Marque como foi o pagamento das principais verbas do encerramento.",
        fields: [
          { id: "receivedAll", label: "Recebeu todas as verbas rescisorias?", type: "yesno", required: true, options: yesNoOptions },
          { id: "noticePaid", label: "O aviso previo foi pago corretamente?", type: "yesno", required: true, options: yesNoOptions },
          { id: "fgtsDeposited", label: "O FGTS parecia estar regular ate a demissao?", type: "yesno", required: true, options: yesNoOptions },
          { id: "multaPaid", label: "A multa de 40% do FGTS foi paga?", type: "yesno", required: true, options: yesNoOptions },
          { id: "vacationPending", label: "Havia ferias vencidas ou proporcionais nao quitadas?", type: "yesno", required: true, options: yesNoOptions },
          { id: "thirteenthPending", label: "O 13o proporcional ficou pendente?", type: "yesno", required: true, options: yesNoOptions },
        ],
      },
    ],
    supportsPublicCaseComparison: true,
    comparisonTitle: "Casos publicos de rescisao comparaveis",
    comparisonSubtitle:
      "Comparacao baseada no resumo informado e nos sinais de verbas rescisorias, FGTS e demissao.",
    computeResult: (values) => computeTermination(values),
  },
  {
    id: "overtime",
    slug: "horas-extras",
    path: "/simuladores/horas-extras",
    name: "Simulador de horas extras",
    shortDescription:
      "Triagem para jornada acima do contratado, reflexos, intervalo e trabalho em domingos, feriados e periodo noturno.",
    longDescription:
      "Use este simulador quando a principal dor for jornada excessiva, horas extras nao pagas e adicionais relacionados ao horario de trabalho.",
    heroTitle: "Veja se sua jornada pode indicar horas extras nao pagas",
    heroDescription:
      "Este fluxo compara horario contratado, horario real, intervalo e adicionais para medir o potencial inicial do caso.",
    area: "Trabalhista",
    timeToComplete: "3 minutos",
    eyebrow: "horas extras",
    introBullets: [
      "Focado em jornada real versus jornada contratada.",
      "Considera intervalo, domingos, feriados e adicional noturno.",
      "Pode cruzar o resumo com a base publica trabalhista do projeto.",
    ],
    stepLabels: ["Jornada", "Adicionais"],
    seoTitle: "Simulador de horas extras e jornada de trabalho",
    seoDescription:
      "Analise horas extras nao pagas, intervalo irregular, domingos, feriados e adicional noturno em uma triagem trabalhista inicial.",
    initialValues: {
      salary: 0,
      yearsWorked: 0,
      contractualHours: 8,
      actualHours: 8,
      daysPerWeek: 5,
      intervalRegular: "",
      sundayWork: "",
      holidayWork: "",
      nightWork: "",
      paidCorrectly: "",
    },
    steps: [
      {
        id: "hours",
        title: "Como era sua jornada?",
        description: "Informe a base salarial e a diferenca entre o horario contratado e o horario real.",
        fields: [
          { id: "salary", label: "Salario bruto mensal", type: "currency", required: true, placeholder: "Ex: R$ 2.800" },
          { id: "yearsWorked", label: "Tempo nesse ritmo de jornada (anos)", type: "number", required: true, min: 0.5, step: 0.5, placeholder: "Ex: 2" },
          { id: "contractualHours", label: "Horas contratadas por dia", type: "number", required: true, min: 1, max: 12, step: 1 },
          { id: "actualHours", label: "Horas reais trabalhadas por dia", type: "number", required: true, min: 1, max: 18, step: 1 },
          { id: "daysPerWeek", label: "Dias trabalhados por semana", type: "number", required: true, min: 1, max: 7, step: 1 },
        ],
      },
      {
        id: "extras",
        title: "Havia outros adicionais ou problemas de jornada?",
        description: "Agora detalhe como era o pagamento e se existiam reflexos adicionais.",
        fields: [
          { id: "intervalRegular", label: "O intervalo de almoco era regular?", type: "yesno", required: true, options: yesNoOptions },
          { id: "sundayWork", label: "Trabalhava em domingos?", type: "yesno", required: true, options: yesNoOptions },
          { id: "holidayWork", label: "Trabalhava em feriados?", type: "yesno", required: true, options: yesNoOptions },
          { id: "nightWork", label: "Trabalhava apos as 22h?", type: "yesno", required: true, options: yesNoOptions },
          { id: "paidCorrectly", label: "As horas extras eram pagas corretamente?", type: "yesno", required: true, options: yesNoOptions },
        ],
      },
    ],
    supportsPublicCaseComparison: true,
    comparisonTitle: "Casos publicos de jornada comparaveis",
    comparisonSubtitle:
      "Comparacao baseada no resumo informado e nos sinais de horas extras, intervalo e adicionais trabalhistas.",
    computeResult: (values) => computeOvertime(values),
  },
  {
    id: "fgts",
    slug: "fgts-nao-depositado",
    path: "/simuladores/fgts-nao-depositado",
    name: "Simulador de FGTS nao depositado",
    shortDescription:
      "Triagem para ausencia de depositos de FGTS, reflexos rescisorios e urgencia de cobranca.",
    longDescription:
      "Use este simulador quando a principal duvida for sobre falta de depositos de FGTS e necessidade de cobranca do valor nao recolhido.",
    heroTitle: "Descubra se o seu caso de FGTS nao depositado parece relevante",
    heroDescription:
      "Este fluxo mede o tamanho inicial da irregularidade, a qualidade da prova e a urgencia de revisao do caso.",
    area: "Trabalhista",
    timeToComplete: "2 a 3 minutos",
    eyebrow: "fgts nao depositado",
    introBullets: [
      "Focado em meses sem deposito, extrato do FGTS e encerramento do contrato.",
      "Ajuda a medir a exposicao economica inicial do caso.",
      "Pode comparar o resumo com a base publica trabalhista do projeto.",
    ],
    stepLabels: ["Base do contrato", "Extrato e prova"],
    seoTitle: "Simulador de FGTS nao depositado e cobranca trabalhista",
    seoDescription:
      "Estime a relevancia de um caso de FGTS nao depositado e organize extrato, prova, encerramento do contrato e valor preliminar.",
    initialValues: {
      salary: 0,
      monthsWorked: 0,
      checkedStatement: "",
      absenceLevel: "",
      employmentEnded: "",
      companyActive: "",
      hasProof: "",
    },
    steps: [
      {
        id: "base",
        title: "Qual era a base do contrato?",
        description: "Informe salario, duracao do vinculo e situacao atual do contrato.",
        fields: [
          { id: "salary", label: "Salario medio mensal", type: "currency", required: true, placeholder: "Ex: R$ 3.500" },
          { id: "monthsWorked", label: "Quantos meses trabalhou nesse vinculo?", type: "number", required: true, min: 1, step: 1, placeholder: "Ex: 24" },
          { id: "employmentEnded", label: "O contrato ja terminou?", type: "yesno", required: true, options: yesNoOptions },
          { id: "companyActive", label: "A empresa ainda esta ativa?", type: "yesno", required: true, options: yesNoOptions },
        ],
      },
      {
        id: "proof",
        title: "O que voce ja conseguiu confirmar?",
        description: "Aqui a triagem mede a confiabilidade da suspeita e o tamanho da falha.",
        fields: [
          { id: "checkedStatement", label: "Voce ja conferiu o extrato do FGTS?", type: "yesno", required: true, options: yesNoOptions },
          {
            id: "absenceLevel",
            label: "Qual parece ser a extensao da falta de depositos?",
            type: "choice",
            required: true,
            options: [
              { value: "alguns", label: "Alguns meses" },
              { value: "muitos", label: "Muitos meses" },
              { value: "quaseTodos", label: "Quase todo o periodo" },
            ],
          },
          { id: "hasProof", label: "Voce tem holerites, contrato ou documentos para confrontar o extrato?", type: "yesno", required: true, options: yesNoOptions },
        ],
      },
    ],
    supportsPublicCaseComparison: true,
    comparisonTitle: "Casos publicos de FGTS comparaveis",
    comparisonSubtitle:
      "Comparacao baseada no resumo informado e nos sinais de FGTS irregular cadastrados na base trabalhista.",
    computeResult: (values) => computeFgts(values),
  },
  {
    id: "pix-fraud",
    slug: "golpe-pix",
    path: "/simuladores/golpe-pix",
    name: "Simulador de golpe via PIX",
    shortDescription:
      "Triagem para fraude via PIX, tempo de comunicacao, documentacao e urgencia do caso.",
    longDescription:
      "Use este simulador quando o problema envolver transferencia via PIX em contexto de golpe, engenharia social, falsa central ou fraude em conta.",
    heroTitle: "Veja se o seu caso de golpe via PIX pede acao rapida",
    heroDescription:
      "Este fluxo organiza tempo do golpe, contato com o banco, provas e valor perdido para medir a prioridade inicial.",
    area: "Consumidor / Bancario",
    timeToComplete: "2 a 3 minutos",
    eyebrow: "golpe via PIX",
    introBullets: [
      "Focado em tempo de comunicacao, prova e historico de contato com o banco.",
      "Ajuda a separar os documentos e a urgencia do caso.",
      "Nao usa comparacao com a base trabalhista do projeto, porque se trata de outra area.",
    ],
    stepLabels: ["Golpe", "Documentacao"],
    seoTitle: "Simulador de golpe via PIX e triagem inicial do caso",
    seoDescription:
      "Avalie preliminarmente um golpe via PIX, o tempo de comunicacao ao banco, as provas disponiveis e a prioridade do caso.",
    initialValues: {
      amount: 0,
      elapsed: "",
      fraudType: "",
      notifiedBank: "",
      filedReport: "",
      hasProof: "",
      triedPlatform: "",
      knowsRecipient: "",
    },
    steps: [
      {
        id: "fraud",
        title: "Como o golpe aconteceu?",
        description: "Comece pelo valor perdido, pelo tipo de fraude e pela rapidez da comunicacao.",
        fields: [
          { id: "amount", label: "Valor perdido via PIX", type: "currency", required: true, placeholder: "Ex: R$ 4.800" },
          {
            id: "fraudType",
            label: "Tipo principal de golpe",
            type: "choice",
            required: true,
            options: [
              { value: "falsa-central", label: "Falsa central ou falso atendente" },
              { value: "conta-invadida", label: "Conta invadida ou dispositivo comprometido" },
              { value: "engenharia-social", label: "Engenharia social / urgencia / chantagem" },
              { value: "compra-falsa", label: "Compra ou anuncio falso" },
            ],
          },
          {
            id: "elapsed",
            label: "Quanto tempo passou ate voce agir?",
            type: "choice",
            required: true,
            options: [
              { value: "ate24h", label: "Menos de 24 horas" },
              { value: "ate7dias", label: "Entre 1 e 7 dias" },
              { value: "ate30dias", label: "Entre 8 e 30 dias" },
              { value: "mais30dias", label: "Mais de 30 dias" },
            ],
          },
        ],
      },
      {
        id: "proof",
        title: "Quais passos voce ja tomou?",
        description: "Agora a triagem mede documentacao, protocolo e consistencia do caso.",
        fields: [
          { id: "notifiedBank", label: "O banco foi avisado formalmente?", type: "yesno", required: true, options: yesNoOptions },
          { id: "filedReport", label: "Voce registrou boletim de ocorrencia?", type: "yesno", required: true, options: yesNoOptions },
          { id: "hasProof", label: "Voce tem comprovantes, mensagens ou prints?", type: "yesno", required: true, options: yesNoOptions },
          { id: "triedPlatform", label: "Voce tentou contestar ou abrir protocolo em canal oficial?", type: "yesno", required: true, options: yesNoOptions },
          { id: "knowsRecipient", label: "Voce conseguiu identificar ou rastrear o destinatario?", type: "yesno", required: true, options: yesNoOptions },
        ],
      },
    ],
    computeResult: (values) => computePix(values),
  },
];

export const simulatorRegistryBySlug = Object.fromEntries(
  simulatorRegistry.map((simulator) => [simulator.slug, simulator])
) as Record<string, SimulatorDefinition>;

export const simulatorRegistryByPath = Object.fromEntries(
  simulatorRegistry.map((simulator) => [simulator.path, simulator])
) as Record<string, SimulatorDefinition>;

export function getSimulatorBySlug(slug: string) {
  return simulatorRegistryBySlug[slug];
}

export function getSimulatorByPath(path: string) {
  return simulatorRegistryByPath[path];
}

export function getAllSimulatorPaths() {
  return simulatorRegistry.map((simulator) => simulator.path);
}

export const featuredSimulators = simulatorRegistry.filter(
  (simulator) => simulator.slug !== "trabalhista-geral"
);
