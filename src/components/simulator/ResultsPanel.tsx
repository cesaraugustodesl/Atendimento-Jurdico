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
import {
  buildWhatsAppLink,
  pagePaths,
} from "../../config/site";
import type {
  CaseComparisonInsight,
  CaseComparisonItem,
  CaseDurationStats,
} from "../../lib/caseComparison";
import type {
  SimulatorDefinition,
  SimulatorOutcome,
} from "../../lib/simulators/types";
import { trackEvent } from "../../services/trackingService";

interface ResultsPanelProps {
  simulator: SimulatorDefinition;
  result: SimulatorOutcome;
  similarCases: CaseComparisonItem[];
  casesLoading: boolean;
  comparison: CaseComparisonInsight | null;
  durationStats: CaseDurationStats | null;
  comparisonError: string;
  onReset: () => void;
  onNavigate: (href: string) => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function renderEstimate(result: SimulatorOutcome) {
  if (!result.estimate) {
    return null;
  }

  if (result.estimate.valueText) {
    return <span className="text-3xl font-black text-emerald-400">{result.estimate.valueText}</span>;
  }

  if (
    typeof result.estimate.min === "number" &&
    typeof result.estimate.max === "number"
  ) {
    return (
      <div className="flex flex-wrap items-end gap-3">
        <span className="text-3xl font-black text-emerald-400">
          {formatCurrency(result.estimate.min)}
        </span>
        <span className="text-slate-500">a</span>
        <span className="text-3xl font-black text-emerald-400">
          {formatCurrency(result.estimate.max)}
        </span>
      </div>
    );
  }

  return null;
}

export default function ResultsPanel({
  simulator,
  result,
  similarCases,
  casesLoading,
  comparison,
  durationStats,
  comparisonError,
  onReset,
  onNavigate,
}: ResultsPanelProps) {
  const whatsappMessage = [
    `Ola, acabei de concluir o ${simulator.name}.`,
    "",
    `Score: ${result.score}/100 (${result.leadPriority})`,
    `Resumo: ${result.whatsappSummary}`,
    "",
    "Gostaria de falar com a equipe sobre meu caso.",
  ].join("\n");

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="surface-panel p-7 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="eyebrow">resultado da triagem</span>
            <h1 className="mt-5 text-3xl md:text-4xl">
              Seu resultado do {simulator.name.toLowerCase()} ficou pronto.
            </h1>
            <p className="mt-4 text-sm leading-7">{result.summary}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <ScoreGauge score={result.score} classification={result.leadPriority} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-bold">
              {result.estimate?.label ?? "Potencial inicial"}
            </h2>
          </div>
          <p className="mt-4 text-sm leading-7">
            {result.potentialLabel}. Esta leitura serve para organizar expectativa e
            proximo passo, nao para substituir analise juridica individualizada.
          </p>
          <div className="mt-6">{renderEstimate(result)}</div>
          {result.urgencyLevel || result.documentationStrength || result.claimPotential ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {result.urgencyLevel ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Urgencia</p>
                  <p className="mt-2 text-sm font-semibold text-white">{result.urgencyLevel}</p>
                </div>
              ) : null}
              {result.documentationStrength ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Documentacao</p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {result.documentationStrength}
                  </p>
                </div>
              ) : null}
              {result.claimPotential ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Potencial</p>
                  <p className="mt-2 text-sm font-semibold text-white">{result.claimPotential}</p>
                </div>
              ) : null}
            </div>
          ) : null}
          {result.estimate?.helper ? (
            <p className="mt-3 text-xs leading-6 text-slate-500">
              {result.estimate.helper}
            </p>
          ) : null}
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-sky-400" />
            <h2 className="text-xl font-bold">Como ler esse resultado</h2>
          </div>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Score do lead</p>
              <p className="mt-2 text-sm leading-6">
                O score mede prioridade e densidade de sinais, nao certeza de ganho.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Confianca da triagem</p>
              <p className="mt-2 text-sm leading-6">
                {result.confidenceScore}/100. Quanto mais objetiva a resposta e melhor a base
                informada, maior a confianca da leitura inicial.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Conclusao pratica</p>
              <p className="mt-2 text-sm leading-6">
                O objetivo aqui e organizar o caso, separar prova e decidir se vale
                levar para atendimento humano agora.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Aviso legal</p>
              <p className="mt-2 text-sm leading-6">
                Esta e uma analise preliminar informativa e nao substitui a
                avaliacao juridica individualizada.
              </p>
            </div>
          </div>
        </div>
      </div>

      {result.breakdown && result.breakdown.length > 0 ? (
        <div className="surface-card p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-bold">Breakdown preliminar</h2>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {result.breakdown.map((item) => (
              <div
                key={item.key}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    {item.helper ? (
                      <p className="mt-2 text-xs leading-6 text-slate-400">{item.helper}</p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">
                      {typeof item.amount === "number"
                        ? formatCurrency(item.amount)
                        : item.valueText ?? "Informativo"}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-500">
                      {item.includedInEstimate ? "entra na faixa" : "referencia"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {result.findings.length > 0 ? (
        <div className="surface-card p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-bold">Pontos identificados</h2>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {result.findings.map((finding) => (
              <div
                key={finding}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300"
              >
                {finding}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {result.observations.length > 0 ? (
        <div className="surface-card p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-300" />
            <h2 className="text-xl font-bold">Observacoes de leitura</h2>
          </div>
          <div className="mt-5 space-y-3">
            {result.observations.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {result.recommendations.length > 0 ? (
        <div className="surface-panel p-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-sky-400" />
            <h2 className="text-xl font-bold">Proximos passos sugeridos</h2>
          </div>
          <div className="mt-5 space-y-3">
            {result.recommendations.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {result.disclaimers.length > 0 ? (
        <div className="surface-panel p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-amber-300" />
            <div className="w-full">
              <p className="text-sm font-semibold text-amber-200">Disclaimers e cautelas</p>
              <div className="mt-3 space-y-2">
                {result.disclaimers.map((item) => (
                  <p key={item} className="text-sm leading-7 text-slate-300">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {result.caution ? (
        <div className="surface-panel p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-amber-300" />
            <p className="text-sm leading-7">{result.caution}</p>
          </div>
        </div>
      ) : null}

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

      {simulator.supportsPublicCaseComparison ? (
        <SimilarCases
          cases={similarCases}
          loading={casesLoading}
          comparison={comparison}
          durationStats={durationStats}
          title={simulator.comparisonTitle}
          subtitle={simulator.comparisonSubtitle}
        />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-panel p-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-bold">Levar para analise humana</h2>
          </div>
          <p className="mt-4 text-sm leading-7">
            Se voce quiser transformar essa triagem em estrategia, o caminho mais
            objetivo agora e falar com a equipe com esse resumo em maos.
          </p>
          <a
            href={buildWhatsAppLink(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 w-full"
            onClick={() =>
              trackEvent("clicou_whatsapp", {
                origem: "resultado_simulador",
                simulator_slug: simulator.slug,
                simulator_nome: simulator.name,
                score: result.score,
                lead_priority: result.leadPriority,
              })
            }
          >
            Atendimento via WhatsApp
          </a>
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-sky-400" />
            <h2 className="text-xl font-bold">Explorar outros caminhos</h2>
          </div>
          <p className="mt-4 text-sm leading-7">
            Voce pode refazer esta triagem, ver outros simuladores especificos ou
            levar o caso para o chat IA.
          </p>
          <div className="mt-6 grid gap-3">
            <button onClick={onReset} className="btn-secondary w-full justify-center">
              <RotateCcw className="h-4 w-4" />
              Refazer simulacao
            </button>
            <RouteLink
              href={pagePaths.simulators}
              onNavigate={onNavigate}
              className="btn-secondary w-full justify-center"
            >
              Ver outros simuladores
            </RouteLink>
            <RouteLink
              href={pagePaths.chat}
              onNavigate={onNavigate}
              className="btn-secondary w-full justify-center"
            >
              Levar para o chat IA
            </RouteLink>
          </div>
        </div>
      </div>
    </div>
  );
}
