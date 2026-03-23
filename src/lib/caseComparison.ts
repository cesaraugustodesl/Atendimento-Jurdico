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

export async function fetchCaseComparison(
  request: CaseComparisonRequest
): Promise<CaseComparisonResponse> {
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
    throw new Error("Nao foi possivel buscar casos comparaveis.");
  }

  return response.json();
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
