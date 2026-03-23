import {
  AlertTriangle,
  CheckCircle,
  Clock3,
  Loader2,
  Scale,
  TrendingUp,
  XCircle,
} from "lucide-react";
import {
  formatDurationMonths,
  type CaseComparisonInsight,
  type CaseComparisonItem,
  type CaseDurationStats,
} from "../../lib/caseComparison";
import { formatCurrency } from "../../utils/laborCalculator";

export type CaseData = CaseComparisonItem;

interface SimilarCasesProps {
  cases: CaseData[];
  loading: boolean;
  comparison?: CaseComparisonInsight | null;
  durationStats?: CaseDurationStats | null;
  title?: string;
  subtitle?: string;
}

function ResultBadge({ resultado }: { resultado: string }) {
  const normalized = resultado.toLowerCase();
  const isProcedente = normalized.includes("procedente");
  const isParcial = normalized.includes("parcialmente");

  if (isParcial) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-400">
        <CheckCircle className="h-3 w-3" />
        Parcialmente procedente
      </span>
    );
  }

  if (isProcedente) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400">
        <CheckCircle className="h-3 w-3" />
        Procedente
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-400">
      <XCircle className="h-3 w-3" />
      Improcedente
    </span>
  );
}

function RelevanceMeter({ value }: { value: number }) {
  const color =
    value >= 75 ? "bg-emerald-500" : value >= 50 ? "bg-amber-500" : "bg-blue-500";

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-700">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="whitespace-nowrap text-xs font-medium text-slate-400">
        {value}% similar
      </span>
    </div>
  );
}

function InsightList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <p key={item} className="text-sm leading-6 text-slate-300">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function SimilarCases({
  cases,
  loading,
  comparison,
  durationStats,
  title = "Casos semelhantes na Justica",
  subtitle,
}: SimilarCasesProps) {
  if (loading) {
    return (
      <div className="surface-panel p-6">
        <div className="mb-4 flex items-center gap-3">
          <Scale className="h-6 w-6 text-blue-400" />
          <h4 className="text-lg font-bold text-white">{title}</h4>
        </div>
        <div className="flex items-center justify-center gap-3 py-8 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Comparando seu resumo com casos publicos...</span>
        </div>
      </div>
    );
  }

  if (cases.length === 0 && !comparison) {
    return null;
  }

  const totalFavoravel = cases.filter((item) =>
    item.resultado.toLowerCase().includes("procedente")
  ).length;
  const percentFavoravel =
    cases.length > 0 ? Math.round((totalFavoravel / cases.length) * 100) : 0;
  const durationLabel =
    durationStats && durationStats.sampleSize > 0
      ? formatDurationMonths(durationStats.averageMonths)
      : "sem base";

  return (
    <div className="space-y-6 animate-fadeIn">
      {comparison && (
        <div className="surface-panel p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-sky-300" />
            <div>
              <h4 className="text-lg font-bold text-white">Comparacao com seu caso</h4>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {comparison.overview}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <InsightList title="Pontos em comum" items={comparison.matching_points} />
            <InsightList title="Diferencas que podem pesar" items={comparison.differences} />
            <InsightList title="Tempo observado" items={comparison.duration_takeaways} />
            <InsightList title="Cuidados importantes" items={comparison.caution_points} />
          </div>
        </div>
      )}

      {cases.length > 0 && (
        <div className="surface-card p-6">
          <div className="mb-2 flex items-center gap-3">
            <Scale className="h-6 w-6 text-blue-400" />
            <h4 className="text-lg font-bold text-white">{title}</h4>
          </div>
          <p className="mb-5 text-sm text-slate-400">
            {subtitle ??
              `Encontramos ${cases.length} casos com proximidade relevante ao resumo informado.`}
          </p>

          <div className="mb-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
              <div className="mb-1 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-slate-400">Decisoes favoraveis</span>
              </div>
              <p className="text-2xl font-black text-emerald-400">{percentFavoravel}%</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
              <div className="mb-1 flex items-center gap-2">
                <Scale className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-400">Maior condenacao</span>
              </div>
              <p className="text-2xl font-black text-blue-400">
                {formatCurrency(Math.max(...cases.map((item) => item.valor_condenacao), 0))}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
              <div className="mb-1 flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-amber-300" />
                <span className="text-xs text-slate-400">Duracao media observada</span>
              </div>
              <p className="text-2xl font-black text-amber-300">{durationLabel}</p>
            </div>
          </div>

          <div className="space-y-4">
            {cases.map((caso) => (
              <div
                key={caso.id}
                className="rounded-xl border border-white/10 bg-slate-950/50 p-4 transition-all hover:border-blue-500/40"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-400">
                        {caso.tribunal}
                      </span>
                      <span className="text-xs text-slate-500">{caso.ano}</span>
                      <ResultBadge resultado={caso.resultado} />
                      {caso.duracao_processo_meses ? (
                        <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-300">
                          Durou {formatDurationMonths(caso.duracao_processo_meses)}
                        </span>
                      ) : null}
                    </div>
                    <h5 className="text-sm font-semibold leading-snug text-white">
                      {caso.titulo}
                    </h5>
                  </div>
                  {caso.valor_condenacao > 0 && (
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-slate-500">Valor</p>
                      <p className="text-sm font-bold text-emerald-400">
                        {formatCurrency(caso.valor_condenacao)}
                      </p>
                    </div>
                  )}
                </div>

                <p className="mb-3 text-xs leading-relaxed text-slate-400">
                  {caso.resumo}
                </p>

                <div className="flex items-center justify-between gap-3">
                  <RelevanceMeter value={caso.relevancia} />
                  <span className="flex-shrink-0 font-mono text-[10px] text-slate-600">
                    {caso.numero_processo}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-center text-[11px] text-slate-500">
            Fonte: base publica de jurisprudencia usada pelo projeto. Resultado,
            valor e tempo seguem dependendo de prova e estrategia.
          </p>
        </div>
      )}
    </div>
  );
}
