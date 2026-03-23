import { ArrowRight, Clock3, Scale } from "lucide-react";
import RouteLink from "../components/RouteLink";
import { featuredSimulators, simulatorRegistry } from "../lib/simulators/registry";

interface SimulatorsProps {
  onNavigate: (href: string) => void;
}

function SimulatorCard({
  title,
  description,
  timeToComplete,
  area,
  href,
  onNavigate,
}: {
  title: string;
  description: string;
  timeToComplete: string;
  area: string;
  href: string;
  onNavigate: (href: string) => void;
}) {
  return (
    <RouteLink
      href={href}
      onNavigate={onNavigate}
      className="surface-card block p-6 transition-transform hover:-translate-y-1"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow">{area}</span>
        <span className="inline-flex items-center gap-2 text-xs text-slate-400">
          <Clock3 className="h-4 w-4 text-emerald-400" />
          {timeToComplete}
        </span>
      </div>
      <h2 className="mt-5 text-2xl font-bold text-white">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-300">{description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
        Abrir simulador
        <ArrowRight className="h-4 w-4" />
      </span>
    </RouteLink>
  );
}

export default function Simulators({ onNavigate }: SimulatorsProps) {
  const primarySimulator = simulatorRegistry.find(
    (simulator) => simulator.slug === "trabalhista-geral"
  );

  return (
    <div className="page-frame pt-16 md:pt-20">
      <section className="section-spacing">
        <div className="container-custom space-y-10">
          <div className="surface-panel p-7 md:p-8">
            <span className="eyebrow">hub de simuladores</span>
            <h1 className="mt-6">
              Simuladores juridicos para dores especificas e triagem inicial mais objetiva.
            </h1>
            <p className="mt-6 max-w-3xl text-lg">
              Esta area concentra os fluxos mais estruturados do site. Cada
              simulador foi pensado para um tipo de problema, com perguntas
              previsiveis, resultado claro e CTA forte para atendimento humano.
            </p>
          </div>

          {primarySimulator ? (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="surface-card p-6 md:p-7">
                <span className="eyebrow">simulador principal</span>
                <h2 className="mt-5 text-3xl font-bold text-white">
                  {primarySimulator.name}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {primarySimulator.longDescription}
                </p>
                <div className="mt-6 grid gap-3">
                  {primarySimulator.introBullets.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-panel p-6 md:p-7">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
                  <Scale className="h-4 w-4 text-sky-400" />
                  {primarySimulator.timeToComplete}
                </div>
                <p className="mt-6 text-sm uppercase tracking-[0.18em] text-slate-400">
                  melhor para
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Quem ainda quer uma leitura trabalhista ampla antes de entrar
                  em simuladores mais especificos como rescisao, horas extras ou FGTS.
                </p>
                <RouteLink
                  href={primarySimulator.path}
                  onNavigate={onNavigate}
                  className="btn-primary mt-8 w-full justify-center"
                >
                  Abrir simulador principal
                </RouteLink>
              </div>
            </div>
          ) : null}

          <div>
            <h2 className="text-3xl font-bold text-white">Simuladores especificos</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              Comece pelos fluxos mais orientados a conversao e maior clareza de
              tese. Eles puxam melhor o resumo do caso e reduzem ruido.
            </p>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {featuredSimulators.map((simulator) => (
                <SimulatorCard
                  key={simulator.slug}
                  title={simulator.name}
                  description={simulator.shortDescription}
                  timeToComplete={simulator.timeToComplete}
                  area={simulator.area}
                  href={simulator.path}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
