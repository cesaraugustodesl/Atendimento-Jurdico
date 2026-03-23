export type LeadClassification = "baixa" | "media" | "alta";

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

export type SimulatorValue = string | number | string[];
export type SimulatorFormValues = Record<string, SimulatorValue>;

export interface SimulatorEstimate {
  label: string;
  min?: number;
  max?: number;
  valueText?: string;
  helper?: string;
}

export interface SimulatorOutcome {
  score: number;
  classification: LeadClassification;
  potentialLabel: string;
  summary: string;
  findings: string[];
  recommendations: string[];
  caution?: string;
  estimate?: SimulatorEstimate;
  comparisonTags?: string[];
  whatsappSummary: string;
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
