import { useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Calculator,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  HeartHandshake,
  MessageSquare,
  Scale,
  Shield,
} from "lucide-react";
import RouteLink from "../components/RouteLink";
import { pagePaths, siteConfig } from "../config/site";
import { getFeaturedGuides, getFeaturedPosts } from "../content";

interface HomeProps {
  onNavigate: (href: string) => void;
}

const startOptions = [
  {
    icon: MessageSquare,
    title: "Triagem juridica geral",
    description:
      "Para consumidor, contratos, familia, saude e golpes. A IA organiza a situacao e aponta proximos passos.",
    action: "Comecar pelo chat",
    href: pagePaths.chat,
    accent: "from-sky-500/20 to-blue-600/10 border-sky-400/20",
  },
  {
    icon: Calculator,
    title: "Simuladores juridicos",
    description:
      "Para abrir o hub com simulador trabalhista, rescisao, horas extras, FGTS e outros fluxos mais especificos.",
    action: "Ver simuladores",
    href: pagePaths.simulators,
    accent: "from-emerald-500/20 to-emerald-700/10 border-emerald-400/20",
  },
  {
    icon: Calendar,
    title: "Consulta humana",
    description:
      "Para casos urgentes, estrategia, revisao de documentos ou quando voce prefere atendimento direto.",
    action: "Agendar analise",
    href: pagePaths.contact,
    accent: "from-amber-500/20 to-amber-700/10 border-amber-400/20",
  },
];

const benefits = [
  {
    icon: Shield,
    title: "Linguagem clara",
    description:
      "O produto foi desenhado para traduzir o juridico em decisoes praticas.",
  },
  {
    icon: FileText,
    title: "Checklist util",
    description:
      "Voce sai com noção de documentos, riscos e proximos passos.",
  },
  {
    icon: Clock3,
    title: "Entrada rapida",
    description:
      "Em vez de explicar tudo do zero na consulta, voce ja chega organizado.",
  },
  {
    icon: HeartHandshake,
    title: "Escalada humana",
    description:
      "Quando fizer sentido, o fluxo te leva para atendimento humano.",
  },
];

const areas = [
  "Consumidor",
  "Trabalhista",
  "Familia",
  "Contratos",
  "Plano de saude",
  "Golpes e fraudes",
];

const faqs = [
  {
    question: "A IA substitui um advogado?",
    answer:
      "Nao. Ela faz triagem inicial, organiza informacoes e ajuda a entender o contexto. A decisao juridica formal continua sendo humana.",
  },
  {
    question: "Quando eu devo ir direto para contato humano?",
    answer:
      "Quando houver prazo correndo, risco a saude, violencia, necessidade de estrategia processual ou analise de documento especifico.",
  },
  {
    question: "O simulador trabalhista da um valor exato?",
    answer:
      "Nao. Ele gera uma faixa estimada com base nos dados informados. A revisao humana ainda e necessaria para fechar a tese e o valor real.",
  },
  {
    question: "Os meus dados ficam expostos?",
    answer:
      "O site foi pensado para captar apenas o necessario na triagem inicial. O detalhamento completo deve acontecer em canal seguro e atendimento formal.",
  },
];

const featuredGuides = getFeaturedGuides();
const featuredPosts = getFeaturedPosts();

