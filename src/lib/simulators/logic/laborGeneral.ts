import { pagePaths } from "../../../config/site";
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
  normalizeList,
  normalizeNumber,
  potentialLevelFromScore,
} from "./common";

const CONTRACT_TYPES = ["clt", "pj", "informal"] as const;
type ContractType = (typeof CONTRACT_TYPES)[number];

interface LaborGeneralInput {
  contractType: ContractType;
  salary: number;
  yearsWorked: number;
  violations: string[];
}

interface LaborGeneralRouteSuggestion {
  slug: "rescisao-trabalhista" | "horas-extras" | "fgts-nao-depositado" | "outro";
  name: string;
  href?: string;
  reason: string;
}

interface LaborGeneralCalculation {
  routeScores: Record<string, number>;
  recommendation: LaborGeneralRouteSuggestion;
  totalSignals: number;
}

function normalizeLaborGeneralInput(values: SimulatorFormValues): LaborGeneralInput {
  return {
    contractType: normalizeChoice(values, "contractType", CONTRACT_TYPES, "clt") as ContractType,
    salary: normalizeNumber(values, "salary", 0, { min: 0 }),
    yearsWorked: normalizeNumber(values, "yearsWorked", 0, { min: 0 }),
    violations: normalizeList(values, "violations"),
  };
}

function calculateLaborGeneralRouting(
  input: LaborGeneralInput
): LaborGeneralCalculation {
  const routeScores = {
    termination: 0,
    overtime: 0,
    fgts: 0,
    other: 0,
  };

  if (input.violations.includes("demissaoProblematica")) {
    routeScores.termination += 45;
  }

  if (input.violations.includes("horasExtrasNaoPagas")) {
    routeScores.overtime += 30;
  }
  if (input.violations.includes("intervaloIrregular")) {
    routeScores.overtime += 18;
  }
  if (input.violations.includes("domingosFeriados")) {
    routeScores.overtime += 16;
  }
  if (input.violations.includes("trabalhoNoturno")) {
    routeScores.overtime += 14;
  }

  if (input.violations.includes("fgtsNaoPago")) {
    routeScores.fgts += 40;
    routeScores.termination += 10;
  }

  if (input.violations.includes("insalubridade")) {
    routeScores.other += 24;
  }

  if (input.contractType === "pj" || input.contractType === "informal") {
    routeScores.other += 18;
  }

  if (input.yearsWorked >= 3) {
    routeScores.termination += 6;
    routeScores.overtime += 6;
    routeScores.fgts += 6;
    routeScores.other += 4;
  }

  const sorted = Object.entries(routeScores).sort((a, b) => b[1] - a[1]);
  const [bestKey, bestScore] = sorted[0];
  const secondScore = sorted[1]?.[1] ?? 0;
  const isAmbiguous = bestScore > 0 && bestScore - secondScore < 8;

  if (bestKey === "termination" && !isAmbiguous) {
    return {
      routeScores,
      recommendation: {
        slug: "rescisao-trabalhista",
        name: "Simulador de rescisao trabalhista",
        href: "/simuladores/rescisao-trabalhista",
        reason: "Os sinais de demissao e verbas rescisorias apareceram como eixo principal do caso.",
      },
      totalSignals: input.violations.length,
    };
  }

  if (bestKey === "overtime" && !isAmbiguous) {
    return {
      routeScores,
      recommendation: {
        slug: "horas-extras",
        name: "Simulador de horas extras",
        href: "/simuladores/horas-extras",
        reason: "A jornada, o intervalo e os adicionais de horario parecem ser o foco mais forte.",
      },
      totalSignals: input.violations.length,
    };
  }

  if (bestKey === "fgts" && !isAmbiguous) {
    return {
      routeScores,
      recommendation: {
        slug: "fgts-nao-depositado",
        name: "Simulador de FGTS nao depositado",
        href: "/simuladores/fgts-nao-depositado",
        reason: "A principal densidade de sinais esta na falta de depositos e no extrato do FGTS.",
      },
      totalSignals: input.violations.length,
    };
  }

  return {
    routeScores,
    recommendation: {
      slug: "outro",
      name: "Triagem trabalhista geral",
      href: pagePaths.contact,
      reason:
        "Os sinais aparecem espalhados entre mais de uma tese ou nao concentram um simulador especifico com seguranca.",
    },
    totalSignals: input.violations.length,
  };
}

