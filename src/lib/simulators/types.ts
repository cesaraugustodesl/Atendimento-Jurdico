export type LeadClassification = "baixa" | "media" | "alta";
export type PotentialLevel = "baixo" | "medio" | "alto";

export type SimulatorFieldType =
  | "choice"
  | "yesno"
  | "multiselect"
  | "currency"
  | "number"
  | "textarea";

export interface SimulatorOption {
  value: string;
  label: string;
  description?: string;
}

export interface SimulatorField {
  id: string;
  label: string;
  type: SimulatorFieldType;
  required?: boolean;
  placeholder?: string;
  helper?: string;
  options?: SimulatorOption[];
  min?: number;
  max?: number;
  step?: number;
}

export interface SimulatorStepDefinition {
  id: string;
  title: string;
  description: string;
  fields: SimulatorField[];
}

export type SimulatorValue = string | number | string[] | null;
export type SimulatorFormValues = Record<string, SimulatorValue>;

export interface SimulatorEstimate {
  label: string;
  min?: number;
  max?: number;
  valueText?: string;
  helper?: string;
}

export interface SimulatorBreakdownItem {
  key: string;
  label: string;
  amount?: number;
  valueText?: string;
  helper?: string;
  includedInEstimate?: boolean;
}

export interface LeadScoreResult {
  score: number;
  classification: LeadClassification;
  leadPriority: LeadClassification;
  confidenceScore: number;
  potentialLevel: PotentialLevel;
  potentialLabel: string;
}

export interface BaseSimulatorResult extends LeadScoreResult {
  simulatorSlug: string;
  calculatedAt: string;
  summary: string;
  findings: string[];
  observations: string[];
  recommendations: string[];
  disclaimers: string[];
  caution?: string;
  comparisonTags?: string[];
  whatsappSummary: string;
  scoreDetails?: Record<string, number>;
  meta?: Record<string, string | number | boolean | null>;
}

export interface MonetaryEstimateResult extends BaseSimulatorResult {
  totalEstimated?: number;
  estimate?: SimulatorEstimate;
  breakdown?: SimulatorBreakdownItem[];
}

export interface TriageResult extends BaseSimulatorResult {
  urgencyLevel?: string;
  documentationStrength?: string;
  claimPotential?: string;
  recommendedNextStep?: string;
}

export interface SimulatorOutcome extends MonetaryEstimateResult, TriageResult {
  potentialLabel: string;
}

export interface SimulatorDefinition {
  id: string;
  slug: string;
  path: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  heroTitle: string;
  heroDescription: string;
  area: string;
  timeToComplete: string;
  eyebrow?: string;
  introBullets: string[];
  stepLabels: string[];
  seoTitle: string;
  seoDescription: string;
  initialValues: SimulatorFormValues;
  steps: SimulatorStepDefinition[];
  supportsPublicCaseComparison?: boolean;
  comparisonTitle?: string;
  comparisonSubtitle?: string;
  computeResult: (
    values: SimulatorFormValues,
    context: { caseSummary: string }
  ) => SimulatorOutcome;
}
