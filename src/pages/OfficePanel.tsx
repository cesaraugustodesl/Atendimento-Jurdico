import { useEffect, useMemo, useState } from "react";
import {
  BellRing,
  Briefcase,
  FolderOpenDot,
  LogOut,
  MessageSquareMore,
  Radio,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import RouteLink from "../components/RouteLink";
import PortalMetricCard from "../components/portal/PortalMetricCard";
import PortalStatusPill from "../components/portal/PortalStatusPill";
import { pagePaths } from "../config/site";
import {
  getClientCasePath,
  getIntegrationReadiness,
} from "../lib/clientPortal/integrations";
import {
  formatPortalDate,
  type CasePriority,
  type CaseStatus,
} from "../lib/clientPortal/types";
import {
  createManualCaseDraft,
  loadOfficePortalSnapshot,
} from "../services/clientPortalService";
import {
  getPortalSession,
  onPortalAuthStateChange,
  sendPortalMagicLink,
  signOutPortal,
} from "../services/portalAuthService";

interface OfficePanelProps {
  onNavigate: (href: string) => void;
}

interface OfficeCaseForm {
  clientName: string;
  clientEmail: string;
  clientWhatsapp: string;
  title: string;
  area: string;
  summary: string;
  status: CaseStatus;
  priority: CasePriority;
  cnjNumber: string;
}

const defaultForm: OfficeCaseForm = {
  clientName: "",
  clientEmail: "",
  clientWhatsapp: "",
  title: "",
  area: "Trabalhista",
  summary: "",
  status: "triagem",
  priority: "media",
  cnjNumber: "",
};

export default function OfficePanel({ onNavigate }: OfficePanelProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState<Awaited<
    ReturnType<typeof loadOfficePortalSnapshot>
  > | null>(null);
  const [email, setEmail] = useState("");
  const [sendingLink, setSendingLink] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submittingCase, setSubmittingCase] = useState(false);
  const [form, setForm] = useState<OfficeCaseForm>({ ...defaultForm });

  const integrations = useMemo(() => getIntegrationReadiness(), []);

  useEffect(() => {
    let active = true;

    const boot = async () => {
      const currentSession = await getPortalSession();
      if (!active) {
        return;
      }
      setSession(currentSession);
      setLoading(false);
    };

    void boot();

    const { data } = onPortalAuthStateChange((_event, nextSession) => {
      if (!active) {
        return;
      }
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setSnapshot(null);
      return;
    }

    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const nextSnapshot = await loadOfficePortalSnapshot();
        if (!active) {
          return;
        }
        setSnapshot(nextSnapshot);
      } catch (loadError) {
        if (!active) {
          return;
        }
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Nao foi possivel carregar o painel interno."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [session]);

  const handleMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSendingLink(true);
      setError("");
      setNotice("");

      const { error: linkError } = await sendPortalMagicLink(email);
      if (linkError) {
        throw linkError;
      }

      setNotice(
        "Link enviado. Use um e-mail que ja esteja cadastrado em staff_profiles para acessar o painel."
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

  const handleCreateCase = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSubmittingCase(true);
      setError("");
      setNotice("");

      const createdCaseId = await createManualCaseDraft({
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        clientWhatsapp: form.clientWhatsapp,
        title: form.title,
        area: form.area,
        summary: form.summary,
        status: form.status,
        priority: form.priority,
        cnjNumber: form.cnjNumber,
      });

      setNotice("Caso criado com sucesso no portal.");
      setForm({ ...defaultForm });

      const refreshed = await loadOfficePortalSnapshot();
      setSnapshot(refreshed);
      onNavigate(getClientCasePath(createdCaseId));
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Nao foi possivel criar o caso agora."
      );
    } finally {
      setSubmittingCase(false);
    }
  };

  const handleSignOut = async () => {
    await signOutPortal();
    setSnapshot(null);
    setNotice("Sessao encerrada.");
  };

  if (!session) {
    return (
      <div className="page-frame pt-16 md:pt-20">
        <section className="section-spacing">
          <div className="container-custom grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="surface-panel p-8 md:p-10">
              <span className="eyebrow">painel do escritorio</span>
              <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white">
                Operacao interna para transformar lead em acompanhamento real.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
                Este painel organiza a passagem da captacao para o portal do cliente:
                cria casos, centraliza notificacoes e prepara a camada de monitoramento
                via Jusbrasil e WhatsApp.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <PortalMetricCard
                  label="cases"
                  value="1"
                  description="Crie o caso a partir do lead e deixe o portal pronto para atualizacoes."
                  icon={<Briefcase className="h-5 w-5" />}
                />
                <PortalMetricCard
                  label="notificacoes"
                  value="2"
                  description="Registre avisos de portal, e-mail e WhatsApp no mesmo historico."
                  icon={<BellRing className="h-5 w-5" />}
                />
                <PortalMetricCard
                  label="monitoramento"
                  value="3"
                  description="Vincule CNJ e prepare webhooks para alimentar a timeline do cliente."
                  icon={<Radio className="h-5 w-5" />}
                />
              </div>
            </div>

            <div className="surface-card p-8 md:p-10">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                acesso da equipe
              </p>
              <h2 className="mt-5 text-3xl font-bold text-white">
                Entre com o e-mail cadastrado em staff_profiles.
              </h2>
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
                    placeholder="advogada@exemplo.com"
                    required
                  />
                </label>
                <button
                  type="submit"
                  className="btn-primary w-full justify-center"
                  disabled={sendingLink}
                >
                  {sendingLink ? "Enviando..." : "Enviar link de acesso"}
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
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-frame pt-16 md:pt-20">
      <section className="section-spacing">
        <div className="container-custom space-y-8">
          <div className="surface-panel p-8 md:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <span className="eyebrow">operacao interna</span>
                <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white">
                  Painel do escritorio para acompanhar o ciclo completo.
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
                  A equipe usa este painel para abrir casos, registrar novidades e preparar a
                  camada de notificacao que depois aparece para o cliente no portal.
                </p>
              </div>
              <button type="button" className="btn-outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>

          {error ? (
            <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          {notice ? (
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-100">
              {notice}
            </div>
          ) : null}

          {loading ? (
            <div className="surface-card p-6 text-sm text-slate-300">Carregando painel...</div>
          ) : null}

          {!snapshot?.staffProfile ? (
            <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
              Seu usuario ainda nao esta cadastrado em <code>staff_profiles</code>. A base do painel foi criada, mas o acesso interno depende desse cadastro e das migrations aplicadas.
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <PortalMetricCard
              label="casos"
              value={String(snapshot?.cases.length ?? 0)}
              description="Casos cadastrados no portal para acompanhamento do cliente."
              icon={<Briefcase className="h-5 w-5" />}
            />
            <PortalMetricCard
              label="leads recentes"
              value={String(snapshot?.recentLeads.length ?? 0)}
              description="Entradas mais recentes dos simuladores juridicos."
              icon={<FolderOpenDot className="h-5 w-5" />}
            />
            <PortalMetricCard
              label="notificacoes"
              value={String(snapshot?.notifications.length ?? 0)}
              description="Fila recente de avisos que podem virar portal, e-mail ou WhatsApp."
              icon={<BellRing className="h-5 w-5" />}
            />
            <PortalMetricCard
              label="integracoes"
              value={`${integrations.filter((item) => item.enabled).length}/${integrations.length}`}
              description="Camadas preparadas para evoluir o acompanhamento automatico."
              icon={<MessageSquareMore className="h-5 w-5" />}
            />
          </div>

          <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
            <div className="surface-card p-6 md:p-7">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                abrir caso manualmente
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white">
                Crie o caso e ligue o cliente ao portal.
              </h2>
              <form className="mt-6 grid gap-4" onSubmit={handleCreateCase}>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-200">
                      Nome do cliente
                    </span>
                    <input
                      type="text"
                      value={form.clientName}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          clientName: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-200">
                      E-mail
                    </span>
                    <input
                      type="email"
                      value={form.clientEmail}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          clientEmail: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50"
                      required
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-200">
                      WhatsApp
                    </span>
                    <input
                      type="text"
                      value={form.clientWhatsapp}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          clientWhatsapp: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-200">
                      Area
                    </span>
                    <input
                      type="text"
                      value={form.area}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, area: event.target.value }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50"
                      required
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    Titulo do caso
                  </span>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, title: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    Resumo do caso
                  </span>
                  <textarea
                    value={form.summary}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, summary: event.target.value }))
                    }
                    rows={5}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50"
                    required
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-3">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-200">
                      Status
                    </span>
                    <select
                      value={form.status}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          status: event.target.value as CaseStatus,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50"
                    >
                      <option value="triagem">Triagem</option>
                      <option value="analise-inicial">Analise inicial</option>
                      <option value="documentos-pendentes">Documentos pendentes</option>
                      <option value="em-andamento">Em andamento</option>
                      <option value="aguardando-terceiros">Aguardando terceiros</option>
                      <option value="audiencia-designada">Audiencia designada</option>
                      <option value="concluido">Concluido</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-200">
                      Prioridade
                    </span>
                    <select
                      value={form.priority}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          priority: event.target.value as CasePriority,
                        }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50"
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-200">
                      CNJ
                    </span>
                    <input
                      type="text"
                      value={form.cnjNumber}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, cnjNumber: event.target.value }))
                      }
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn-primary mt-2 justify-center"
                  disabled={submittingCase || !snapshot?.staffProfile}
                >
                  {submittingCase ? "Criando caso..." : "Criar caso no portal"}
                </button>
              </form>
            </div>

            <div className="space-y-5">
              <div className="surface-card p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                  prontidao da operacao
                </p>
                <div className="mt-5 space-y-4">
                  {integrations.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-lg font-bold text-white">{item.label}</h3>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                            item.enabled
                              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                              : "border-amber-400/20 bg-amber-500/10 text-amber-200"
                          }`}
                        >
                          {item.enabled ? "ativo" : "preparado"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {item.description}
                      </p>
                      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">
                        proximo passo
                      </p>
                      <p className="mt-1 text-sm text-slate-200">{item.nextStep}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-card p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                  leads recentes
                </p>
                <div className="mt-5 space-y-4">
                  {(snapshot?.recentLeads ?? []).length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 px-4 py-4 text-sm text-slate-300">
                      Os leads dos simuladores aparecerao aqui quando a tabela <code>simulator_leads</code> estiver ativa em producao.
                    </div>
                  ) : (
                    snapshot?.recentLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm font-semibold text-white">
                            {lead.name || "Lead sem nome"}
                          </p>
                          <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
                            {lead.simulatorSlug}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-300">{lead.email}</p>
                        <p className="mt-2 text-xs text-slate-500">
                          Score {lead.score} - {lead.priority} -{" "}
                          {formatPortalDate(lead.createdAt)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-3xl font-bold text-white">Fila de casos</h2>
                <RouteLink
                  href={pagePaths["client-area"]}
                  onNavigate={onNavigate}
                  className="btn-secondary"
                >
                  Ver portal do cliente
                </RouteLink>
              </div>
              {(snapshot?.cases ?? []).length === 0 ? (
                <div className="surface-card p-6 text-sm text-slate-300">
                  Nenhum caso foi cadastrado ainda.
                </div>
              ) : (
                snapshot?.cases.map((caseItem) => (
                  <RouteLink
                    key={caseItem.id}
                    href={getClientCasePath(caseItem.id)}
                    onNavigate={onNavigate}
                    className="surface-card block p-6 transition-transform hover:-translate-y-1"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <PortalStatusPill kind="status" value={caseItem.status} />
                      <PortalStatusPill kind="priority" value={caseItem.priority} />
                    </div>
                    <h3 className="mt-5 text-2xl font-bold text-white">{caseItem.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{caseItem.summary}</p>
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                        <span className="block text-xs uppercase tracking-[0.16em] text-slate-500">
                          Cliente
                        </span>
                        <span className="mt-2 block text-white">
                          {caseItem.clientName || "Sem nome"}
                        </span>
                        <span className="mt-1 block text-slate-400">
                          {caseItem.clientEmail || "Sem e-mail"}
                        </span>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                        <span className="block text-xs uppercase tracking-[0.16em] text-slate-500">
                          Ultima movimentacao
                        </span>
                        <span className="mt-2 block text-white">
                          {caseItem.lastEventSummary || "Sem resumo no momento"}
                        </span>
                      </div>
                    </div>
                  </RouteLink>
                ))
              )}
            </div>

            <div className="surface-card p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                notificacoes recentes
              </p>
              <div className="mt-5 space-y-4">
                {(snapshot?.notifications ?? []).length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 px-4 py-4 text-sm text-slate-300">
                    A fila de notificacoes ainda esta vazia.
                  </div>
                ) : (
                  snapshot?.notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold text-white">
                          {notification.title}
                        </p>
                        <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
                          {notification.channel}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {notification.message}
                      </p>
                      <p className="mt-3 text-xs text-slate-500">
                        {formatPortalDate(notification.createdAt)} - {notification.status}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
