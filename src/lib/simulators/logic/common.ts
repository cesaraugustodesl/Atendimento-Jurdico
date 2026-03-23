import type {
  LeadClassification,
  PotentialLevel,
  SimulatorBreakdownItem,
  SimulatorEstimate,
  SimulatorFormValues,
  SimulatorOutcome,
  SimulatorValue,
} from "../types";

interface NormalizeNumberOptions {
  min?: number;
  max?: number;
  integer?: boolean;
}

interface ConfidenceScoreInput {
  answered: number;
  total: number;
  documentarySignals?: number;
  documentaryMax?: number;
  specificity?: number;
  approximationPenalty?: number;
}

interface CreateOutcomeInput {
  simulatorSlug: string;
  score: number;
  confidenceScore: number;
  leadPriority?: LeadClassification;
  potentialLevel?: PotentialLevel;
  summary: string;
  findings: string[];
  observations?: string[];
  recommendations: string[];
  disclaimers?: string[];
  caution?: string;
  estimate?: SimulatorEstimate;
  breakdown?: SimulatorBreakdownItem[];
  comparisonTags?: string[];
  whatsappSummary: string;
  scoreDetails?: Record<string, number>;
  meta?: Record<string, string | number | boolean | null>;
  urgencyLevel?: string;
  documentationStrength?: string;
  claimPotential?: string;
  recommendedNextStep?: string;
  totalEstimated?: number;
}

const DEFAULT_DISCLAIMERS = [
  "Analise preliminar informativa.",
  "Estimativa sujeita a validacao documental.",
  "Nao substitui avaliacao juridica individualizada.",
];

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function clampScore(score: number) {
  return clamp(Math.round(score), 0, 100);
}

export function roundMoney(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.round(value * 100) / 100;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(roundMoney(value));
}

function toFiniteNumber(value: SimulatorValue | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function normalizeText(values: SimulatorFormValues, key: string) {
  const value = values[key];
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeList(values: SimulatorFormValues, key: string) {
  const value = values[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

export function normalizeOptionalNumber(
  values: SimulatorFormValues,
  key: string,
  options: NormalizeNumberOptions = {}
) {
  const raw = toFiniteNumber(values[key]);
  if (raw === null) {
    return null;
  }

  let normalized = raw;
  if (options.integer) {
    normalized = Math.round(normalized);
  }

  if (typeof options.min === "number") {
    normalized = Math.max(options.min, normalized);
  }

  if (typeof options.max === "number") {
    normalized = Math.min(options.max, normalized);
  }

  return normalized;
}

export function normalizeNumber(
  values: SimulatorFormValues,
  key: string,
  fallback: number,
  options: NormalizeNumberOptions = {}
) {
  const normalized = normalizeOptionalNumber(values, key, options);
  return normalized === null ? fallback : normalized;
}

export function normalizeYesNo(values: SimulatorFormValues, key: string) {
  const value = normalizeText(values, key);
  if (value === "sim") {
    return true;
  }

  if (value === "nao") {
    return false;
  }

  return null;
}

export function normalizeChoice(
  values: SimulatorFormValues,
  key: string,
  allowedValues: readonly string[],
  fallback: string
) {
  const value = normalizeText(values, key);
  return allowedValues.includes(value) ? value : fallback;
}

export function monthsFromYearsMonths(years: number, extraMonths = 0) {
  const safeYears = Math.max(0, Math.floor(years));
  const safeExtraMonths = clamp(Math.floor(extraMonths), 0, 11);
  return safeYears * 12 + safeExtraMonths;
}

export function countAnswered(values: Array<SimulatorValue | boolean | null | undefined>) {
  return values.reduce<number>((count, value) => {
    if (typeof value === "boolean") {
      return count + 1;
    }

    if (typeof value === "number") {
      return Number.isFinite(value) ? count + 1 : count;
    }

    if (typeof value === "string") {
      return value.trim().length > 0 ? count + 1 : count;
    }

    if (Array.isArray(value)) {
      return value.length > 0 ? count + 1 : count;
    }

    return count;
  }, 0);
}

export function buildConfidenceScore({
  answered,
  total,
  documentarySignals = 0,
  documentaryMax = 0,
  specificity = 0.7,
  approximationPenalty = 0,
}: ConfidenceScoreInput) {
  const completenessScore = total > 0 ? (answered / total) * 55 : 55;
  const documentaryScore =
    documentaryMax > 0 ? (documentarySignals / documentaryMax) * 25 : 0;
  const specificityScore = clamp(Math.round(specificity * 20), 0, 20);

  return clampScore(
    10 + completenessScore + documentaryScore + specificityScore - approximationPenalty
  );
}

export function leadPriorityFromScore(score: number): LeadClassification {
  if (score >= 70) {
    return "alta";
  }

  if (score >= 40) {
    return "media";
  }

  return "baixa";
}

export function potentialLevelFromScore(score: number): PotentialLevel {
  if (score >= 70) {
    return "alto";
  }

  if (score >= 40) {
    return "medio";
  }

  return "baixo";
}

export function potentialLabelFromLevel(level: PotentialLevel) {
  if (level === "alto") {
    return "Potencial inicial alto";
  }

  if (level === "medio") {
    return "Potencial inicial medio";
  }

  return "Potencial inicial baixo";
}

export function sumBreakdown(items: SimulatorBreakdownItem[] = []) {
  return roundMoney(
    items.reduce((total, item) => {
      if (!item.includedInEstimate || typeof item.amount !== "number") {
        return total;
      }

      return total + item.amount;
    }, 0)
  );
}

export function createOutcome({
  simulatorSlug,
  score,
  confidenceScore,
  leadPriority,
  potentialLevel,
  summary,
  findings,
  observations = [],
  recommendations,
  disclaimers = [],
  caution,
  estimate,
  breakdown = [],
  comparisonTags = [],
  whatsappSummary,
  scoreDetails,
  meta,
  urgencyLevel,
  documentationStrength,
  claimPotential,
  recommendedNextStep,
  totalEstimated,
}: CreateOutcomeInput): SimulatorOutcome {
  const normalizedScore = clampScore(score);
  const resolvedLeadPriority = leadPriority ?? leadPriorityFromScore(normalizedScore);
  const resolvedPotentialLevel =
    potentialLevel ?? potentialLevelFromScore(normalizedScore);
  const resolvedTotal =
    typeof totalEstimated === "number" ? roundMoney(totalEstimated) : sumBreakdown(breakdown);

  return {
    simulatorSlug,
    calculatedAt: new Date().toISOString(),
    score: normalizedScore,
    classification: resolvedLeadPriority,
    leadPriority: resolvedLeadPriority,
    confidenceScore: clampScore(confidenceScore),
    potentialLevel: resolvedPotentialLevel,
    potentialLabel: potentialLabelFromLevel(resolvedPotentialLevel),
    summary,
    findings,
    observations,
    recommendations,
    disclaimers: Array.from(new Set([...DEFAULT_DISCLAIMERS, ...disclaimers])),
    caution,
    estimate,
    totalEstimated: resolvedTotal > 0 ? resolvedTotal : undefined,
    breakdown,
    comparisonTags,
    whatsappSummary,
    scoreDetails,
    meta,
    urgencyLevel,
    documentationStrength,
    claimPotential,
    recommendedNextStep,
  };
}
