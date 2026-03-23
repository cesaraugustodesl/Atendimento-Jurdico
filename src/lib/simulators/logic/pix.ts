import type { SimulatorFormValues, SimulatorOutcome } from "../types";
import {
  buildConfidenceScore,
  clampScore,
  countAnswered,
  createOutcome,
  formatCurrency,
  leadPriorityFromScore,
  normalizeChoice,
  normalizeNumber,
  normalizeYesNo,
  potentialLevelFromScore,
} from "./common";

const PIX_ELAPSED_OPTIONS = ["ate24h", "ate7dias", "ate30dias", "mais30dias"] as const;
const PIX_FRAUD_TYPES = [
  "falsa-central",
  "conta-invadida",
  "engenharia-social",
  "compra-falsa",
  "outro",
] as const;

type PixElapsed = (typeof PIX_ELAPSED_OPTIONS)[number];
type PixFraudType = (typeof PIX_FRAUD_TYPES)[number];

export interface PixScamInput {
  amount: number;
  elapsed: PixElapsed;
  fraudType: PixFraudType;
  notifiedBank: boolean | null;
  contactedPlatform: boolean | null;
  formalResponse: boolean | null;
  filedReport: boolean | null;
  hasProof: boolean | null;
  hasConversationPrints: boolean | null;
}

export interface PixScamCalculation {
  urgencyLevel: string;
  documentationStrength: string;
  claimPotential: string;
  recommendedNextStep: string;
  leadPriority: ReturnType<typeof leadPriorityFromScore>;
  score: number;
  confidenceScore: number;
  scoreDetails: Record<string, number>;
}

function urgencyScoreFromElapsed(elapsed: PixElapsed) {
  switch (elapsed) {
    case "ate24h":
      return { score: 35, label: "Muito alta" };
    case "ate7dias":
      return { score: 24, label: "Alta" };
    case "ate30dias":
      return { score: 12, label: "Media" };
    default:
      return { score: 5, label: "Baixa" };
  }
}

function valueScore(amount: number) {
  if (amount >= 10000) {
    return 16;
  }

  if (amount >= 3000) {
    return 10;
  }

  if (amount > 0) {
    return 6;
  }

  return 0;
}

export function normalizePixScamInput(values: SimulatorFormValues): PixScamInput {
  return {
    amount: normalizeNumber(values, "amount", 0, { min: 0 }),
    elapsed: normalizeChoice(
      values,
      "elapsed",
      PIX_ELAPSED_OPTIONS,
      "ate7dias"
    ) as PixElapsed,
    fraudType: normalizeChoice(
      values,
      "fraudType",
      PIX_FRAUD_TYPES,
      "outro"
    ) as PixFraudType,
    notifiedBank: normalizeYesNo(values, "notifiedBank"),
    contactedPlatform: normalizeYesNo(values, "contactedPlatform"),
    formalResponse: normalizeYesNo(values, "formalResponse"),
    filedReport: normalizeYesNo(values, "filedReport"),
    hasProof: normalizeYesNo(values, "hasProof"),
    hasConversationPrints: normalizeYesNo(values, "hasConversationPrints"),
  };
}

export function calculatePixScamAssessment(
  input: PixScamInput
): PixScamCalculation {
  const urgency = urgencyScoreFromElapsed(input.elapsed);
  const documentationSignals = [
    input.notifiedBank,
    input.contactedPlatform,
    input.formalResponse,
    input.filedReport,
    input.hasProof,
    input.hasConversationPrints,
  ].filter(Boolean).length;

  let score = 10;
  score += urgency.score;
  score += input.notifiedBank ? 18 : 0;
  score += input.hasProof ? 14 : 0;
  score += input.hasConversationPrints ? 10 : 0;
  score += input.filedReport ? 8 : 0;
  score += input.contactedPlatform ? 6 : 0;
  score += input.formalResponse ? 6 : 0;
  score += valueScore(input.amount);

  const documentationStrength =
    documentationSignals >= 5
      ? "Forte"
      : documentationSignals >= 3
        ? "Media"
        : "Inicial";

  const claimPotential =
    score >= 75
      ? "Alto"
      : score >= 45
        ? "Medio"
        : "Baixo";

  const answered = countAnswered([
    input.amount,
    input.elapsed,
    input.fraudType,
    input.notifiedBank,
    input.contactedPlatform,
    input.formalResponse,
    input.filedReport,
    input.hasProof,
    input.hasConversationPrints,
  ]);

  const confidenceScore = buildConfidenceScore({
    answered,
    total: 9,
    documentarySignals: documentationSignals,
    documentaryMax: 6,
    specificity: documentationSignals >= 3 ? 0.82 : 0.62,
    approximationPenalty: 4,
  });

  const normalizedScore = clampScore(score);
  const leadPriority = leadPriorityFromScore(normalizedScore);

  const recommendedNextStep =
    input.elapsed === "ate24h"
      ? "Priorizar contato humano imediato com linha do tempo, comprovante do PIX e protocolos do banco."
      : documentationSignals >= 3
        ? "Organizar prova documental e resposta do banco para analise rapida do caso."
        : "Completar documentacao basica antes da analise para aumentar a consistencia do caso.";

  return {
    urgencyLevel: urgency.label,
    documentationStrength,
    claimPotential,
    recommendedNextStep,
    leadPriority,
    score: normalizedScore,
    confidenceScore,
    scoreDetails: {
      urgencySignal: urgency.score,
      documentationSignal: documentationSignals * 6,
      financialSignal: valueScore(input.amount),
      notificationSignal: input.notifiedBank ? 18 : 0,
    },
  };
}

