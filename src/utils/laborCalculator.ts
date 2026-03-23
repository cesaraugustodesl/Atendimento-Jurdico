export type ContractType = 'clt' | 'pj' | 'informal';

export type Classification = 'baixa' | 'media' | 'alta';

export interface Violations {
  horasExtrasNaoPagas: boolean;
  domingosFeriados: boolean;
  intervaloIrregular: boolean;
  trabalhoNoturno: boolean;
  insalubridade: boolean;
  fgtsNaoPago: boolean;
  demissaoProblematica: boolean;
  tempoMaisTresAnos: boolean;
}

export interface SimulatorFormData {
  contractType: ContractType;
  salary: number;
  yearsWorked: number;
  violations: Violations;
  name: string;
  whatsapp: string;
  email: string;
}

export interface SimulatorResult {
  score: number;
  classification: Classification;
  estimateMin: number;
  estimateMax: number;
  identifiedRights: string[];
  contractInsight: string;
}

const VIOLATION_SCORES: Record<keyof Violations, number> = {
  horasExtrasNaoPagas: 15,
  domingosFeriados: 10,
  intervaloIrregular: 10,
  trabalhoNoturno: 10,
  insalubridade: 10,
  fgtsNaoPago: 20,
  demissaoProblematica: 15,
  tempoMaisTresAnos: 10,
};

const VIOLATION_LABELS: Record<keyof Violations, string> = {
  horasExtrasNaoPagas: 'Horas extras nao pagas',
  domingosFeriados: 'Trabalho em domingos e feriados sem compensacao',
  intervaloIrregular: 'Intervalo de almoco/descanso irregular',
  trabalhoNoturno: 'Adicional noturno nao pago',
  insalubridade: 'Adicional de insalubridade/periculosidade',
  fgtsNaoPago: 'FGTS nao depositado corretamente',
  demissaoProblematica: 'Demissao sem pagamento correto das verbas',
  tempoMaisTresAnos: 'Mais de 3 anos na empresa (maior base de calculo)',
};

const CONTRACT_INSIGHTS: Record<ContractType, string> = {
  clt: 'Como trabalhador CLT, voce tem diversos direitos garantidos por lei. Vamos verificar se algum deles foi desrespeitado.',
  pj: 'Mesmo contratado como PJ, se havia subordinacao, horario fixo e pessoalidade, pode existir vinculo empregaticio - e todos os direitos de CLT podem ser cobrados retroativamente.',
  informal: 'Trabalho sem registro e ilegal. Voce tem direito a reconhecimento de vinculo e todos os direitos trabalhistas retroativos, incluindo FGTS, ferias e 13o.',
};

export function calculateScore(violations: Violations): number {
  let score = 0;
  for (const [key, value] of Object.entries(violations)) {
    if (value) {
      score += VIOLATION_SCORES[key as keyof Violations] || 0;
    }
  }
  return Math.min(score, 100);
}

export function getClassification(score: number): Classification {
  if (score <= 30) return 'baixa';
  if (score <= 60) return 'media';
  return 'alta';
}

export function calculateEstimate(
  salary: number,
  yearsWorked: number,
  score: number
): { min: number; max: number } {
  const factor = 0.3 + (score / 100) * 1.2;
  const base = salary * yearsWorked * 12;
  return {
    min: Math.round(base * factor * 0.8),
    max: Math.round(base * factor * 1.2),
  };
}

export function getIdentifiedRights(violations: Violations): string[] {
  const rights: string[] = [];
  for (const [key, value] of Object.entries(violations)) {
    if (value) {
      rights.push(VIOLATION_LABELS[key as keyof Violations]);
    }
  }
  return rights;
}

export function getContractInsight(contractType: ContractType): string {
  return CONTRACT_INSIGHTS[contractType];
}

export function computeResult(data: SimulatorFormData): SimulatorResult {
  const score = calculateScore(data.violations);
  const classification = getClassification(score);
  const { min, max } = calculateEstimate(data.salary, data.yearsWorked, score);
  const identifiedRights = getIdentifiedRights(data.violations);
  const contractInsight = getContractInsight(data.contractType);

  return {
    score,
    classification,
    estimateMin: min,
    estimateMax: max,
    identifiedRights,
    contractInsight,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
