import type { SimulatorFormValues, SimulatorOutcome } from "../types";
import {
  buildConfidenceScore,
  clamp,
  clampScore,
  countAnswered,
  createOutcome,
  formatCurrency,
  leadPriorityFromScore,
  monthsFromYearsMonths,
  normalizeChoice,
  normalizeNumber,
  normalizeYesNo,
  potentialLevelFromScore,
  roundMoney,
} from "./common";

const TERMINATION_DISMISSAL_TYPES = [
  "sem-justa-causa",
  "justa-causa",
  "pedido-demissao",
  "acordo",
  "simulacao",
] as const;

export type TerminationDismissalType =
  (typeof TERMINATION_DISMISSAL_TYPES)[number];

export interface TerminationInput {
  dismissalType: TerminationDismissalType;
  salary: number;
  daysWorkedInMonth: number;
  yearsWorked: number;
  extraMonthsWorked: number;
  monthsWorkedCurrentYear: number;
  vacationOverduePeriods: number;
  proportionalVacationMonths: number;
  receivedSomeAmount: boolean | null;
  noticePaid: boolean | null;
  fgtsDeposited: boolean | null;
  multaPaid: boolean | null;
  vacationPending: boolean | null;
  thirteenthPending: boolean | null;
  hasValueDoubts: boolean | null;
}

export interface TerminationCalculation {
  totalMonthsWorked: number;
  dailySalary: number;
  noticeDays: number;
  salaryBalance: number;
  noticePay: number;
  thirteenthProportional: number;
  overdueVacation: number;
  proportionalVacation: number;
  fgtsExpected: number;
  fgtsFine: number;
  totalEstimated: number;
  breakdown: Array<{
    key: string;
    label: string;
    amount: number;
    helper: string;
    includedInEstimate: boolean;
  }>;
  observations: string[];
}

function isSimulation(input: TerminationInput) {
  return input.dismissalType === "simulacao";
}

function appliesNoticeCredit(type: TerminationDismissalType) {
  return type === "sem-justa-causa" || type === "acordo" || type === "simulacao";
}

function appliesThirteenth(type: TerminationDismissalType) {
  return type !== "justa-causa";
}

function appliesProportionalVacation(type: TerminationDismissalType) {
  return type !== "justa-causa";
}

function fineRateForDismissal(type: TerminationDismissalType) {
  if (type === "sem-justa-causa" || type === "simulacao") {
    return 0.4;
  }

  if (type === "acordo") {
    return 0.2;
  }

  return 0;
}

function buildNoticeDays(totalMonthsWorked: number) {
  const fullYears = Math.floor(totalMonthsWorked / 12);
  return Math.min(30 + fullYears * 3, 90);
}

export function normalizeTerminationInput(values: SimulatorFormValues): TerminationInput {
  return {
    dismissalType: normalizeChoice(
      values,
      "dismissalType",
      TERMINATION_DISMISSAL_TYPES,
      "sem-justa-causa"
    ) as TerminationDismissalType,
    salary: normalizeNumber(values, "salary", 0, { min: 0 }),
    daysWorkedInMonth: normalizeNumber(values, "daysWorkedInMonth", 0, {
      min: 0,
      max: 30,
      integer: true,
    }),
    yearsWorked: normalizeNumber(values, "yearsWorked", 0, {
      min: 0,
      integer: true,
    }),
    extraMonthsWorked: normalizeNumber(values, "extraMonthsWorked", 0, {
      min: 0,
      max: 11,
      integer: true,
    }),
    monthsWorkedCurrentYear: normalizeNumber(values, "monthsWorkedCurrentYear", 0, {
      min: 0,
      max: 12,
      integer: true,
    }),
    vacationOverduePeriods: normalizeNumber(values, "vacationOverduePeriods", 0, {
      min: 0,
      max: 5,
      integer: true,
    }),
    proportionalVacationMonths: normalizeNumber(values, "proportionalVacationMonths", 0, {
      min: 0,
      max: 11,
      integer: true,
    }),
    receivedSomeAmount: normalizeYesNo(values, "receivedSomeAmount"),
    noticePaid: normalizeYesNo(values, "noticePaid"),
    fgtsDeposited: normalizeYesNo(values, "fgtsDeposited"),
    multaPaid: normalizeYesNo(values, "multaPaid"),
    vacationPending: normalizeYesNo(values, "vacationPending"),
    thirteenthPending: normalizeYesNo(values, "thirteenthPending"),
    hasValueDoubts: normalizeYesNo(values, "hasValueDoubts"),
  };
}

