import type { SimulatorFormValues, SimulatorOutcome } from "../types";
import {
  buildConfidenceScore,
  clamp,
  clampScore,
  countAnswered,
  createOutcome,
  formatCurrency,
  leadPriorityFromScore,
  normalizeChoice,
  normalizeNumber,
  normalizeYesNo,
  potentialLevelFromScore,
  roundMoney,
} from "./common";

const OVERTIME_FREQUENCIES = [
  "eventual",
  "1-2-semana",
  "3-4-semana",
  "quase-todos-dias",
] as const;

export type OvertimeFrequency = (typeof OVERTIME_FREQUENCIES)[number];

export interface OvertimeInput {
  salary: number;
  weeklyContractHours: number;
  actualHoursPerDay: number;
  daysPerWeek: number;
  monthsInPattern: number;
  breakMinutes: number;
  overtimeFrequency: OvertimeFrequency;
  sundayWork: boolean | null;
  holidayWork: boolean | null;
  nightWork: boolean | null;
  paidCorrectly: boolean | null;
}

export interface OvertimeCalculation {
  hourlyRate: number;
  weeklyActualHours: number;
  weeklyExcessHours: number;
  monthlyOvertimeHours: number;
  intervalSuppressionHours: number;
  estimatedCommonOvertimePay: number;
  estimatedIntervalPay: number;
  totalEstimated: number;
  additionalsPossible: string[];
  breakdown: Array<{
    key: string;
    label: string;
    amount: number;
    helper: string;
    includedInEstimate: boolean;
  }>;
}

const FREQUENCY_FACTOR: Record<OvertimeFrequency, number> = {
  eventual: 0.25,
  "1-2-semana": 0.45,
  "3-4-semana": 0.75,
  "quase-todos-dias": 0.95,
};

export function getHourlyRate(salary: number, weeklyContractHours: number) {
  const monthlyReferenceHours = Math.max(weeklyContractHours * 5, 1);
  return roundMoney(salary / monthlyReferenceHours);
}

export function estimateWeeklyExcessHours(
  weeklyContractHours: number,
  actualHoursPerDay: number,
  daysPerWeek: number,
  frequency: OvertimeFrequency
) {
  const weeklyActualHours = actualHoursPerDay * daysPerWeek;
  const rawExcess = Math.max(weeklyActualHours - weeklyContractHours, 0);
  return roundMoney(rawExcess * FREQUENCY_FACTOR[frequency]);
}

export function estimateMonthlyOvertimeHours(weeklyExcessHours: number) {
  return roundMoney(weeklyExcessHours * 4.5);
}

export function computeOvertimePay(
  hours: number,
  hourlyRate: number,
  additionalRate = 0.5
) {
  return roundMoney(hours * hourlyRate * (1 + additionalRate));
}

export function normalizeOvertimeInput(values: SimulatorFormValues): OvertimeInput {
  return {
    salary: normalizeNumber(values, "salary", 0, { min: 0 }),
    weeklyContractHours: normalizeNumber(values, "weeklyContractHours", 44, {
      min: 1,
      max: 60,
    }),
    actualHoursPerDay: normalizeNumber(values, "actualHoursPerDay", 0, {
      min: 0,
      max: 18,
    }),
    daysPerWeek: normalizeNumber(values, "daysPerWeek", 0, {
      min: 1,
      max: 7,
      integer: true,
    }),
    monthsInPattern: normalizeNumber(values, "monthsInPattern", 0, {
      min: 1,
      max: 120,
      integer: true,
    }),
    breakMinutes: normalizeNumber(values, "breakMinutes", 60, {
      min: 0,
      max: 180,
      integer: true,
    }),
    overtimeFrequency: normalizeChoice(
      values,
      "overtimeFrequency",
      OVERTIME_FREQUENCIES,
      "1-2-semana"
    ) as OvertimeFrequency,
    sundayWork: normalizeYesNo(values, "sundayWork"),
    holidayWork: normalizeYesNo(values, "holidayWork"),
    nightWork: normalizeYesNo(values, "nightWork"),
    paidCorrectly: normalizeYesNo(values, "paidCorrectly"),
  };
}

