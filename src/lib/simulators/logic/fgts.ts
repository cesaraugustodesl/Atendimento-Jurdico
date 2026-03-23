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

const FGTS_ABSENCE_LEVELS = ["alguns", "muitos", "quaseTodos"] as const;
type FgtsAbsenceLevel = (typeof FGTS_ABSENCE_LEVELS)[number];

export interface FgtsInput {
  salary: number;
  monthsWorked: number;
  checkedStatement: boolean | null;
  absenceLevel: FgtsAbsenceLevel;
  employmentEnded: boolean | null;
  companyActive: boolean | null;
  hasProof: boolean | null;
}

export interface FgtsCalculation {
  monthlyFgts: number;
  fgtsExpected: number;
  missingRatio: number;
  fgtsPossiblyMissing: number;
  breakdown: Array<{
    key: string;
    label: string;
    amount: number;
    helper: string;
    includedInEstimate: boolean;
  }>;
  observations: string[];
}

const FGTS_RATIO_MAP: Record<FgtsAbsenceLevel, number> = {
  alguns: 0.2,
  muitos: 0.5,
  quaseTodos: 0.9,
};

export function normalizeFgtsInput(values: SimulatorFormValues): FgtsInput {
  return {
    salary: normalizeNumber(values, "salary", 0, { min: 0 }),
    monthsWorked: normalizeNumber(values, "monthsWorked", 0, {
      min: 1,
      max: 600,
      integer: true,
    }),
    checkedStatement: normalizeYesNo(values, "checkedStatement"),
    absenceLevel: normalizeChoice(
      values,
      "absenceLevel",
      FGTS_ABSENCE_LEVELS,
      "alguns"
    ) as FgtsAbsenceLevel,
    employmentEnded: normalizeYesNo(values, "employmentEnded"),
    companyActive: normalizeYesNo(values, "companyActive"),
    hasProof: normalizeYesNo(values, "hasProof"),
  };
}

export function calculateFgtsMissingEstimate(input: FgtsInput): FgtsCalculation {
  const monthlyFgts = roundMoney(input.salary * 0.08);
  const fgtsExpected = roundMoney(monthlyFgts * input.monthsWorked);
  const missingRatio = FGTS_RATIO_MAP[input.absenceLevel];
  const fgtsPossiblyMissing = roundMoney(fgtsExpected * missingRatio);

  const breakdown = [
    {
      key: "monthly-fgts",
      label: "FGTS mensal estimado",
      amount: monthlyFgts,
      helper: "Referencia simplificada usando 8% do salario medio informado.",
      includedInEstimate: false,
    },
    {
      key: "expected-fgts",
      label: "FGTS esperado no periodo",
      amount: fgtsExpected,
      helper:
        "Referencia total do vinculo. Nao significa automaticamente valor exigivel sem conferencia do extrato.",
      includedInEstimate: false,
    },
    {
      key: "missing-fgts",
      label: "FGTS possivelmente nao depositado",
      amount: fgtsPossiblyMissing,
      helper:
        "Estimativa preliminar conforme a extensao da falha indicada no formulario e sujeita a validacao pelo extrato oficial.",
      includedInEstimate: true,
    },
  ];

  const observations = [
    "O simulador trata a falta de FGTS por cenarios conservadores de ausencia parcial ou quase total.",
  ];

  if (input.employmentEnded) {
    observations.push(
      "Como o contrato ja terminou, o caso pode ter reflexos rescisorios adicionais que nao foram somados automaticamente."
    );
  }

  if (!input.checkedStatement) {
    observations.push(
      "Sem extrato conferido, a estimativa fica mais aberta e pode superestimar ou subestimar a irregularidade real."
    );
  }

  return {
    monthlyFgts,
    fgtsExpected,
    missingRatio,
    fgtsPossiblyMissing,
    breakdown,
    observations,
  };
}