export function calculateTerminationEstimate(
  input: TerminationInput
): TerminationCalculation {
  const totalMonthsWorked = monthsFromYearsMonths(
    input.yearsWorked,
    input.extraMonthsWorked
  );
  const dailySalary = roundMoney(input.salary / 30);
  const noticeDays = buildNoticeDays(totalMonthsWorked);

  const salaryBalance = roundMoney(dailySalary * input.daysWorkedInMonth);
  const noticePayBase = roundMoney(dailySalary * noticeDays);
  const noticePay =
    input.dismissalType === "acordo"
      ? roundMoney(noticePayBase * 0.5)
      : appliesNoticeCredit(input.dismissalType)
        ? noticePayBase
        : 0;

  const thirteenthProportional = appliesThirteenth(input.dismissalType)
    ? roundMoney((input.salary / 12) * input.monthsWorkedCurrentYear)
    : 0;

  const overdueVacation = roundMoney(
    (input.salary + input.salary / 3) * input.vacationOverduePeriods
  );

  const proportionalVacation = appliesProportionalVacation(input.dismissalType)
    ? roundMoney(((input.salary / 12) * input.proportionalVacationMonths * 4) / 3)
    : 0;

  const fgtsExpected = roundMoney(input.salary * 0.08 * totalMonthsWorked);
  const fgtsFine = roundMoney(fgtsExpected * fineRateForDismissal(input.dismissalType));

  const includeAllCoreItems = isSimulation(input) || input.receivedSomeAmount === false;
  const includeNotice = isSimulation(input) || input.noticePaid === false;
  const includeThirteenth = includeAllCoreItems || input.thirteenthPending === true;
  const includeVacation = includeAllCoreItems || input.vacationPending === true;
  const includeFgts = input.fgtsDeposited === false;
  const includeFine =
    fineRateForDismissal(input.dismissalType) > 0 &&
    (isSimulation(input) || input.multaPaid === false);

  const breakdown = [
    {
      key: "salary-balance",
      label: "Saldo de salario",
      amount: salaryBalance,
      helper:
        "Estimativa simplificada por dias trabalhados no mes da saida: salario / 30 x dias informados.",
      includedInEstimate: includeAllCoreItems && salaryBalance > 0,
    },
    {
      key: "notice-pay",
      label:
        input.dismissalType === "acordo"
          ? "Aviso previo indenizado (50%)"
          : "Aviso previo indenizado",
      amount: noticePay,
      helper:
        "Regra simplificada: 30 dias + 3 dias por ano completo, limitada a 90 dias.",
      includedInEstimate: includeNotice && noticePay > 0,
    },
    {
      key: "thirteenth",
      label: "13o proporcional",
      amount: thirteenthProportional,
      helper:
        "Regra simplificada: salario / 12 x meses trabalhados no ano corrente.",
      includedInEstimate: includeThirteenth && thirteenthProportional > 0,
    },
    {
      key: "vacation-overdue",
      label: "Ferias vencidas + 1/3",
      amount: overdueVacation,
      helper:
        "Cada periodo vencido considera salario integral acrescido de 1/3.",
      includedInEstimate: includeVacation && overdueVacation > 0,
    },
    {
      key: "vacation-proportional",
      label: "Ferias proporcionais + 1/3",
      amount: proportionalVacation,
      helper:
        "Regra simplificada: salario / 12 x meses aquisitivos x adicional de 1/3.",
      includedInEstimate: includeVacation && proportionalVacation > 0,
    },
    {
      key: "fgts-reference",
      label: "FGTS estimado no vinculo",
      amount: fgtsExpected,
      helper:
        "Referencia aproximada usando 8% do salario por mes de vinculo. So entra na conta se houve indicio de irregularidade.",
      includedInEstimate: includeFgts && fgtsExpected > 0,
    },
    {
      key: "fgts-fine",
      label:
        input.dismissalType === "acordo"
          ? "Multa rescisoria estimada de 20% do FGTS"
          : "Multa rescisoria estimada de 40% do FGTS",
      amount: fgtsFine,
      helper:
        "Aplicada apenas em cenarios compativeis com sem justa causa ou acordo, de forma preliminar.",
      includedInEstimate: includeFine && fgtsFine > 0,
    },
  ];

  const observations: string[] = [];
  if (input.dismissalType === "justa-causa") {
    observations.push(
      "Nesta leitura, 13o proporcional, ferias proporcionais e multa do FGTS foram excluidos por serem normalmente incompativeis com justa causa."
    );
  }

  if (input.dismissalType === "pedido-demissao") {
    observations.push(
      "Pedido de demissao nao gera multa de 40% do FGTS e o aviso previo foi tratado sem credito adicional para evitar superestimacao."
    );
  }

  if (input.dismissalType === "acordo") {
    observations.push(
      "Acordo rescisorio foi tratado de forma conservadora, com aviso e multa do FGTS reduzidos."
    );
  }

  if (isSimulation(input)) {
    observations.push(
      "Como voce marcou simulacao, a leitura considera um cenario simplificado de desligamento sem justa causa e pagamentos ainda nao quitados."
    );
  }

  if (input.fgtsDeposited !== false) {
    observations.push(
      "O FGTS total do vinculo foi mantido como referencia. Sem extrato irregular, ele nao foi tratado como diferenca automaticamente devida."
    );
  }

  const totalEstimated = roundMoney(
    breakdown.reduce((total, item) => {
      if (!item.includedInEstimate) {
        return total;
      }

      return total + item.amount;
    }, 0)
  );

  return {
    totalMonthsWorked,
    dailySalary,
    noticeDays,
    salaryBalance,
    noticePay,
    thirteenthProportional,
    overdueVacation,
    proportionalVacation,
    fgtsExpected,
    fgtsFine,
    totalEstimated,
    breakdown,
    observations,
  };
}