export function buildLaborGeneralOutcome(values: SimulatorFormValues): SimulatorOutcome {
  const input = normalizeLaborGeneralInput(values);
  const routing = calculateLaborGeneralRouting(input);

  let score = 18;
  score += Math.min(input.violations.length * 9, 36);
  score += input.salary >= 5000 ? 10 : input.salary >= 2500 ? 6 : 2;
  score += input.yearsWorked >= 3 ? 8 : input.yearsWorked >= 1 ? 4 : 0;
  score += input.contractType !== "clt" ? 6 : 0;

  const normalizedScore = clampScore(score);
  const leadPriority = leadPriorityFromScore(normalizedScore);
  const confidenceScore = buildConfidenceScore({
    answered: countAnswered([
      input.contractType,
      input.salary,
      input.yearsWorked,
      input.violations,
    ]),
    total: 4,
    documentarySignals: Math.min(input.violations.length, 3),
    documentaryMax: 3,
    specificity: input.violations.length >= 2 ? 0.78 : 0.62,
    approximationPenalty: 6,
  });

  const findings = [
    `Contrato informado: ${input.contractType.toUpperCase()}.`,
    `Tempo de vinculo informado: ${input.yearsWorked} ano(s).`,
    `Salario base informado: ${formatCurrency(input.salary)}.`,
  ];

  if (input.violations.length > 0) {
    findings.push(`Sinais principais marcados: ${input.violations.join(", ")}.`);
  } else {
    findings.push("Sem sinais trabalhistas marcados, a triagem fica mais generica e depende de detalhamento adicional.");
  }

  findings.push(`Melhor encaminhamento atual: ${routing.recommendation.name}.`);

  return createOutcome({
    simulatorSlug: "trabalhista-geral",
    score: normalizedScore,
    confidenceScore,
    leadPriority,
    potentialLevel: potentialLevelFromScore(
      clamp(normalizedScore + routing.totalSignals * 4, 0, 100)
    ),
    summary: `A triagem trabalhista geral funcionou como roteador inicial. O melhor proximo passo encontrado foi ${routing.recommendation.name.toLowerCase()}, porque ${routing.recommendation.reason.toLowerCase()}`,
    findings,
    observations: [
      "Este fluxo geral nao tenta fazer conta detalhada por tese. Ele organiza os sinais e sugere o simulador mais especifico.",
    ],
    recommendations: [
      routing.recommendation.href
        ? `Abrir ${routing.recommendation.name} para refinar o caso com perguntas mais objetivas.`
        : "Levar o caso direto para atendimento humano se a situacao estiver pouco clara.",
      "Separar documentos do contrato, extrato do FGTS, holerites e prova de jornada ou da demissao, conforme o tema dominante.",
      "Se o caso misturar demissao, FGTS e jornada ao mesmo tempo, vale combinar simulador especifico com analise humana.",
    ],
    disclaimers: [
      "O simulador geral nao substitui os calculos especificos de rescisao, horas extras ou FGTS.",
      "A recomendacao de rota usa os sinais marcados no formulario e pode mudar com novos documentos.",
    ],
    caution:
      "Aqui o foco e encaminhamento, nao valor exato. Use o resultado para decidir qual simulador especifico ou atendimento humano vem em seguida.",
    estimate: {
      label: "Melhor proximo simulador",
      valueText: routing.recommendation.name,
      helper: routing.recommendation.reason,
    },
    comparisonTags: input.violations,
    whatsappSummary: `Triagem trabalhista geral com prioridade ${leadPriority} e recomendacao principal para ${routing.recommendation.name.toLowerCase()}.`,
    scoreDetails: {
      signalDensity: Math.min(input.violations.length * 9, 36),
      contractSignal: input.contractType !== "clt" ? 6 : 0,
      financialSignal: input.salary >= 5000 ? 10 : input.salary >= 2500 ? 6 : 2,
      durationSignal: input.yearsWorked >= 3 ? 8 : input.yearsWorked >= 1 ? 4 : 0,
    },
    meta: {
      recommendedSimulator: routing.recommendation.name,
      recommendedHref: routing.recommendation.href ?? null,
      terminationRouteScore: routing.routeScores.termination,
      overtimeRouteScore: routing.routeScores.overtime,
      fgtsRouteScore: routing.routeScores.fgts,
      otherRouteScore: routing.routeScores.other,
    },
  });
}