export function calculateOvertimeEstimate(
  input: OvertimeInput
): OvertimeCalculation {
  const hourlyRate = getHourlyRate(input.salary, input.weeklyContractHours);
  const weeklyActualHours = roundMoney(input.actualHoursPerDay * input.daysPerWeek);
  const weeklyExcessHours = estimateWeeklyExcessHours(
    input.weeklyContractHours,
    input.actualHoursPerDay,
    input.daysPerWeek,
    input.overtimeFrequency
  );
  const monthlyOvertimeHours = estimateMonthlyOvertimeHours(weeklyExcessHours);

  const missingBreakHoursPerDay =
    input.actualHoursPerDay > 6 ? Math.max(60 - input.breakMinutes, 0) / 60 : 0;
  const intervalSuppressionHours = roundMoney(
    missingBreakHoursPerDay *
      input.daysPerWeek *
      4.5 *
      FREQUENCY_FACTOR[input.overtimeFrequency]
  );

  const paymentFactor = input.paidCorrectly === true ? 0.3 : 1;
  const estimatedCommonOvertimePay = roundMoney(
    computeOvertimePay(monthlyOvertimeHours, hourlyRate) *
      input.monthsInPattern *
      paymentFactor
  );
  const estimatedIntervalPay = roundMoney(
    computeOvertimePay(intervalSuppressionHours, hourlyRate) *
      input.monthsInPattern *
      paymentFactor
  );

  const additionalsPossible: string[] = [];
  if (input.sundayWork) {
    additionalsPossible.push(
      "Trabalho em domingos pode gerar reflexos ou adicional superior, conforme escala e compensacao."
    );
  }
  if (input.holidayWork) {
    additionalsPossible.push(
      "Trabalho em feriados pode exigir adicional especifico ou pagamento em dobro, conforme o caso."
    );
  }
  if (input.nightWork) {
    additionalsPossible.push(
      "Trabalho apos as 22h pode envolver adicional noturno e reflexos, nao calculados de forma exata aqui."
    );
  }

  const breakdown = [
    {
      key: "common-overtime",
      label: "Horas extras comuns (50%)",
      amount: estimatedCommonOvertimePay,
      helper:
        "Base aproximada: valor-hora x horas extras mensais estimadas x adicional de 50% no periodo informado.",
      includedInEstimate: estimatedCommonOvertimePay > 0,
    },
    {
      key: "interval",
      label: "Intervalo intrajornada reduzido",
      amount: estimatedIntervalPay,
      helper:
        "Estimativa conservadora baseada nos minutos de intervalo abaixo de 60 minutos em jornadas superiores a 6 horas.",
      includedInEstimate: estimatedIntervalPay > 0,
    },
    {
      key: "sunday-holiday",
      label: "Domingos e feriados",
      amount: 0,
      helper:
        "Mantido fora do total para evitar falsa precisao. Pode elevar a conta conforme prova e escala real.",
      includedInEstimate: false,
    },
    {
      key: "night-work",
      label: "Adicional noturno",
      amount: 0,
      helper:
        "Mantido fora do total porque depende de horario exato, reducao ficta da hora e recibos.",
      includedInEstimate: false,
    },
  ];

  const totalEstimated = roundMoney(estimatedCommonOvertimePay + estimatedIntervalPay);

  return {
    hourlyRate,
    weeklyActualHours,
    weeklyExcessHours,
    monthlyOvertimeHours,
    intervalSuppressionHours,
    estimatedCommonOvertimePay,
    estimatedIntervalPay,
    totalEstimated,
    additionalsPossible,
    breakdown,
  };
}

export function scoreOvertimeLead(input: OvertimeInput, result: OvertimeCalculation) {
  let score = 16;
  score += result.weeklyExcessHours >= 10 ? 18 : result.weeklyExcessHours >= 5 ? 12 : 0;
  score += result.monthlyOvertimeHours >= 20 ? 10 : result.monthlyOvertimeHours >= 8 ? 6 : 0;
  score += input.paidCorrectly === false ? 18 : input.paidCorrectly === true ? -8 : 0;
  score += result.intervalSuppressionHours > 0 ? 8 : 0;
  score += input.sundayWork ? 6 : 0;
  score += input.holidayWork ? 6 : 0;
  score += input.nightWork ? 4 : 0;
  score += input.monthsInPattern >= 24 ? 8 : input.monthsInPattern >= 12 ? 4 : 0;
  score += result.totalEstimated >= 20000 ? 12 : result.totalEstimated >= 8000 ? 6 : 0;

  const answered = countAnswered([
    input.salary,
    input.weeklyContractHours,
    input.actualHoursPerDay,
    input.daysPerWeek,
    input.monthsInPattern,
    input.breakMinutes,
    input.overtimeFrequency,
    input.sundayWork,
    input.holidayWork,
    input.nightWork,
    input.paidCorrectly,
  ]);

  const confidenceScore = buildConfidenceScore({
    answered,
    total: 11,
    documentarySignals: [
      input.paidCorrectly,
      input.sundayWork,
      input.holidayWork,
      input.nightWork,
    ].filter((value) => value !== null).length,
    documentaryMax: 4,
    specificity: result.weeklyExcessHours > 0 ? 0.82 : 0.62,
    approximationPenalty: input.paidCorrectly === true ? 6 : 2,
  });

  const normalizedScore = clampScore(score);
  const leadPriority = leadPriorityFromScore(normalizedScore);
  const potentialSeed = clamp(
    normalizedScore +
      (result.totalEstimated >= 15000 ? 10 : result.totalEstimated >= 5000 ? 5 : 0),
    0,
    100
  );

  return {
    score: normalizedScore,
    confidenceScore,
    leadPriority,
    potentialLevel: potentialLevelFromScore(potentialSeed),
    scoreDetails: {
      overtimeDensity:
        result.weeklyExcessHours >= 10 ? 18 : result.weeklyExcessHours >= 5 ? 12 : 0,
      paymentSignal: input.paidCorrectly === false ? 18 : 0,
      durationSignal: input.monthsInPattern >= 24 ? 8 : input.monthsInPattern >= 12 ? 4 : 0,
      additionalSignals:
        (input.sundayWork ? 6 : 0) + (input.holidayWork ? 6 : 0) + (input.nightWork ? 4 : 0),
    },
  };
}