export function scoreTerminationLead(
  input: TerminationInput,
  calculation: TerminationCalculation
) {
  const missingSignals = [
    input.receivedSomeAmount === false,
    input.noticePaid === false,
    input.fgtsDeposited === false,
    input.multaPaid === false,
    input.vacationPending === true,
    input.thirteenthPending === true,
  ].filter(Boolean).length;

  let score = 18;
  score += Math.min(missingSignals * 10, 35);
  score += input.hasValueDoubts ? 10 : 0;
  score += input.dismissalType === "sem-justa-causa" ? 8 : 0;
  score += input.dismissalType === "acordo" ? 4 : 0;
  score += calculation.totalEstimated >= 30000 ? 18 : 0;
  score += calculation.totalEstimated >= 15000 ? 10 : 0;
  score += calculation.totalEstimated >= 7000 ? 6 : 0;
  score += calculation.totalMonthsWorked >= 36 ? 6 : 0;
  score -= input.receivedSomeAmount === true && missingSignals === 0 ? 10 : 0;
  score -= input.dismissalType === "simulacao" ? 4 : 0;

  const answered = countAnswered([
    input.salary,
    input.daysWorkedInMonth,
    input.yearsWorked,
    input.extraMonthsWorked,
    input.monthsWorkedCurrentYear,
    input.vacationOverduePeriods,
    input.proportionalVacationMonths,
    input.receivedSomeAmount,
    input.noticePaid,
    input.fgtsDeposited,
    input.multaPaid,
    input.vacationPending,
    input.thirteenthPending,
    input.hasValueDoubts,
  ]);

  const confidenceScore = buildConfidenceScore({
    answered,
    total: 14,
    documentarySignals: [
      input.noticePaid,
      input.fgtsDeposited,
      input.multaPaid,
      input.vacationPending,
      input.thirteenthPending,
    ].filter((value) => value !== null).length,
    documentaryMax: 5,
    specificity: input.dismissalType === "simulacao" ? 0.55 : 0.78,
    approximationPenalty: input.dismissalType === "simulacao" ? 8 : 0,
  });

  const normalizedScore = clampScore(score);
  const leadPriority = leadPriorityFromScore(normalizedScore);

  const potentialSeed =
    normalizedScore +
    (calculation.totalEstimated >= 20000 ? 12 : calculation.totalEstimated >= 8000 ? 6 : 0);

  return {
    score: normalizedScore,
    confidenceScore,
    leadPriority,
    potentialLevel: potentialLevelFromScore(clamp(potentialSeed, 0, 100)),
    scoreDetails: {
      missingSignals: missingSignals * 10,
      financialExposure:
        calculation.totalEstimated >= 30000
          ? 18
          : calculation.totalEstimated >= 15000
            ? 10
            : calculation.totalEstimated >= 7000
              ? 6
              : 0,
      durationBonus: calculation.totalMonthsWorked >= 36 ? 6 : 0,
      doubtSignal: input.hasValueDoubts ? 10 : 0,
    },
  };
}