export function scoreFgtsLead(input: FgtsInput, result: FgtsCalculation) {
  let score = 14;
  score += input.checkedStatement ? 18 : 0;
  score += input.hasProof ? 12 : 0;
  score += input.absenceLevel === "quaseTodos" ? 20 : input.absenceLevel === "muitos" ? 12 : 6;
  score += input.employmentEnded ? 10 : 0;
  score += input.companyActive === false ? 6 : 0;
  score += result.fgtsPossiblyMissing >= 10000 ? 14 : result.fgtsPossiblyMissing >= 4000 ? 8 : 4;
  score += input.monthsWorked >= 36 ? 8 : input.monthsWorked >= 12 ? 4 : 0;

  const answered = countAnswered([
    input.salary,
    input.monthsWorked,
    input.checkedStatement,
    input.absenceLevel,
    input.employmentEnded,
    input.companyActive,
    input.hasProof,
  ]);

  const confidenceScore = buildConfidenceScore({
    answered,
    total: 7,
    documentarySignals: [
      input.checkedStatement,
      input.hasProof,
      input.employmentEnded,
    ].filter((value) => value === true).length,
    documentaryMax: 3,
    specificity: input.checkedStatement ? 0.84 : 0.6,
    approximationPenalty: input.checkedStatement ? 2 : 10,
  });

  const normalizedScore = clampScore(score);
  const leadPriority = leadPriorityFromScore(normalizedScore);
  const potentialSeed = clamp(
    normalizedScore +
      (result.fgtsPossiblyMissing >= 12000
        ? 12
        : result.fgtsPossiblyMissing >= 5000
          ? 6
          : 0),
    0,
    100
  );

  return {
    score: normalizedScore,
    confidenceScore,
    leadPriority,
    potentialLevel: potentialLevelFromScore(potentialSeed),
    scoreDetails: {
      documentarySignal: input.checkedStatement ? 18 : 0,
      proofSignal: input.hasProof ? 12 : 0,
      absenceSignal:
        input.absenceLevel === "quaseTodos" ? 20 : input.absenceLevel === "muitos" ? 12 : 6,
      financialExposure:
        result.fgtsPossiblyMissing >= 10000
          ? 14
          : result.fgtsPossiblyMissing >= 4000
            ? 8
            : 4,
    },
  };
}

export function buildFgtsSummary(input: FgtsInput, result: FgtsCalculation) {
  return `A triagem estima FGTS esperado de ${formatCurrency(
    result.fgtsExpected
  )} no periodo e possivel falha de ${formatCurrency(
    result.fgtsPossiblyMissing
  )}, usando salario medio de ${formatCurrency(input.salary)} e vinculo de ${
    input.monthsWorked
  } mes(es).`;
}

export function buildFgtsOutcome(values: SimulatorFormValues): SimulatorOutcome {
  const input = normalizeFgtsInput(values);
  const calculation = calculateFgtsMissingEstimate(input);
  const scoring = scoreFgtsLead(input, calculation);

  const findings = [
    `FGTS mensal aproximado: ${formatCurrency(calculation.monthlyFgts)}.`,
    `FGTS esperado no vinculo: ${formatCurrency(calculation.fgtsExpected)}.`,
    `Faixa preliminar de FGTS possivelmente nao depositado: ${formatCurrency(
      calculation.fgtsPossiblyMissing
    )}.`,
  ];

  if (input.checkedStatement) {
    findings.push("Voce informou que o extrato foi conferido, o que melhora a confiabilidade da triagem.");
  }

  if (input.hasProof) {
    findings.push("Voce tambem sinalizou documentos para confrontar o extrato com o contrato.");
  }

  return createOutcome({
    simulatorSlug: "fgts-nao-depositado",
    score: scoring.score,
    confidenceScore: scoring.confidenceScore,
    leadPriority: scoring.leadPriority,
    potentialLevel: scoring.potentialLevel,
    summary: buildFgtsSummary(input, calculation),
    findings,
    observations: calculation.observations,
    recommendations: [
      "Separar extrato analitico do FGTS, holerites, contrato e documentos de desligamento, se houver.",
      "Cruzar os meses sem deposito com o periodo efetivo do contrato para validar a extensao da falha.",
      "Se a empresa ja encerrou atividades ou o contrato terminou, vale acelerar a analise do caso.",
    ],
    disclaimers: [
      "O valor principal e uma estimativa preliminar baseada em 8% do salario medio mensal.",
      "A validacao exata depende do extrato oficial do FGTS e da extensao real dos meses sem deposito.",
    ],
    caution:
      "A conta abaixo serve para triagem e organizacao do caso. O valor exato do FGTS nao depositado depende do extrato oficial.",
    estimate: {
      label: "FGTS possivelmente nao depositado",
      min: roundMoney(calculation.fgtsPossiblyMissing * 0.9),
      max: roundMoney(calculation.fgtsPossiblyMissing * 1.1),
      helper: "Faixa preliminar sujeita a revisao pelo extrato analitico.",
    },
    totalEstimated: calculation.fgtsPossiblyMissing,
    breakdown: calculation.breakdown,
    comparisonTags: ["fgtsNaoPago", input.monthsWorked >= 36 ? "tempoMaisTresAnos" : ""].filter(
      Boolean
    ) as string[],
    whatsappSummary: `Triagem de FGTS com prioridade ${scoring.leadPriority}, confianca ${scoring.confidenceScore}/100 e indicio preliminar de ${formatCurrency(
      calculation.fgtsPossiblyMissing
    )} possivelmente nao depositados.`,
    scoreDetails: scoring.scoreDetails,
    meta: {
      monthsWorked: input.monthsWorked,
      checkedStatement: input.checkedStatement,
      absenceLevel: input.absenceLevel,
    },
  });
}
