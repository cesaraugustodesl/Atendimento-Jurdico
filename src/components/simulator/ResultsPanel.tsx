import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  MessageSquare,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import ScoreGauge from "./ScoreGauge";
import SimilarCases from "./SimilarCases";
import RouteLink from "../RouteLink";
import type { ContractType, SimulatorResult } from "../../utils/laborCalculator";
import { formatCurrency } from "../../utils/laborCalculator";
import {
  buildWhatsAppLink,
  pagePaths,
} from "../../config/site";
import type {
  CaseComparisonInsight,
  CaseComparisonItem,
  CaseDurationStats,
} from "../../lib/caseComparison";

interface ResultsPanelProps {
  result: SimulatorResult;
  contractType: ContractType;
  similarCases: CaseComparisonItem[];
  casesLoading: boolean;
  comparison: CaseComparisonInsight | null;
  durationStats: CaseDurationStats | null;
  comparisonError: string;
  onReset: () => void;
  onNavigate: (href: string) => void;
}

const contractLabels: Record<ContractType, string> = {
  clt: "CLT",
  pj: "PJ",
  informal: "Sem registro",
};

export default function ResultsPanel({
  result,
  contractType,
  similarCases,
  casesLoading,
  comparison,
  durationStats,
  comparisonError,
  onReset,
  onNavigate,
}: ResultsPanelProps) {
  const whatsappMessage = [
    "Ola, fiz a simulacao trabalhista.",
    "",
    `Tipo de vinculo: ${contractLabels[contractType]}`,
    `Score: ${result.score}/100 (${result.classification})`,
    `Faixa estimada: ${formatCurrency(result.estimateMin)} a ${formatCurrency(
      result.estimateMax
    )}`,
    "",
    "Gostaria de transformar essa triagem em analise humana.",
  ].join("\n");

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="surface-panel p-7 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="eyebrow">resultado da simulacao</span>
            <h1 className="mt-5 text-3xl md:text-4xl">
              Sua triagem trabalhista ficou pronta.
            </h1>
            <p className="mt-4 text-sm leading-7">
              Este score organiza os sinais que voce informou. Ele ajuda a medir
              forca inicial do caso, nao a substituir calculo tecnico ou analise
              processual.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <ScoreGauge score={result.score} classification={result.classification} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-bold">Faixa estimada</h2>
          </div>
          <p className="mt-4 text-sm leading-7">
            Com base no salario, no tempo informado e nos sinais marcados, a
            leitura inicial aponta esta faixa:
          </p>
          <div className="mt-6 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-black text-emerald-400">
              {formatCurrency(result.estimateMin)}
            </span>
            <span className="text-slate-500">a</span>
            <span className="text-3xl font-black text-emerald-400">
              {formatCurrency(result.estimateMax)}
            </span>
          </div>
          <p className="mt-3 text-xs leading-6 text-slate-500">
            A faixa nao representa promessa de ganho. Serve para orientar a
            conversa com um advogado.
          </p>
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-sky-400" />
            <h2 className="text-xl font-bold">Como ler esse resultado</h2>
          </div>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Probabilidade</p>
              <p className="mt-2 text-sm leading-6">
                O score mede densidade de sinais informados, nao certeza juridica.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Faixa financeira</p>
              <p className="mt-2 text-sm leading-6">
                A estimativa depende de prova, periodo exato e enquadramento da
                tese na analise humana.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Comparacao publica</p>
              <p className="mt-2 text-sm leading-6">
                No bloco abaixo, voce pode contar com suas palavras o que
                aconteceu para eu comparar com casos mais parecidos da base.
              </p>
            </div>
          </div>
        </div>
      </div>

      {result.contractInsight && (
        <div className="surface-panel p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-amber-300" />
            <p className="text-sm leading-7">{result.contractInsight}</p>
          </div>
        </div>
      )}

      {result.identifiedRights.length > 0 && (
        <div className="surface-card p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-bold">Sinais identificados</h2>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {result.identifiedRights.map((right) => (
              <div
                key={right}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300"
              >
                {right}
              </div>
            ))}
          </div>
        </div>
      )}

      {comparisonError ? (
        <div className="surface-panel p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-red-300" />
            <div>
              <p className="text-sm font-semibold text-red-200">
                Nao consegui montar a comparacao publica
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                {comparisonError}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <SimilarCases
        cases={similarCases}
        loading={casesLoading}
        comparison={comparison}
        durationStats={durationStats}
        subtitle="Comparacao montada com base no resumo informado no formulario e nos sinais trabalhistas marcados na triagem."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-panel p-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-bold">Levar para analise humana</h2>
          </div>
          <p className="mt-4 text-sm leading-7">
            Se voce quiser transformar a triagem em estrategia, o caminho mais
            objetivo agora e falar com a equipe com esse resumo em maos.
          </p>
          <a
            href={buildWhatsAppLink(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 w-full"
          >
            Atendimento via WhatsApp
          </a>
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-sky-400" />
            <h2 className="text-xl font-bold">Se quiser continuar sozinho</h2>
          </div>
          <p className="mt-4 text-sm leading-7">
            Use o chat para organizar perguntas adicionais, documentos e
            detalhes do caso antes de sair do modo de triagem.
          </p>
          <RouteLink
            href={pagePaths.chat}
            onNavigate={onNavigate}
            className="btn-secondary mt-6 w-full"
          >
            Levar para o chat IA
          </RouteLink>
        </div>
      </div>

      {result.classification === "alta" && (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-red-300" />
            <div>
              <p className="text-sm font-semibold text-red-200">
                Atencao ao prazo trabalhista
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Em regra, o prazo para ajuizar a acao e de ate 2 anos apos o fim
                do contrato. Se voce estiver perto desse limite, priorize
                atendimento humano.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={onReset} className="btn-secondary flex-1">
          <RotateCcw className="h-4 w-4" />
          Nova simulacao
        </button>
        <RouteLink
          href={pagePaths.contact}
          onNavigate={onNavigate}
          className="btn-secondary flex-1"
        >
          Falar com a equipe
        </RouteLink>
      </div>
    </div>
  );
}