export function buildTerminationSummary(
  input: TerminationInput,
  calculation: TerminationCalculation
) {
  const periodLabel =
    calculation.totalMonthsWorked >= 12
      ? `${Math.floor(calculation.totalMonthsWorked / 12)} ano(s) e ${
          calculation.totalMonthsWorked % 12
        } mes(es)`
      : `${calculation.totalMonthsWorked} mes(es)`;

  if (calculation.totalEstimated <= 0) {
    return `A triagem de rescisao nao encontrou, pelos marcadores atuais, uma diferenca financeira clara. O caso ainda pode merecer conferencia documental, sobretudo porque o vinculo foi de ${periodLabel} e o salario base informado foi de ${formatCurrency(
      input.salary
    )}.`;
  }

  return `A triagem de rescisao encontrou uma estimativa preliminar de ${formatCurrency(
    calculation.totalEstimated
  )} em verbas ou diferencas sensiveis, considerando ${periodLabel}, salario base de ${formatCurrency(
    input.salary
  )} e desligamento em ${input.dismissalType.replace(/-/g, " ")}.`;
}

export function buildTerminationOutcome(
  values: SimulatorFormValues
): SimulatorOutcome {
  const input = normalizeTerminationInput(values);
  const calculation = calculateTerminationEstimate(input);
  const scoring = scoreTerminationLead(input, calculation);

  const findings = calculation.breakdown
    .filter((item) => item.includedInEstimate && item.amount > 0)
    .map((item) => `${item.label}: ${formatCurrency(item.amount)}.`)
    .slice(0, 6);

  if (findings.length === 0 && input.hasValueDoubts) {
    findings.push(
      "Mesmo sem uma diferenca forte marcada no formulario, voce sinalizou duvida sobre os valores pagos na rescisao."
    );
  }

  if (findings.length === 0) {
    findings.push(
      "A leitura atual indica baixa densidade de diferencas rescisorias, mas ainda depende de conferir TRCT, FGTS e holerites finais."
    );
  }

  return createOutcome({
    simulatorSlug: "rescisao-trabalhista",
    score: scoring.score,
    confidenceScore: scoring.confidenceScore,
    leadPriority: scoring.leadPriority,
    potentialLevel: scoring.potentialLevel,
    summary: buildTerminationSummary(input, calculation),
    findings,
    observations: calculation.observations,
    recommendations: [
      "Conferir TRCT, chave do FGTS, extrato analitico e comprovantes das verbas rescisorias.",
      "Separar holerites dos ultimos meses e documentos que mostrem salario base, aviso e data exata da saida.",
      "Se houver divergencia entre o que foi pago e esta composicao preliminar, vale revisar o caso com analise humana.",
    ],
    disclaimers: [
      "Aviso previo, ferias e 13o foram tratados por regra simplificada do simulador.",
      "FGTS e multa rescisoria dependem de extrato e documentos do desligamento para validacao exata.",
    ],
    caution:
      "O total abaixo e uma estimativa conservadora de itens sensiveis da rescisao. O valor final depende da documentacao do encerramento do contrato.",
    estimate: {
      label: "Total estimado de verbas e diferencas sensiveis",
      min: roundMoney(calculation.totalEstimated * 0.9),
      max: roundMoney(calculation.totalEstimated * 1.1),
      helper:
        "A faixa foi arredondada para refletir incertezas de documentos, rubricas e datas exatas do desligamento.",
    },
    totalEstimated: calculation.totalEstimated,
    breakdown: calculation.breakdown,
    comparisonTags: ["demissaoProblematica", input.fgtsDeposited === false ? "fgtsNaoPago" : ""].filter(
      Boolean
    ) as string[],
    whatsappSummary: `Triagem de rescisao com prioridade ${scoring.leadPriority}, confianca ${scoring.confidenceScore}/100 e estimativa preliminar de ${formatCurrency(
      calculation.totalEstimated
    )}.`,
    scoreDetails: scoring.scoreDetails,
    meta: {
      dismissalType: input.dismissalType,
      totalMonthsWorked: calculation.totalMonthsWorked,
      noticeDays: calculation.noticeDays,
    },
  });
}