export default function Home({ onNavigate }: HomeProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="page-frame pt-16 md:pt-20">
      <section className="section-spacing">
        <div className="container-custom">
          <div className="hero-layout items-start">
            <div className="hero-copy">
              <span className="eyebrow mb-6">triagem juridica com clareza</span>
              <h1 className="max-w-4xl">
                Entenda o seu caso, organize o contexto e escolha o proximo
                passo com mais seguranca.
              </h1>
              <p className="mt-6 max-w-2xl text-lg md:text-xl">
                O site foi estruturado para duas entradas. O <strong>Chat IA</strong>{" "}
                organiza duvidas juridicas gerais. O{" "}
                <strong>hub de simuladores</strong> concentra os fluxos
                especificos para quem precisa medir sinais de direitos nao
                pagos antes da consulta.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <RouteLink href={pagePaths.chat} onNavigate={onNavigate} className="btn-primary">
                  <MessageSquare className="w-5 h-5" />
                  Comecar pelo chat
                </RouteLink>
                <RouteLink
                  href={pagePaths.simulators}
                  onNavigate={onNavigate}
                  className="btn-secondary"
                >
                  <Calculator className="w-5 h-5" />
                  Ver simuladores
                </RouteLink>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <Shield className="w-4 h-4 text-sky-400" />
                  Orientacao inicial sem juridiques
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <Scale className="w-4 h-4 text-sky-400" />
                  Fluxo pensado para triagem e consulta
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  Escalada para atendimento humano
                </span>
              </div>
            </div>

            <div className="surface-panel hero-entry-panel">
              <span className="eyebrow">rota de entrada</span>
              <h2 className="mt-5 text-3xl font-bold text-white font-display">
                Escolha sua entrada
              </h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
                Cada caminho foi separado por intencao. Assim a triagem fica
                mais clara, mais rapida e menos genérica.
              </p>
              <div className="glow-divider mt-6" />
              <div className="hero-entry-stack">
                {startOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <RouteLink
                      key={option.title}
                      href={option.href}
                      onNavigate={onNavigate}
                      className={`hero-entry-card w-full border text-left transition-transform ${option.accent}`}
                    >
                      <div className="hero-entry-card__content">
                        <div className="mt-1 rounded-2xl bg-slate-950/70 p-3">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="hero-entry-card__body">
                          <h3 className="text-xl font-bold text-white">
                            {option.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {option.description}
                          </p>
                          <span className="hero-entry-card__action">
                            {option.action}
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </RouteLink>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-custom">
          <div className="surface-card p-6 md:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <span className="eyebrow">como o produto foi organizado</span>
                <h2 className="section-title mt-5">
                  Primeiro clareza. Depois estrategia.
                </h2>
                <p className="section-lead">
                  A navegacao ficou mais objetiva para separar triagem geral,
                  simulacao trabalhista e agendamento de analise.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    number: "01",
                    title: "Voce descreve",
                    text: "Escolhe o fluxo, informa o minimo necessario e coloca o problema em contexto.",
                  },
                  {
                    number: "02",
                    title: "O sistema organiza",
                    text: "A IA ou o simulador devolvem estrutura, sinais de risco e documentos para reunir.",
                  },
                  {
                    number: "03",
                    title: "Voce decide",
                    text: "Com mais clareza, voce segue no chat, leva para consulta ou aciona contato humano.",
                  },
                ].map((item) => (
                  <div key={item.number} className="rounded-3xl border border-white/10 bg-black/10 p-5">
                    <p className="text-sm font-semibold text-sky-400">{item.number}</p>
                    <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-custom">
          <div className="max-w-3xl">
            <span className="eyebrow">o que voce recebe</span>
            <h2 className="section-title mt-5">
              Menos ruido. Mais contexto util para agir.
            </h2>
            <p className="section-lead">
              O site nao tenta substituir um escritorio. Ele tenta reduzir o
              atrito da primeira explicacao e melhorar a qualidade do contato.
            </p>
          </div>

          <div className="card-grid mt-10 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="surface-card p-6">
                  <div className="mb-5 inline-flex rounded-2xl bg-sky-500/10 p-3 text-sky-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="surface-panel p-7 md:p-8">
              <span className="eyebrow">areas cobertas</span>
              <h2 className="section-title mt-5">
                O Chat IA ficou reposicionado como triagem juridica geral.
              </h2>
              <p className="section-lead">
                Ele funciona melhor quando usado para mapear situacoes e levar
                uma narrativa organizada para a consulta.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {areas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <RouteLink
                href={pagePaths.areas}
                onNavigate={onNavigate}
                className="btn-secondary mt-8"
              >
                Ver areas de atuacao
                <ArrowRight className="w-4 h-4" />
              </RouteLink>
            </div>

            <div className="surface-card p-7 md:p-8">
              <span className="eyebrow">quando pular a triagem</span>
              <h2 className="section-title mt-5">
                Alguns cenarios pedem contato humano mais cedo.
              </h2>
              <div className="mt-6 space-y-4">
                {[
                  "Prazo legal correndo ou audiencia marcada",
                  "Negativa de plano de saude com urgencia clinica",
                  "Violencia, ameacas ou necessidade de medida protetiva",
                  "Leitura de contrato, notificacao ou documento ja recebido",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 w-5 h-5 flex-shrink-0 text-emerald-400" />
                    <p className="text-sm leading-6">{item}</p>
                  </div>
                ))}
              </div>
              <RouteLink
                href={pagePaths.contact}
                onNavigate={onNavigate}
                className="btn-primary mt-8"
              >
                Agendar analise humana
              </RouteLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <span className="eyebrow">conteudo para organico</span>
              <h2 className="section-title mt-5">
                Guias de busca real e artigos para aquecer a consulta.
              </h2>
              <p className="section-lead">
                O site agora tambem responde buscas informacionais e
                transacionais com paginas focadas em problemas juridicos reais.
              </p>
              <RouteLink
                href={pagePaths.blog}
                onNavigate={onNavigate}
                className="btn-secondary mt-8"
              >
                Ver blog juridico
                <ArrowRight className="w-4 h-4" />
              </RouteLink>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {featuredGuides.slice(0, 2).map((guide) => (
                <RouteLink
                  key={guide.path}
                  href={guide.path}
                  onNavigate={onNavigate}
                  className="surface-card p-5 hover:-translate-y-1"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-sky-300">
                    {guide.category}
                  </p>
                  <h3 className="mt-4 text-2xl font-bold text-white">{guide.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{guide.description}</p>
                </RouteLink>
              ))}
              {featuredPosts.slice(0, 2).map((post) => (
                <RouteLink
                  key={post.path}
                  href={post.path}
                  onNavigate={onNavigate}
                  className="surface-card p-5 hover:-translate-y-1"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">
                    {post.category}
                  </p>
                  <h3 className="mt-4 text-2xl font-bold text-white">{post.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{post.description}</p>
                </RouteLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <span className="eyebrow">perguntas frequentes</span>
              <h2 className="section-title mt-5">
                As duvidas mais comuns antes de usar o site.
              </h2>
              <p className="section-lead">
                Se ainda estiver em duvida, o caminho mais simples e comecar
                pelo chat ou ir direto para contato.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={faq.question} className="surface-card overflow-hidden">
                  <button
                    onClick={() =>
                      setOpenFaq(openFaq === index ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-base font-semibold text-white">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 flex-shrink-0 text-sky-400 transition-transform ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="border-t border-white/10 px-6 pb-5 pt-4 text-sm leading-6 text-slate-300">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-custom">
          <div className="surface-panel p-8 md:p-12 text-center">
            <span className="eyebrow">proximo passo</span>
            <h2 className="section-title mt-5 max-w-3xl mx-auto">
              Escolha o fluxo que combina com o seu momento.
            </h2>
            <p className="section-lead mx-auto">
              Se voce quer entender melhor o caso, comece pelo chat. Se a duvida
              envolver verbas, direitos especificos ou triagem financeira, use os
              simuladores. Se ja precisa de estrategia, fale direto com a equipe.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <RouteLink href={pagePaths.chat} onNavigate={onNavigate} className="btn-primary">
                <MessageSquare className="w-5 h-5" />
                Abrir chat IA
              </RouteLink>
              <RouteLink
                href={pagePaths.contact}
                onNavigate={onNavigate}
                className="btn-secondary"
              >
                <Briefcase className="w-5 h-5" />
                Falar com a equipe
              </RouteLink>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              Contato atual: {siteConfig.contact.whatsappDisplay} ·{" "}
              {siteConfig.contact.email}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
