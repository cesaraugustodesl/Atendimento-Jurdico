import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  tags?: string[];
  summary?: string;
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
}

interface CaseRecord {
  id: string;
  tribunal: string;
  numero_processo: string;
  titulo: string;
  resumo: string;
  resultado: string;
  valor_condenacao: number;
  tags: string[];
  ano: number;
  url_fonte: string;
  duracao_processo_meses: number | null;
  fase_processual: string;
  relevancia: number;
}

interface DurationStats {
  averageMonths: number | null;
  minMonths: number | null;
  maxMonths: number | null;
  sampleSize: number;
}

interface ComparisonInsight {
  overview: string;
  matching_points: string[];
  differences: string[];
  duration_takeaways: string[];
  caution_points: string[];
}

function parseComparisonJson(content: string) {
  const trimmed = content.trim();
  const withoutFence = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    return JSON.parse(withoutFence) as Partial<ComparisonInsight>;
  } catch {
    const match = withoutFence.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("JSON de comparacao invalido.");
    }

    return JSON.parse(match[0]) as Partial<ComparisonInsight>;
  }
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
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function sanitizeSummary(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

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

function toCaseRecord(record: RawCaseRecord): Omit<CaseRecord, "relevancia"> {
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
  };
}

function calculateRelevance(
  record: Omit<CaseRecord, "relevancia">,
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

  return Math.max(tagScore + textScore, tagMatches > 0 ? 24 : 0);
}

function calculateDurationStats(cases: CaseRecord[]): DurationStats {
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

function sanitizeStringList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function formatMonths(months: number | null) {
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

function buildFallbackComparison(
  cases: CaseRecord[],
  durationStats: DurationStats
): ComparisonInsight {
  if (cases.length === 0) {
    return {
      overview:
        "Nao encontramos casos publicos comparaveis na base atual com os sinais informados.",
      matching_points: [
        "Vale revisar o resumo e trazer fatos mais objetivos, documentos e palavras-chave do problema.",
      ],
      differences: [
        "A base atual pode nao ter cobertura suficiente para esse tema especifico.",
      ],
      duration_takeaways: [
        "Sem casos comparaveis suficientes, nao ha base para resumir duracao do processo.",
      ],
      caution_points: [
        "Use essa etapa apenas como apoio inicial. A estrategia continua dependendo de analise humana.",
      ],
    };
  }

  const highest = cases[0];
  const durationText =
    durationStats.sampleSize > 0
      ? `Nos casos com duracao registrada, a media observada foi de ${formatMonths(
          durationStats.averageMonths
        )}, variando de ${formatMonths(durationStats.minMonths)} a ${formatMonths(
          durationStats.maxMonths
        )}.`
      : "A base atual nao traz duracao registrada suficiente para resumir tempo de processo com confianca.";

  return {
    overview: `Encontramos ${cases.length} caso${
      cases.length === 1 ? "" : "s"
    } com proximidade relevante. O caso mais parecido na base atual e "${highest.titulo}".`,
    matching_points: [
      `Os casos listados compartilham tags e sinais proximos ao problema informado.`,
      `O melhor match atual aparece com relevancia de ${highest.relevancia}% na base publica.`,
    ],
    differences: [
      "Resultado e valor dependem de prova, narrativa, periodo exato e enquadramento juridico.",
      "Mesmo quando a violacao parece parecida, detalhes de contrato e documentos podem mudar bastante o desfecho.",
    ],
    duration_takeaways: [durationText],
    caution_points: [
      "Use os casos semelhantes para calibrar expectativa, nao como promessa de resultado.",
      "Se houver prazo correndo ou necessidade de estrategia, leve o caso para atendimento humano.",
    ],
  };
}

async function buildAiComparison(
  summary: string,
  cases: CaseRecord[],
  durationStats: DurationStats,
  context: Record<string, unknown> | undefined,
  openaiApiKey: string
) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4",
      temperature: 0.3,
      max_tokens: 900,
      messages: [
        {
          role: "system",
          content:
            "Voce compara um resumo de caso do usuario com casos publicos semelhantes. Responda somente JSON valido com as chaves overview, matching_points, differences, duration_takeaways e caution_points. Cada lista deve ter de 2 a 4 itens curtos, em portugues claro, sem juridiques e sem prometer resultado.",
        },
        {
          role: "user",
          content: JSON.stringify({
            case_summary: summary,
            request_context: context ?? {},
            duration_stats: durationStats,
            similar_cases: cases.map((item) => ({
              titulo: item.titulo,
              tribunal: item.tribunal,
              resultado: item.resultado,
              resumo: item.resumo,
              tags: item.tags,
              valor_condenacao: item.valor_condenacao,
              duracao_processo_meses: item.duracao_processo_meses,
              relevancia: item.relevancia,
            })),
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Falha ao gerar comparacao com IA.");
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Comparacao de IA vazia.");
  }

  const parsed = parseComparisonJson(content);
  return {
    overview: parsed.overview?.trim() || "",
    matching_points: sanitizeStringList(parsed.matching_points),
    differences: sanitizeStringList(parsed.differences),
    duration_takeaways: sanitizeStringList(parsed.duration_takeaways),
    caution_points: sanitizeStringList(parsed.caution_points),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body: RequestBody = await req.json();
    const tags = sanitizeTags(body.tags);
    const summary = sanitizeSummary(body.summary);
    const summaryTokens = tokenizeSummary(summary);
    const limit = Math.min(Math.max(body.limit ?? 5, 1), 6);

    if (tags.length === 0 && !summary) {
      return new Response(
        JSON.stringify({ error: "tags ou summary sao obrigatorios" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let query = supabase.from("jurisprudencia").select("*");

    if (tags.length > 0) {
      query = query.overlaps("tags", tags);
    }

    const candidateLimit = summary ? Math.max(limit * 3, 12) : limit;
    const { data, error } = await query
      .order("ano", { ascending: false })
      .limit(candidateLimit);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rankedCases = ((data ?? []) as RawCaseRecord[])
      .map((item) => toCaseRecord(item))
      .map((item) => ({
        ...item,
        relevancia: calculateRelevance(item, tags, summaryTokens),
      }))
      .filter((item) => item.relevancia > 0)
      .sort((a, b) => {
        if (b.relevancia !== a.relevancia) {
          return b.relevancia - a.relevancia;
        }

        return b.valor_condenacao - a.valor_condenacao;
      })
      .slice(0, limit);

    const durationStats = calculateDurationStats(rankedCases);
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    let comparison = buildFallbackComparison(rankedCases, durationStats);

    if (summary && openaiApiKey && rankedCases.length > 0) {
      try {
        comparison = await buildAiComparison(
          summary,
          rankedCases,
          durationStats,
          body.context,
          openaiApiKey
        );
      } catch (aiError) {
        console.error("Falha ao gerar comparacao com IA:", aiError);
      }
    }

    return new Response(
      JSON.stringify({
        cases: rankedCases,
        durationStats,
        comparison,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erro na busca de jurisprudencia:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
