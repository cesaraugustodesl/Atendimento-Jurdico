import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  FileText,
  MessageSquare,
  Scale,
  Shield,
  Sparkles,
} from "lucide-react";
import RouteLink from "../components/RouteLink";
import { pagePaths } from "../config/site";

interface HowItWorksProps {
  onNavigate: (href: string) => void;
}

const stages = [
  {
    icon: MessageSquare,
    title: "1. Entrada guiada",
    description:
      "Voce escolhe entre chat juridico geral, hub de simuladores ou contato direto, sem cair em uma pagina generica.",
  },
  {
    icon: Sparkles,
    title: "2. Organizacao do contexto",
    description:
      "O sistema resume o problema, destaca lacunas de informacao e indica quais documentos ajudam a dar o proximo passo.",
  },
  {
    icon: Scale,
    title: "3. Encaminhamento correto",
    description:
      "Se for um caso que pede estrategia humana, o fluxo te direciona para atendimento de consulta em vez de forcar uma automacao rasa.",
  },
];

const outputs = [
  "Resumo do caso em linguagem simples",
  "Perguntas que ainda precisam ser respondidas",
  "Sinais de urgencia ou risco que merecem atencao",
  "Checklist inicial de documentos e evidencias",
  "Decisao mais clara entre continuar sozinho ou falar com um advogado",
];

export default function HowItWorks({ onNavigate }: HowItWorksProps) {
  return (
    <div className="page-frame pt-16 md:pt-20">
      <section className="section-spacing">
        <div className="container-custom">
          <div className="max-w-3xl">
            <span className="eyebrow">arquitetura do atendimento</span>
            <h1 className="mt-6">
              O site foi reorganizado para funcionar como triagem, nao como
              ornamentacao.
            </h1>
            <p className="mt-6 max-w-2xl text-lg">
              Em vez de jogar todo mundo no mesmo fluxo, a experiencia foi
              dividida em caminhos mais claros: chat juridico geral,
              simuladores juridicos e contato humano.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-custom">
          <div className="grid gap-6 lg:grid-cols-3">
            {stages.map((stage) => {
              const Icon = stage.icon;
              return (
                <div key={stage.title} className="surface-panel p-7">
                  <div className="inline-flex rounded-2xl bg-sky-500/10 p-3 text-sky-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold">{stage.title}</h2>
                  <p className="mt-4 text-sm leading-7">{stage.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="surface-card p-7 md:p-8">
              <span className="eyebrow">o que voce recebe</span>
              <h2 className="section-title mt-5">
                A triagem foi pensada para gerar utilidade rapida.
              </h2>
              <div className="mt-8 space-y-4">
                {outputs.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
                    <p className="text-sm leading-6">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-panel p-7 md:p-8">
              <span className="eyebrow">quando nao insistir na automacao</span>
              <h2 className="section-title mt-5">
                Alguns casos exigem ajuda humana desde o inicio.
              </h2>
              <div className="mt-8 space-y-5">
                <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-red-400" />
                    <div>
                      <p className="text-sm font-semibold text-red-300">
                        Situacoes urgentes
                      </p>
                      <p className="mt-2 text-sm leading-6">
                        Prazo correndo, violencia, risco clinico, ameacas ou
                        notificacao formal recebida.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start gap-3">
                    <Shield className="mt-1 h-5 w-5 flex-shrink-0 text-sky-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Revisao de documentos
                      </p>
                      <p className="mt-2 text-sm leading-6">
                        Contratos, sentencas, recursos, notificacoes ou termos
                        de acordo pedem leitura tecnica, nao apenas resumo.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Estrategia de acao
                      </p>
                      <p className="mt-2 text-sm leading-6">
                        Se voce ja sabe que vai ingressar com acao, a consulta
                        humana economiza tempo e reduz retrabalho.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-custom">
          <div className="surface-panel p-8 md:p-12 text-center">
            <span className="eyebrow">escolha o caminho</span>
            <h2 className="section-title mt-5">
              Quer testar o fluxo agora?
            </h2>
            <p className="section-lead mx-auto">
              Use o chat para triagem geral ou abra os simuladores para fluxos
              mais especificos. Se o caso ja pede estrategia, va direto para
              contato.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <RouteLink href={pagePaths.chat} onNavigate={onNavigate} className="btn-primary">
                <MessageSquare className="w-5 h-5" />
                Abrir chat IA
              </RouteLink>
              <RouteLink
                href={pagePaths.simulators}
                onNavigate={onNavigate}
                className="btn-secondary"
              >
                Ver simuladores
                <ArrowRight className="w-4 h-4" />
              </RouteLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
