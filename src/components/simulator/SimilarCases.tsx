import { Scale, TrendingUp, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { formatCurrency } from '../../utils/laborCalculator';

export interface CaseData {
  id: string;
  tribunal: string;
  numero_processo: string;
  titulo: string;
  resumo: string;
  resultado: string;
  valor_condenacao: number;
  tags: string[];
  ano: number;
  relevancia: number;
}

interface SimilarCasesProps {
  cases: CaseData[];
  loading: boolean;
}

function ResultBadge({ resultado }: { resultado: string }) {
  const isProcedente = resultado.toLowerCase().includes('procedente');
  const isParcial = resultado.toLowerCase().includes('parcialmente');

  if (isParcial) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold">
        <CheckCircle className="w-3 h-3" />
        Parcialmente procedente
      </span>
    );
  }

  if (isProcedente) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold">
        <CheckCircle className="w-3 h-3" />
        Procedente
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 text-xs font-semibold">
      <XCircle className="w-3 h-3" />
      Improcedente
    </span>
  );
}

function RelevanceMeter({ value }: { value: number }) {
  const color =
    value >= 75 ? 'bg-emerald-500' : value >= 50 ? 'bg-amber-500' : 'bg-blue-500';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
        {value}% similar
      </span>
    </div>
  );
}

export default function SimilarCases({ cases, loading }: SimilarCasesProps) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-slate-700 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Scale className="w-6 h-6 text-blue-400" />
          <h4 className="text-lg font-bold text-white">Casos semelhantes</h4>
        </div>
        <div className="flex items-center justify-center py-8 gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Buscando jurisprudencia...</span>
        </div>
      </div>
    );
  }

  if (cases.length === 0) {
    return null;
  }

  const totalFavoravel = cases.filter((c) =>
    c.resultado.toLowerCase().includes('procedente')
  ).length;
  const percentFavoravel = Math.round((totalFavoravel / cases.length) * 100);

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-blue-500/30 rounded-2xl p-6 animate-fadeIn">
      <div className="flex items-center gap-3 mb-2">
        <Scale className="w-6 h-6 text-blue-400" />
        <h4 className="text-lg font-bold text-white">Casos semelhantes na Justica</h4>
      </div>
      <p className="text-sm text-gray-400 mb-5">
        Encontramos {cases.length} casos com violacoes parecidas com as suas
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">Decisoes favoraveis</span>
          </div>
          <p className="text-2xl font-black text-emerald-400">{percentFavoravel}%</p>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Maior condenacao</span>
          </div>
          <p className="text-2xl font-black text-blue-400">
            {formatCurrency(Math.max(...cases.map((c) => c.valor_condenacao)))}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {cases.map((caso) => (
          <div
            key={caso.id}
            className="bg-slate-900/40 border border-slate-700 hover:border-blue-500/40 rounded-xl p-4 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                    {caso.tribunal}
                  </span>
                  <span className="text-xs text-gray-500">{caso.ano}</span>
                  <ResultBadge resultado={caso.resultado} />
                </div>
                <h5 className="text-sm font-semibold text-white leading-snug">
                  {caso.titulo}
                </h5>
              </div>
              {caso.valor_condenacao > 0 && (
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-500">Valor</p>
                  <p className="text-sm font-bold text-emerald-400">
                    {formatCurrency(caso.valor_condenacao)}
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-3">
              {caso.resumo}
            </p>

            <div className="flex items-center justify-between gap-3">
              <RelevanceMeter value={caso.relevancia} />
              <span className="text-[10px] text-gray-600 font-mono flex-shrink-0">
                {caso.numero_processo}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-gray-600 mt-4 text-center">
        Fonte: jurisprudencia publica dos tribunais trabalhistas brasileiros (TST/TRT)
      </p>
    </div>
  );
}
