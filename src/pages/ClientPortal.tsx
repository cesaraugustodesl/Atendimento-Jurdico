import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BellRing,
  FolderOpenDot,
  LifeBuoy,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import RouteLink from "../components/RouteLink";
import PortalMetricCard from "../components/portal/PortalMetricCard";
import PortalStatusPill from "../components/portal/PortalStatusPill";
import { buildWhatsAppLink, pagePaths } from "../config/site";
import { getClientCasePath } from "../lib/clientPortal/integrations";
import { formatPortalDate } from "../lib/clientPortal/types";
import {
  hasStaffAccess,
  loadClientDashboard,
} from "../services/clientPortalService";
import {
  getPortalSession,
  onPortalAuthStateChange,
  sendPortalMagicLink,
  signOutPortal,
} from "../services/portalAuthService";

interface ClientPortalProps {
  onNavigate: (href: string) => void;
}

export default function ClientPortal({ onNavigate }: ClientPortalProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboard, setDashboard] = useState<Awaited<
    ReturnType<typeof loadClientDashboard>
  > | null>(null);
  const [hasOfficeAccess, setHasOfficeAccess] = useState(false);
  const [email, setEmail] = useState("");
  const [sendingLink, setSendingLink] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      const currentSession = await getPortalSession();
      if (!active) {
        return;
      }

      setSession(currentSession);
      setSessionLoading(false);
    };

    void hydrate();

    const { data } = onPortalAuthStateChange((_event, nextSession) => {
      if (!active) {
        return;
      }

      setSession(nextSession);
      setSessionLoading(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setDashboard(null);
      setHasOfficeAccess(false);
      return;
    }

    let active = true;

    const load = async () => {
      try {
        setDashboardLoading(true);
        setError("");

        const [clientDashboard, officeAccess] = await Promise.all([
          loadClientDashboard(),
          hasStaffAccess().catch(() => false),
        ]);

        if (!active) {
          return;
        }

        setDashboard(clientDashboard);
        setHasOfficeAccess(officeAccess);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Nao foi possivel carregar a area do cliente agora."
        );
      } finally {
        if (active) {
          setDashboardLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [session]);

  const supportLink = useMemo(
    () =>
      buildWhatsAppLink(
        "Ola, preciso de ajuda para acessar a area do cliente e acompanhar meu caso."
      ),
    []
  );

  const handleMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSendingLink(true);
      setNotice("");
      setError("");

      const { error: linkError } = await sendPortalMagicLink(email);

      if (linkError) {
        throw linkError;
      }

      setNotice(
        "Enviamos um link de acesso para o e-mail informado. Depois de abrir o link, volte para esta pagina."
      );
      setEmail("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Nao foi possivel enviar o link de acesso."
      );
    } finally {
      setSendingLink(false);
    }
  };

  const handleSignOut = async () => {
    await signOutPortal();
    setDashboard(null);
    setNotice("Sessao encerrada.");
  };

  if (sessionLoading) {
    return (
      <div className="page-frame pt-16 md:pt-20">
        <section className="section-spacing">
          <div className="container-custom">
            <div className="surface-panel p-8 md:p-10">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                preparando o acesso
              </p>
              <h1 className="mt-6 text-4xl font-bold text-white">
                Carregando a area do cliente.
              </h1>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="page-frame pt-16 md:pt-20">
        <section className="section-spacing">
          <div className="container-custom grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="surface-panel p-8 md:p-10">
              <span className="eyebrow">area do cliente</span>
              <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white">
                Acompanhe caso, documentos e atualizacoes em um unico painel.
              </h1>
              <p className="mt-6 max-w-2xl text-base md:text-lg leading-8 text-slate-300">
                Depois da triagem e do atendimento humano, o cliente passa a ver o
                historico do caso, pedidos pendentes, documentos e avisos em uma area
                protegida. O acesso e feito por link magico no e-mail.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <PortalMetricCard
                  label="timeline"
                  value="1"
                  description="Historico centralizado com atualizacoes manuais e, depois, integracoes externas."
                  icon={<BellRing className="h-5 w-5" />}
                />
                <PortalMetricCard
                  label="documentos"
                  value="2"
                  description="Espaco para comprovantes, peticoes, prazos e arquivos solicitados pela equipe."
                  icon={<FolderOpenDot className="h-5 w-5" />}
                />
                <PortalMetricCard
                  label="acesso"
                  value="3"
                  description="Entrada individual por magic link, sem senha fixa e com menos atrito para o cliente."
                  icon={<ShieldCheck className="h-5 w-5" />}
                />
              </div>
            </div>

            <div className="surface-card p-8 md:p-10">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                entrar ou ativar acesso
              </p>
              <h2 className="mt-5 text-3xl font-bold text-white">
                Receba o link da sua area do cliente.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Use o mesmo e-mail informado no atendimento. Se o caso ja estiver
                cadastrado, ele aparecera aqui depois do login.
              </p>

              <form className="mt-8 space-y-4" onSubmit={handleMagicLink}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    E-mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50"
                    placeholder="voce@exemplo.com"
                    required
                  />
                </label>
                <button
                  type="submit"
                  className="btn-primary w-full justify-center"
                  disabled={sendingLink}
                >
                  {sendingLink ? "Enviando link..." : "Enviar link de acesso"}
                </button>
              </form>

              {notice ? (
                <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  {notice}
                </div>
              ) : null}

              {error ? (
                <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </div>
              ) : null}

              <div className="mt-8 grid gap-3">
                <RouteLink
                  href={supportLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary w-full justify-center"
                >
                  <LifeBuoy className="h-4 w-4" />
                  Falar com a equipe
                </RouteLink>
                <RouteLink
                  href={pagePaths.contact}
                  onNavigate={onNavigate}
                  className="btn-outline w-full justify-center"
                >
                  Ainda nao virei cliente
                </RouteLink>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const totalCases = dashboard?.cases.length ?? 0;
  const recentUpdates = dashboard?.recentUpdates.length ?? 0;
  const unreadNotifications =
    dashboard?.notifications.filter((item) => item.status !== "read").length ?? 0;
  const nearestDeadline = dashboard?.cases
    .map((item) => item.nextDeadlineAt)
    .filter((item): item is string => Boolean(item))
    .sort()[0];

  return (
    <div className="page-frame pt-16 md:pt-20">
      <section className="section-spacing">
        <div className="container-custom space-y-8">
          <div className="surface-panel p-8 md:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <span className="eyebrow">portal autenticado</span>
                <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white">
                  Acompanhamento do cliente em um painel unico.
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
                  Voce entrou com <strong className="text-white">{session.user.email}</strong>.
                  Aqui aparecem os casos vinculados ao seu e-mail, as ultimas
                  atualizacoes e os avisos enviados pela equipe.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {hasOfficeAccess ? (
                  <RouteLink
                    href={pagePaths["office-panel"]}
                    onNavigate={onNavigate}
                    className="btn-secondary"
                  >
                    Ir para o painel interno
                  </RouteLink>
                ) : null}
                <button type="button" className="btn-outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          {!dashboard?.setup.tables.clientProfiles || !dashboard?.setup.tables.cases ? (
            <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
              A base do portal ainda nao esta completa neste ambiente. As telas ja foram
              preparadas, mas as migrations do Supabase precisam ser aplicadas para mostrar casos reais.
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <PortalMetricCard
              label="casos"
              value={String(totalCases)}
              description="Casos vinculados ao seu e-mail na area do cliente."
              icon={<FolderOpenDot className="h-5 w-5" />}
            />
            <PortalMetricCard
              label="ultimas novidades"
              value={String(recentUpdates)}
              description="Eventos recentes da timeline do seu atendimento."
              icon={<BellRing className="h-5 w-5" />}
            />
            <PortalMetricCard
              label="avisos"
              value={String(unreadNotifications)}
              description="Notificacoes de portal, e-mail ou WhatsApp ainda sem leitura."
              icon={<ShieldCheck className="h-5 w-5" />}
            />
            <PortalMetricCard
              label="proximo marco"
              value={nearestDeadline ? formatPortalDate(nearestDeadline) : "Sem prazo"}
              description="Proxima data importante registrada no seu caso."
              icon={<ArrowRight className="h-5 w-5" />}
            />
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-3xl font-bold text-white">Meus casos</h2>
                {dashboardLoading ? (
                  <p className="text-sm text-slate-400">Atualizando painel...</p>
                ) : null}
              </div>

              {totalCases === 0 ? (
                <div className="surface-card p-6">
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                    sem casos vinculados
                  </p>
                  <h3 className="mt-4 text-2xl font-bold text-white">
                    O primeiro caso vai aparecer aqui quando a equipe o abrir no portal.
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    Se voce ja concluiu uma simulacao ou falou com a equipe, use o mesmo
                    e-mail do atendimento. Assim que o caso for cadastrado, a timeline passa
                    a aparecer nesta area.
                  </p>
                </div>
              ) : (
                dashboard?.cases.map((caseItem) => (
                  <RouteLink
                    key={caseItem.id}
                    href={getClientCasePath(caseItem.id)}
                    onNavigate={onNavigate}
                    className="surface-card block p-6 transition-transform hover:-translate-y-1"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <PortalStatusPill kind="status" value={caseItem.status} />
                      <PortalStatusPill kind="priority" value={caseItem.priority} />
                      {caseItem.caseCode ? (
                        <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                          {caseItem.caseCode}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-5 text-2xl font-bold text-white">{caseItem.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{caseItem.summary}</p>
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                          Ultima movimentacao
                        </p>
                        <p className="mt-2 text-sm text-white">
                          {caseItem.lastEventSummary || "Sem resumo registrado ainda."}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                          Proximo prazo
                        </p>
                        <p className="mt-2 text-sm text-white">
                          {formatPortalDate(caseItem.nextDeadlineAt)}
                        </p>
                      </div>
                    </div>
                  </RouteLink>
                ))
              )}
            </div>

            <div className="space-y-5">
              <div className="surface-panel p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                  historico recente
                </p>
                <div className="mt-5 space-y-4">
                  {(dashboard?.recentUpdates ?? []).slice(0, 5).map((update) => (
                    <div
                      key={update.id}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                    >
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        {formatPortalDate(update.eventAt)}
                      </p>
                      <h3 className="mt-2 text-lg font-bold text-white">{update.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {update.description}
                      </p>
                    </div>
                  ))}
                  {(dashboard?.recentUpdates.length ?? 0) === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 px-4 py-4 text-sm text-slate-300">
                      As atualizacoes aparecerao aqui assim que a equipe alimentar o caso
                      ou o monitoramento externo estiver conectado.
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="surface-card p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                  canal de suporte
                </p>
                <h3 className="mt-4 text-2xl font-bold text-white">
                  Se precisar, volte para a equipe.
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  O portal concentra a consulta do caso. O WhatsApp continua como canal
                  de aviso e alinhamento rapido quando houver novidade importante.
                </p>
                <RouteLink
                  href={supportLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary mt-6 w-full justify-center"
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
