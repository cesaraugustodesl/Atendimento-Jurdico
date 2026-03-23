import { supabase } from "./supabase";

export interface CaseComparisonItem {
  id: string;
  tribunal: string;
  numero_processo: string;
  titulo: string;
  resumo: string;
  resultado: string;
  valor_condenacao: number;
  tags: string[];
  ano: number;
  url_fonte?: string;
  duracao_processo_meses?: number | null;
  fase_processual?: string;
  relevancia: number;
}

export interface CaseDurationStats {
  averageMonths: number | null;
  minMonths: number | null;
  maxMonths: number | null;
  sampleSize: number;
}

export interface CaseComparisonInsight {
  overview: string;
  matching_points: string[];
  differences: string[];
  duration_takeaways: string[];
  caution_points: string[];
}

export interface CaseComparisonResponse {
  cases: CaseComparisonItem[];
  durationStats: CaseDurationStats;
  comparison: CaseComparisonInsight;
}

export interface CaseComparisonRequest {
  tags?: string[];
  summary: string;
  limit?: number;
  context?: Record<string, unknown>;
}

interface RawCaseRecord {
  id?: string;
  tribunal?: string;
  numero_processo?: string;
  titulo?: string;
  resumo?: string;
  resultado?: string;
  valor_condenacao?: number;
  tags?: string[];
  ano?: number;
  url_fonte?: string;
  duracao_processo_meses?: number | null;
  fase_processual?: string | null;
  relevancia?: number;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function sanitizeTags(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function sanitizeSummary(value: string) {
  return value.trim().slice(0, 2200);
}

function tokenizeSummary(summary: string) {
  return Array.from(
    new Set(
      normalizeText(summary)
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length >= 4)
        .slice(0, 24)
    )
  );
}

function toSafeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function toCaseRecord(record: RawCaseRecord): CaseComparisonItem {
  return {
    id: record.id ?? crypto.randomUUID(),
    tribunal: record.tribunal ?? "",
    numero_processo: record.numero_processo ?? "",
    titulo: record.titulo ?? "",
    resumo: record.resumo ?? "",
    resultado: record.resultado ?? "",
    valor_condenacao: toSafeNumber(record.valor_condenacao),
    tags: Array.isArray(record.tags) ? record.tags.filter(Boolean) : [],
    ano: typeof record.ano === "number" ? record.ano : 0,
    url_fonte: record.url_fonte ?? "",
    duracao_processo_meses:
      typeof record.duracao_processo_meses === "number"
        ? record.duracao_processo_meses
        : null,
    fase_processual: record.fase_processual ?? "",
    relevancia: typeof record.relevancia === "number" ? record.relevancia : 0,
  };
}

function calculateRelevance(
  record: CaseComparisonItem,
  tags: string[],
  summaryTokens: string[]
) {
  const normalizedTitle = normalizeText(record.titulo);
  const normalizedSummary = normalizeText(record.resumo);
  const normalizedTagSet = new Set(record.tags.map((tag) => normalizeText(tag)));

  const tagMatches = tags.filter((tag) =>
    normalizedTagSet.has(normalizeText(tag))
  ).length;
  const summaryMatches = summaryTokens.filter(
    (token) =>
      normalizedTitle.includes(token) ||
      normalizedSummary.includes(token) ||
      Array.from(normalizedTagSet).some((tag) => tag.includes(token))
  ).length;

  const tagScore =
    tags.length > 0 ? Math.round((tagMatches / tags.length) * 62) : 0;
  const textScore =
    summaryTokens.length > 0
      ? Math.round((summaryMatches / summaryTokens.length) * 38)
      : 0;

  if (tags.length === 0 && summaryTokens.length > 0) {
    const minimumTextMatches = Math.min(2, summaryTokens.length);
    if (summaryMatches < minimumTextMatches) {
      return 0;
    }
  }

  return Math.max(tagScore + textScore, tagMatches > 0 ? 24 : 0);
}

function calculateDurationStats(cases: CaseComparisonItem[]): CaseDurationStats {
  const durations = cases
    .map((item) => item.duracao_processo_meses)
    .filter((value): value is number => typeof value === "number" && value > 0);

  if (durations.length === 0) {
    return {
      averageMonths: null,
      minMonths: null,
      maxMonths: null,
      sampleSize: 0,
    };
  }

  const total = durations.reduce((sum, value) => sum + value, 0);
  return {
    averageMonths: Math.round(total / durations.length),
    minMonths: Math.min(...durations),
    maxMonths: Math.max(...durations),
    sampleSize: durations.length,
  };
}

function buildComparison(
  cases: CaseComparisonItem[],
  durationStats: CaseDurationStats,
  summary: string
): CaseComparisonInsight {
  const summaryTokens = tokenizeSummary(summary);

  if (cases.length === 0) {
    return {
      overview:
        "Nao encontrei casos publicos com proximidade suficiente na base atual.",
      matching_points: [
        "Vale reescrever o resumo com fatos objetivos, periodo, tipo de problema e documentos que voce tem.",
      ],
      differences: [
        "A base publica do projeto ainda pode nao cobrir bem esse recorte especifico.",
      ],
      duration_takeaways: [
        "Sem casos comparaveis suficientes, nao ha base util para resumir o tempo do processo.",
      ],
      caution_points: [
        "Use esta leitura como triagem inicial. Resultado real continua dependendo de prova e estrategia.",
      ],
    };
  }

  const bestMatch = cases[0];
  const matchingTags = bestMatch.tags.slice(0, 3);
  const favorableCount = cases.filter((item) =>
    item.resultado.toLowerCase().includes("procedente")
  ).length;
  const favorableRate = Math.round((favorableCount / cases.length) * 100);
  const maxAward = Math.max(...cases.map((item) => item.valor_condenacao), 0);
  const durationText =
    durationStats.sampleSize > 0
      ? `Nos casos com duracao registrada, a media observada foi de ${formatDurationMonths(
          durationStats.averageMonths
        )}, indo de ${formatDurationMonths(durationStats.minMonths)} a ${formatDurationMonths(
          durationStats.maxMonths
        )}.`
      : "Hoje a base publica do projeto ainda nao traz a duracao do processo cadastrada por caso. Por isso, eu nao consigo estimar esse tempo com confianca aqui.";

  return {
    overview: `Encontrei ${cases.length} deciso${cases.length === 1 ? "a" : "es"} trabalhista${
      cases.length === 1 ? "" : "s"
    } com proximidade relevante. O melhor encaixe agora e "${bestMatch.titulo}", julgado por ${bestMatch.tribunal}${
      bestMatch.ano ? ` em ${bestMatch.ano}` : ""
    }.`,
    matching_points: [
      matchingTags.length > 0
        ? `Os sinais que mais aproximam seu relato da base sao ${matchingTags.join(", ")}.`
        : "O melhor match ficou mais proximo pela narrativa do resumo do que por tags fixas.",
      summaryTokens.length > 0
        ? `Na amostra encontrada, ${favorableRate}% das decisoes foram favoraveis e o maior valor cadastrado chegou a ${formatCurrency(maxAward)}.`
        : `Como voce nao detalhou o resumo, a comparacao ficou baseada principalmente nos sinais marcados no fluxo.`,
    ],
    differences: [
      `O melhor caso da base terminou como "${bestMatch.resultado}". Isso ajuda a calibrar expectativa, mas nao fecha o desfecho do seu caso.`,
      "Detalhes como prova disponivel, periodo exato, funcao exercida e forma de desligamento podem mudar bastante o resultado.",
    ],
    duration_takeaways: [durationText],
    caution_points: [
      "Esses casos servem para orientar a leitura inicial, nao para prometer ganho ou prazo final.",
      "Se houver urgencia, prazo correndo ou risco de perder prova, leve o caso para atendimento humano.",
    ],
  };
}

async function fetchFromFunction(
  request: CaseComparisonRequest
): Promise<CaseComparisonResponse | null> {
  const tags = sanitizeTags(request.tags);
  const summary = sanitizeSummary(request.summary);
  const summaryTokens = tokenizeSummary(summary);
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/buscar-jurisprudencia`;
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tags: request.tags ?? [],
      summary: request.summary,
      limit: request.limit ?? 5,
      context: request.context ?? {},
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as Partial<CaseComparisonResponse> & {
    cases?: RawCaseRecord[];
  };
  const cases = Array.isArray(payload.cases)
    ? payload.cases
        .map((item) => toCaseRecord(item))
        .map((item) => ({
          ...item,
          relevancia: Math.max(
            item.relevancia,
            calculateRelevance(item, tags, summaryTokens)
          ),
        }))
        .filter((item) => item.relevancia > 0)
        .sort((a, b) => {
          if (b.relevancia !== a.relevancia) {
            return b.relevancia - a.relevancia;
          }

          return b.valor_condenacao - a.valor_condenacao;
        })
        .slice(0, request.limit ?? 5)
    : [];
  const durationStats =
    payload.durationStats ?? calculateDurationStats(cases);
  const comparison =
    payload.comparison ?? buildComparison(cases, durationStats, summary);

  return {
    cases,
    durationStats,
    comparison,
  };
}

async function fetchFromPublicTable(
  request: CaseComparisonRequest
): Promise<CaseComparisonResponse> {
  const tags = sanitizeTags(request.tags);
  const summary = sanitizeSummary(request.summary);
  const summaryTokens = tokenizeSummary(summary);
  const limit = Math.min(Math.max(request.limit ?? 5, 1), 6);

  let query = supabase.from("jurisprudencia").select("*");

  if (tags.length > 0) {
    query = query.overlaps("tags", tags);
  }

  const candidateLimit =
    tags.length > 0 ? Math.max(limit * 3, 12) : Math.max(limit * 8, 40);
  const { data, error } = await query
    .order("ano", { ascending: false })
    .limit(candidateLimit);

  if (error) {
    throw new Error("Nao foi possivel carregar a base publica de casos.");
  }

  const cases = ((data ?? []) as RawCaseRecord[])
    .map((item) => toCaseRecord(item))
    .map((item) => ({
      ...item,
      relevancia:
        typeof item.relevancia === "number" && item.relevancia > 0
          ? item.relevancia
          : calculateRelevance(item, tags, summaryTokens),
    }))
    .filter((item) => item.relevancia > 0)
    .sort((a, b) => {
      if (b.relevancia !== a.relevancia) {
        return b.relevancia - a.relevancia;
      }

      return b.valor_condenacao - a.valor_condenacao;
    })
    .slice(0, limit);

  const durationStats = calculateDurationStats(cases);
  const comparison = buildComparison(cases, durationStats, summary);

  return {
    cases,
    durationStats,
    comparison,
  };
}

export async function fetchCaseComparison(
  request: CaseComparisonRequest
): Promise<CaseComparisonResponse> {
  const normalizedRequest = {
    ...request,
    tags: sanitizeTags(request.tags),
    summary: sanitizeSummary(request.summary),
    limit: request.limit ?? 5,
  };

  const functionResult = await fetchFromFunction(normalizedRequest).catch(
    () => null
  );

  if (
    functionResult &&
    (functionResult.cases.length > 0 ||
      functionResult.comparison.overview.trim().length > 0)
  ) {
    return functionResult;
  }

  return fetchFromPublicTable(normalizedRequest);
}

export function formatDurationMonths(months: number | null | undefined) {
  if (!months || months <= 0) {
    return "nao informado";
  }

  if (months < 12) {
    return `${months} mes${months === 1 ? "" : "es"}`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return `${years} ano${years === 1 ? "" : "s"}`;
  }

  return `${years} ano${years === 1 ? "" : "s"} e ${remainingMonths} mes${
    remainingMonths === 1 ? "" : "es"
  }`;
}
