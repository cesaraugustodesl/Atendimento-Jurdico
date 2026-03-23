import {
  Activity,
  ArrowRight,
  Briefcase,
  FileText,
  Heart,
  ShoppingCart,
  Smartphone,
} from "lucide-react";
import RouteLink from "../components/RouteLink";
import { pagePaths } from "../config/site";

interface AreasProps {
  onNavigate: (href: string) => void;
}

const areas = [
  {
    icon: ShoppingCart,
    title: "Consumidor",
    description:
      "Cobrancas indevidas, produto com defeito, cancelamentos, negativacao e problemas com servicos.",
    examples: [
      "nome negativado",
      "compra nao entregue",
      "assinatura dificil de cancelar",
    ],
  },
  {
    icon: Briefcase,
    title: "Trabalhista",
    description:
      "Demissao, verbas rescisorias, FGTS, horas extras, vinculo de emprego, assedio e irregularidades no contrato.",
    examples: [
      "verbas nao pagas",
      "FGTS irregular",
      "contratacao PJ com subordinacao",
    ],
  },
  {
    icon: Heart,
    title: "Familia",
    description:
      "Pensao, guarda, divorcio, uniao estavel, partilha e conflitos familiares que exigem orientacao inicial.",
    examples: [
      "pedido de pensao",
      "revisao de guarda",
      "separacao com filhos",
    ],
  },
  {
    icon: FileText,
    title: "Contratos e civil",
    description:
      "Clausulas abusivas, descumprimento de acordo, multa, aluguel, prestacao de servico e notificacoes.",
    examples: [
      "multa contratual",
      "aluguel e rescisao",
      "acordo descumprido",
    ],
  },
  {
    icon: Activity,
    title: "Saude",
    description:
      "Negativa de cobertura, cirurgia, exame, internacao, reembolso e conflitos com operadoras de plano de saude.",
    examples: [
      "cirurgia negada",
      "reembolso recusado",
      "urgencia clinica",
    ],
  },
  {
    icon: Smartphone,
    title: "Golpes e fraudes",
    description:
      "Pix, cartao clonado, fraude bancaria, emprestimo nao contratado, invasao de conta e golpes digitais.",
    examples: [
      "golpe via PIX",
      "compra nao reconhecida",
      "conta hackeada",
    ],
  },
];

export default function Areas({ onNavigate }: AreasProps) {
  return (
    <div className="page-frame pt-16 md:pt-20">
      <section className="section-spacing">
        <div className="container-custom">
          <div className="max-w-3xl">
            <span className="eyebrow">mapa de atendimento</span>
            <h1 className="mt-6">
              O site cobre as duvidas mais comuns de quem precisa de uma
              primeira leitura do caso.
            </h1>
            <p className="mt-6 max-w-2xl text-lg">
              Esta pagina serve para orientar o caminho de entrada. Se a sua
              situacao estiver entre as areas abaixo, o chat ajuda a organizar o
              contexto. Se houver necessidade de triagem mais estruturada, o hub
              de simuladores e mais adequado.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-custom">
          <div className="card-grid md:grid-cols-2 xl:grid-cols-3">
            {areas.map((area) => {
              const Icon = area.icon;
              return (
                <div key={area.title} className="surface-panel p-7">
                  <div className="inline-flex rounded-2xl bg-sky-500/10 p-3 text-sky-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold">{area.title}</h2>
                  <p className="mt-4 text-sm leading-7">{area.description}</p>
                  <div className="mt-5 space-y-2">
                    {area.examples.map((example) => (
                      <div
                        key={example}
                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300"
                      >
                        {example}
                      </div>
                    ))}
                  </div>
                  <RouteLink
                    href={pagePaths.chat}
                    onNavigate={onNavigate}
                    className="btn-secondary mt-6 w-full"
                  >
                    Perguntar no chat
                    <ArrowRight className="w-4 h-4" />
                  </RouteLink>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
            <div className="surface-card p-7 md:p-8">
              <span className="eyebrow">melhor ponto de entrada</span>
              <h2 className="section-title mt-5">
                Quando usar chat, simulador ou contato direto.
              </h2>
              <div className="mt-8 space-y-4">
                <div className="rounded-3xl border border-sky-400/20 bg-sky-500/10 p-5">
                  <p className="text-sm font-semibold text-sky-300">Chat IA</p>
                  <p className="mt-2 text-sm leading-6">
                    Melhor para quem ainda esta tentando entender a situacao e
                    precisa de um primeiro mapa do problema.
                  </p>
                </div>
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5">
                  <p className="text-sm font-semibold text-emerald-300">
                    Simuladores
                  </p>
                  <p className="mt-2 text-sm leading-6">
                    Melhor quando a pergunta central envolve verbas, FGTS, horas
                    extras, golpe via PIX ou outro fluxo com perguntas mais objetivas.
                  </p>
                </div>
                <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5">
                  <p className="text-sm font-semibold text-amber-300">
                    Contato humano
                  </p>
                  <p className="mt-2 text-sm leading-6">
                    Melhor para urgencias, estrategia, analise de documentos ou
                    quando voce nao quer depender da triagem automatizada.
                  </p>
                </div>
              </div>
            </div>

            <div className="surface-panel p-7 md:p-8">
              <span className="eyebrow">nao encontrou sua area?</span>
              <h2 className="section-title mt-5">
                O melhor caminho continua sendo descrever o caso com clareza.
              </h2>
              <p className="section-lead">
                Mesmo quando a area nao aparece explicitamente aqui, o chat pode
                servir como triagem inicial e o contato humano como proximo
                passo.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <RouteLink href={pagePaths.chat} onNavigate={onNavigate} className="btn-primary">
                  Abrir chat IA
                </RouteLink>
                <RouteLink
                  href={pagePaths.contact}
                  onNavigate={onNavigate}
                  className="btn-secondary"
                >
                  Falar com a equipe
                </RouteLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