export function buildOvertimeSummary(result: OvertimeCalculation) {
  if (result.totalEstimated <= 0) {
    return `A triagem de horas extras nao encontrou excesso relevante de jornada com os dados informados. Ainda assim, vale revisar espelhos de ponto e mensagens se a jornada real era diferente do contrato.`;
  }

  return `A triagem estima cerca de ${result.monthlyOvertimeHours.toFixed(
    1
  )} hora(s) extra(s) por mes, com valor-hora aproximado de ${formatCurrency(
    result.hourlyRate
  )} e potencial preliminar de ${formatCurrency(
    result.totalEstimated
  )} no periodo informado.`;
}

export function buildOvertimeOutcome(values: SimulatorFormValues): SimulatorOutcome {
  const input = normalizeOvertimeInput(values);
  const calculation = calculateOvertimeEstimate(input);
  const scoring = scoreOvertimeLead(input, calculation);

  const findings = [
    calculation.weeklyExcessHours > 0
      ? `Excesso semanal estimado em ${calculation.weeklyExcessHours.toFixed(
          1
        )} hora(s).`
      : "Com os horarios informados, nao apareceu excesso semanal claro.",
    calculation.estimatedCommonOvertimePay > 0
      ? `Horas extras comuns estimadas em ${formatCurrency(
          calculation.estimatedCommonOvertimePay
        )} no periodo.`
      : "Sem faixa relevante de horas extras comuns no calculo simplificado.",
  ];

  if (calculation.estimatedIntervalPay > 0) {
    findings.push(
      `Intervalo reduzido pode acrescentar cerca de ${formatCurrency(
        calculation.estimatedIntervalPay
      )} na leitura preliminar.`
    );
  }

  findings.push(...calculation.additionalsPossible);

  return createOutcome({
    simulatorSlug: "horas-extras",
    score: scoring.score,
    confidenceScore: scoring.confidenceScore,
    leadPriority: scoring.leadPriority,
    potentialLevel: scoring.potentialLevel,
    summary: buildOvertimeSummary(calculation),
    findings,
    observations: [
      "Domingos, feriados e adicional noturno ficaram fora do total principal para evitar falsa precisao.",
      input.paidCorrectly === true
        ? "Como voce marcou que havia pagamento de horas extras, o total foi reduzido para um cenario mais conservador."
        : "Como voce marcou pagamento incorreto, a estimativa considerou o periodo integral informado.",
    ],
    recommendations: [
      "Separar espelhos de ponto, escalas, conversas, holerites e comprovantes de jornada real.",
      "Montar uma rotina media de entrada, saida, intervalo e frequencia das horas extras.",
      "Se havia domingos, feriados ou trabalho noturno, levar esses dados para analise humana pode aumentar a precisao da conta.",
    ],
    disclaimers: [
      "O calculo usa jornada mensal estimada e adicional basico de 50% para horas extras comuns.",
      "Adicional noturno, domingos e feriados dependem de prova especifica e podem alterar o resultado final.",
    ],
    caution:
      "A conta de horas extras depende muito da prova de jornada. O simulador entrega uma leitura prudente para triagem, nao um calculo pericial.",
    estimate: {
      label: "Total preliminar de horas extras e reflexos basicos",
      min: roundMoney(calculation.totalEstimated * 0.85),
      max: roundMoney(calculation.totalEstimated * 1.15),
      helper:
        "Faixa principal sem incluir integralmente domingos, feriados e adicional noturno.",
    },
    totalEstimated: calculation.totalEstimated,
    breakdown: calculation.breakdown,
    comparisonTags: [
      "horasExtrasNaoPagas",
      calculation.estimatedIntervalPay > 0 ? "intervaloIrregular" : "",
      input.sundayWork || input.holidayWork ? "domingosFeriados" : "",
      input.nightWork ? "trabalhoNoturno" : "",
    ].filter(Boolean) as string[],
    whatsappSummary: `Triagem de horas extras com prioridade ${scoring.leadPriority}, confianca ${scoring.confidenceScore}/100 e faixa principal de ${formatCurrency(
      calculation.totalEstimated
    )}.`,
    scoreDetails: scoring.scoreDetails,
    meta: {
      monthlyOvertimeHours: calculation.monthlyOvertimeHours,
      weeklyExcessHours: calculation.weeklyExcessHours,
      monthsInPattern: input.monthsInPattern,
    },
  });
}