export function buildPixScamSummary(
  input: PixScamInput,
  result: PixScamCalculation
) {
  return `A triagem do golpe via PIX indica urgencia ${result.urgencyLevel.toLowerCase()}, documentacao ${result.documentationStrength.toLowerCase()} e potencial ${result.claimPotential.toLowerCase()}, considerando prejuizo informado de ${formatCurrency(
    input.amount
  )}.`;
}

export function buildPixScamOutcome(values: SimulatorFormValues): SimulatorOutcome {
  const input = normalizePixScamInput(values);
  const assessment = calculatePixScamAssessment(input);

  const findings = [
    `Prejuizo informado: ${formatCurrency(input.amount)}.`,
    `Urgencia inicial: ${assessment.urgencyLevel}.`,
    `Forca documental preliminar: ${assessment.documentationStrength}.`,
  ];

  if (input.notifiedBank) {
    findings.push("Voce informou comunicacao formal com o banco, o que costuma ser um marco importante na triagem.");
  } else {
    findings.push("Sem comunicacao formal ao banco, a triagem fica mais fragil para uma leitura inicial.");
  }

  if (input.hasProof || input.hasConversationPrints) {
    findings.push("Ha registro de comprovantes, prints ou conversas para sustentar a cronologia do golpe.");
  }

  return createOutcome({
    simulatorSlug: "golpe-pix",
    score: assessment.score,
    confidenceScore: assessment.confidenceScore,
    leadPriority: assessment.leadPriority,
    potentialLevel: potentialLevelFromScore(assessment.score),
    summary: buildPixScamSummary(input, assessment),
    findings,
    observations: [
      "Este simulador nao promete recuperacao do valor e nao substitui avaliacao individual do caso.",
      "Tempo de reacao, prova e resposta do banco costumam ser os eixos mais sensiveis na triagem inicial.",
    ],
    recommendations: [
      "Separar comprovante do PIX, conversas, prints, protocolos, resposta do banco e boletim de ocorrencia.",
      "Montar uma linha do tempo com horario do golpe, horario da comunicacao e canais acionados.",
      assessment.recommendedNextStep,
    ],
    disclaimers: [
      "O resultado e score-based, nao um calculo juridico exato de responsabilidade ou recuperacao.",
      "A resposta do banco, a documentacao e o tempo de reacao podem mudar bastante a leitura do caso.",
    ],
    caution:
      "Golpe via PIX exige analise contextual. O valor informado representa o prejuizo narrado, nao recuperacao garantida.",
    estimate: {
      label: "Prejuizo informado",
      valueText: formatCurrency(input.amount),
      helper: "Usado apenas como referencia de impacto economico e prioridade.",
    },
    totalEstimated: input.amount,
    whatsappSummary: `Triagem de golpe via PIX com prioridade ${assessment.leadPriority}, urgencia ${assessment.urgencyLevel.toLowerCase()} e prejuizo informado de ${formatCurrency(
      input.amount
    )}.`,
    urgencyLevel: assessment.urgencyLevel,
    documentationStrength: assessment.documentationStrength,
    claimPotential: assessment.claimPotential,
    recommendedNextStep: assessment.recommendedNextStep,
    scoreDetails: assessment.scoreDetails,
    meta: {
      elapsed: input.elapsed,
      fraudType: input.fraudType,
      notifiedBank: input.notifiedBank,
    },
  });
}
