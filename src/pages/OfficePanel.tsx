import { useEffect, useMemo, useState } from "react";
import { BellRing, CalendarClock, ClipboardList, LogOut, PlusSquare } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import RouteLink from "../components/RouteLink";
import PortalStatusPill from "../components/portal/PortalStatusPill";
import { pagePaths } from "../config/site";
import { getClientCasePath } from "../lib/clientPortal/integrations";
import {
  caseStatusLabels,
  formatPortalDate,
  type CasePriority,
  type CaseStatus,
  type NotificationStatus,
  type PortalCaseSummary,
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

type OfficeView = "today" | "cases" | "new-case";

interface OfficeQueueItem {
  caseItem: Awaited<ReturnType<typeof loadOfficePortalSnapshot>>["cases"][number];
  reason: string;
  deadlineText: string;
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

const attentionStatuses: CaseStatus[] = [
  "analise-inicial",
  "documentos-pendentes",
  "audiencia-designada",
];

const pendingNotificationStatuses = new Set<NotificationStatus>([
  "pending",
  "queued",
  "failed",
]);

function parsePortalDate(value: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function sortCasesByDeadline(a: PortalCaseSummary, b: PortalCaseSummary) {
  const dateA = parsePortalDate(a.nextDeadlineAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
  const dateB = parsePortalDate(b.nextDeadlineAt)?.getTime() ?? Number.MAX_SAFE_INTEGER;
  return dateA - dateB;
}

function CompactMetric(props: { label: string; value: string; description: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/55 px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {props.label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{props.value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{props.description}</p>
    </div>
  );
}

function PanelTabButton(props: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
        props.active
          ? "border border-sky-400/30 bg-sky-500/10 text-sky-100"
          : "border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white"
      }`}
    >
      {props.label}
    </button>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 px-4 py-5 text-sm leading-6 text-slate-400">
      {message}
    </div>
  );
}

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
  const [activeView, setActiveView] = useState<OfficeView>("today");

  useEffect(() => {
    let active = true;
    const boot = async () => {
      const currentSession = await getPortalSession();
      if (!active) return;
      setSession(currentSession);
      setLoading(false);
    };
    void boot();
    const { data } = onPortalAuthStateChange((_event, nextSession) => {
      if (!active) return;
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
        if (!active) return;
        setSnapshot(nextSnapshot);
      } catch (loadError) {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Nao foi possivel carregar o painel interno."
        );
      } finally {
        if (active) setLoading(false);
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
      const { error: linkError } = await sendPortalMagicLink(
        email,
        pagePaths["office-panel"]
      );
      if (linkError) throw linkError;
      setNotice("Link enviado. Use um e-mail cadastrado em staff_profiles para entrar.");
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
      await createManualCaseDraft(form);
      setNotice("Caso criado com sucesso.");
      setForm({ ...defaultForm });
      setActiveView("cases");
      setSnapshot(await loadOfficePortalSnapshot());
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

  const cases = useMemo(() => snapshot?.cases ?? [], [snapshot?.cases]);
  const recentLeads = useMemo(() => snapshot?.recentLeads ?? [], [snapshot?.recentLeads]);
  const notifications = useMemo(
    () => snapshot?.notifications ?? [],
    [snapshot?.notifications]
  );

  const todaySummary = useMemo(() => {
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date();
    dayEnd.setHours(23, 59, 59, 999);
    const caseMap = new Map(cases.map((item) => [item.id, item]));
    const dueToday = cases
      .filter((item) => {
        const deadline = parsePortalDate(item.nextDeadlineAt);
        return Boolean(deadline && deadline >= dayStart && deadline <= dayEnd);
      })
      .sort(sortCasesByDeadline);
    const overdue = cases
      .filter((item) => {
        const deadline = parsePortalDate(item.nextDeadlineAt);
        return Boolean(deadline && deadline < dayStart);
      })
      .sort(sortCasesByDeadline);
    const responseCases = cases
      .filter(
        (item) =>
          attentionStatuses.includes(item.status) ||
          item.priority === "alta" ||
          item.lastEventSummary.toLowerCase().includes("pend")
      )
      .sort(sortCasesByDeadline);
    const responseNotifications = notifications
      .filter((item) => pendingNotificationStatuses.has(item.status))
      .map((item) => ({
        ...item,
        caseTitle: caseMap.get(item.caseId)?.title || "Caso sem titulo",
      }));
    const seen = new Set<string>();
    const queue: OfficeQueueItem[] = [];
    overdue.forEach((caseItem) => {
      if (seen.has(caseItem.id)) return;
      seen.add(caseItem.id);
      queue.push({ caseItem, reason: "Prazo vencido", deadlineText: formatPortalDate(caseItem.nextDeadlineAt) });
    });
    dueToday.forEach((caseItem) => {
      if (seen.has(caseItem.id)) return;
      seen.add(caseItem.id);
      queue.push({ caseItem, reason: "Prazo do dia", deadlineText: formatPortalDate(caseItem.nextDeadlineAt) });
    });
    return { dueToday, overdue, responseCases, responseNotifications, queue };
  }, [cases, notifications]);

  if (loading && !session) {
    return <div className="page-frame pt-16 md:pt-20"><section className="section-spacing"><div className="container-custom"><div className="surface-panel p-8"><p className="text-sm uppercase tracking-[0.18em] text-slate-400">carregando painel</p><h1 className="mt-4 text-3xl font-semibold text-white">Preparando acesso da equipe.</h1></div></div></section></div>;
  }

  if (!session) {
    return <div className="page-frame pt-16 md:pt-20"><section className="section-spacing"><div className="container-custom max-w-5xl"><div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><div className="surface-panel p-8 md:p-9"><p className="text-sm uppercase tracking-[0.18em] text-slate-400">painel do escritorio</p><h1 className="mt-4 text-3xl md:text-4xl font-semibold text-white">Painel operacional para prazos, fila de resposta e abertura de casos.</h1><div className="mt-6 grid gap-3 text-sm leading-7 text-slate-300"><p>1. acompanhar prazos do dia e pendencias</p><p>2. abrir caso a partir do lead ou do atendimento</p><p>3. manter o historico do cliente organizado no portal</p></div></div><div className="surface-card p-8 md:p-9"><p className="text-sm uppercase tracking-[0.18em] text-slate-400">acesso da equipe</p><h2 className="mt-4 text-2xl font-semibold text-white">Entrar com magic link</h2><form className="mt-6 space-y-4" onSubmit={handleMagicLink}><label className="block"><span className="mb-2 block text-sm font-medium text-slate-200">E-mail</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50" placeholder="advogada@exemplo.com" required /></label><button type="submit" className="btn-primary w-full justify-center" disabled={sendingLink}>{sendingLink ? "Enviando..." : "Enviar link de acesso"}</button></form>{notice ? <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{notice}</div> : null}{error ? <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}</div></div></div></section></div>;
  }

  return (
    <div className="page-frame pt-16 md:pt-20">
      <section className="section-spacing">
        <div className="container-custom space-y-6">
          <div className="surface-panel p-6 md:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  operacao do escritorio
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-white">
                  Controle diario de casos
                </h1>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {snapshot?.staffProfile?.fullName || session.user.email} conectado. Use
                  este painel para decidir o que vence hoje, o que precisa de resposta e
                  quais casos ainda nao foram organizados.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <RouteLink
                  href={pagePaths["client-area"]}
                  onNavigate={onNavigate}
                  className="btn-secondary"
                >
                  Ver area do cliente
                </RouteLink>
                <button type="button" className="btn-outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <PanelTabButton
                active={activeView === "today"}
                label="Hoje"
                onClick={() => setActiveView("today")}
              />
              <PanelTabButton
                active={activeView === "cases"}
                label="Casos"
                onClick={() => setActiveView("cases")}
              />
              <PanelTabButton
                active={activeView === "new-case"}
                label="Novo caso"
                onClick={() => setActiveView("new-case")}
              />
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

          {!snapshot?.staffProfile ? (
            <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
              Seu usuario ainda nao esta cadastrado em <code>staff_profiles</code>.
              O painel so fica operacional depois desse cadastro.
            </div>
          ) : null}

          {loading ? (
            <div className="surface-card p-5 text-sm text-slate-300">Atualizando dados...</div>
          ) : null}

          {activeView === "today" ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <CompactMetric
                  label="casos ativos"
                  value={String(cases.filter((item) => item.status !== "concluido").length)}
                  description="Casos em aberto no portal."
                />
                <CompactMetric
                  label="prazos do dia"
                  value={String(todaySummary.dueToday.length)}
                  description="Itens com prazo registrado para hoje."
                />
                <CompactMetric
                  label="atrasados"
                  value={String(todaySummary.overdue.length)}
                  description="Casos com data vencida e sem baixa."
                />
                <CompactMetric
                  label="fila de resposta"
                  value={String(
                    todaySummary.responseCases.length +
                      todaySummary.responseNotifications.length
                  )}
                  description="Casos e avisos que pedem acao da equipe."
                />
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="surface-card p-6">
                  <div className="flex items-center gap-3">
                    <CalendarClock className="h-5 w-5 text-sky-300" />
                    <div>
                      <h2 className="text-xl font-semibold text-white">Prazos do dia</h2>
                      <p className="text-sm text-slate-400">
                        O que precisa ser visto hoje ou ja esta vencido.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {todaySummary.queue.length === 0 ? (
                      <EmptyPanel message="Nenhum prazo registrado para hoje." />
                    ) : (
                      todaySummary.queue.map(({ caseItem, reason, deadlineText }) => (
                        <div
                          key={`${caseItem.id}-${reason}`}
                          className="rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {caseItem.title}
                              </p>
                              <p className="mt-1 text-sm text-slate-400">
                                {caseItem.clientName || "Cliente sem nome"} • {reason}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <PortalStatusPill kind="status" value={caseItem.status} />
                              <PortalStatusPill kind="priority" value={caseItem.priority} />
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
                            <span>{deadlineText}</span>
                            <RouteLink
                              href={getClientCasePath(caseItem.id)}
                              onNavigate={onNavigate}
                              className="text-sky-300 hover:text-sky-200"
                            >
                              Abrir timeline
                            </RouteLink>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="surface-card p-6">
                    <div className="flex items-center gap-3">
                      <ClipboardList className="h-5 w-5 text-sky-300" />
                      <div>
                        <h2 className="text-xl font-semibold text-white">Responder hoje</h2>
                        <p className="text-sm text-slate-400">
                          Casos com pendencia operacional ou de cliente.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {todaySummary.responseCases.length === 0 ? (
                        <EmptyPanel message="Nenhum caso com status de resposta imediata." />
                      ) : (
                        todaySummary.responseCases.slice(0, 6).map((caseItem) => (
                          <div
                            key={caseItem.id}
                            className="rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-white">
                                {caseItem.title}
                              </p>
                              <PortalStatusPill kind="status" value={caseItem.status} />
                            </div>
                            <p className="mt-2 text-sm leading-6 text-slate-400">
                              {caseStatusLabels[caseItem.status]} •{" "}
                              {caseItem.lastEventSummary || "Sem resumo atualizado."}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="surface-card p-6">
                    <div className="flex items-center gap-3">
                      <BellRing className="h-5 w-5 text-sky-300" />
                      <div>
                        <h2 className="text-xl font-semibold text-white">Avisos pendentes</h2>
                        <p className="text-sm text-slate-400">
                          Notificacoes que pedem envio, reenvio ou confirmacao.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {todaySummary.responseNotifications.length === 0 ? (
                        <EmptyPanel message="Nenhuma notificacao pendente na fila." />
                      ) : (
                        todaySummary.responseNotifications.slice(0, 6).map((notification) => (
                          <div
                            key={notification.id}
                            className="rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-semibold text-white">
                                {notification.title}
                              </p>
                              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                {notification.status}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-slate-400">
                              {notification.caseTitle}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatPortalDate(notification.createdAt)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {activeView === "cases" ? (
            <div className="surface-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">Casos cadastrados</h2>
                  <p className="text-sm text-slate-400">
                    Lista operacional para filtrar status, cliente e proximo prazo.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setActiveView("new-case")}
                >
                  <PlusSquare className="h-4 w-4" />
                  Novo caso
                </button>
              </div>

              <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
                <div className="grid grid-cols-[1.3fr_0.95fr_0.8fr_0.7fr] gap-4 border-b border-white/10 bg-white/5 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <span>Caso</span>
                  <span>Cliente</span>
                  <span>Status</span>
                  <span>Prazo</span>
                </div>

                {cases.length === 0 ? (
                  <div className="px-4 py-5">
                    <EmptyPanel message="Nenhum caso cadastrado ainda." />
                  </div>
                ) : (
                  [...cases].sort(sortCasesByDeadline).map((caseItem) => (
                    <div
                      key={caseItem.id}
                      className="grid grid-cols-[1.3fr_0.95fr_0.8fr_0.7fr] gap-4 border-b border-white/10 px-4 py-4 text-sm last:border-b-0"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-white">{caseItem.title}</p>
                          {caseItem.caseCode ? (
                            <span className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                              {caseItem.caseCode}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 line-clamp-2 text-slate-400">
                          {caseItem.lastEventSummary || caseItem.summary}
                        </p>
                        <RouteLink
                          href={getClientCasePath(caseItem.id)}
                          onNavigate={onNavigate}
                          className="mt-2 inline-flex text-xs font-semibold uppercase tracking-[0.16em] text-sky-300 hover:text-sky-200"
                        >
                          Abrir timeline
                        </RouteLink>
                      </div>

                      <div>
                        <p className="font-medium text-white">
                          {caseItem.clientName || "Sem nome"}
                        </p>
                        <p className="mt-1 text-slate-400">
                          {caseItem.clientEmail || "Sem e-mail"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <PortalStatusPill kind="status" value={caseItem.status} />
                        <PortalStatusPill kind="priority" value={caseItem.priority} />
                      </div>

                      <div className="text-slate-300">
                        <p>{formatPortalDate(caseItem.nextDeadlineAt)}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {caseItem.assignedLawyer || "Sem responsavel"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}

          {activeView === "new-case" ? (
            <div className="grid gap-6 xl:grid-cols-[1fr_0.72fr]">
              <div className="surface-card p-6">
                <div className="flex items-center gap-3">
                  <PlusSquare className="h-5 w-5 text-sky-300" />
                  <div>
                    <h2 className="text-xl font-semibold text-white">Abrir novo caso</h2>
                    <p className="text-sm text-slate-400">
                      Cadastro direto para o portal e para a fila interna.
                    </p>
                  </div>
                </div>

                <form className="mt-6 grid gap-4" onSubmit={handleCreateCase}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-200">
                        Nome do cliente
                      </span>
                      <input type="text" value={form.clientName} onChange={(event) => setForm((current) => ({ ...current, clientName: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50" required />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-200">
                        E-mail
                      </span>
                      <input type="email" value={form.clientEmail} onChange={(event) => setForm((current) => ({ ...current, clientEmail: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50" required />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-200">
                        WhatsApp
                      </span>
                      <input type="text" value={form.clientWhatsapp} onChange={(event) => setForm((current) => ({ ...current, clientWhatsapp: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-200">
                        Area
                      </span>
                      <input type="text" value={form.area} onChange={(event) => setForm((current) => ({ ...current, area: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50" required />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-200">
                      Titulo do caso
                    </span>
                    <input type="text" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50" required />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-200">
                      Resumo inicial
                    </span>
                    <textarea value={form.summary} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} rows={5} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50" required />
                  </label>

                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-200">
                        Status
                      </span>
                      <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as CaseStatus }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50">
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
                      <select value={form.priority} onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value as CasePriority }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50">
                        <option value="baixa">Baixa</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-200">
                        CNJ
                      </span>
                      <input type="text" value={form.cnjNumber} onChange={(event) => setForm((current) => ({ ...current, cnjNumber: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50" />
                    </label>
                  </div>

                  <button type="submit" className="btn-primary mt-2 justify-center" disabled={submittingCase || !snapshot?.staffProfile}>
                    {submittingCase ? "Criando caso..." : "Salvar caso"}
                  </button>
                </form>
              </div>

              <div className="space-y-6">
                <div className="surface-card p-6">
                  <h2 className="text-xl font-semibold text-white">Leads recentes</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Use esta fila para priorizar quem precisa virar caso.
                  </p>
                  <div className="mt-5 space-y-3">
                    {recentLeads.length === 0 ? (
                      <EmptyPanel message="Nenhum lead recente apareceu neste ambiente." />
                    ) : (
                      recentLeads.slice(0, 6).map((lead) => (
                        <div key={lead.id} className="rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-white">
                              {lead.name || "Lead sem nome"}
                            </p>
                            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                              {lead.priority || "sem prioridade"}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-slate-400">{lead.email}</p>
                          <p className="mt-2 text-xs text-slate-500">
                            {lead.simulatorSlug} • score {lead.score} •{" "}
                            {formatPortalDate(lead.createdAt)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="surface-card p-6">
                  <h2 className="text-xl font-semibold text-white">Checklist operacional</h2>
                  <div className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4">
                      Confirmar e-mail do cliente antes de abrir o portal.
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4">
                      Registrar prazo e ultima movimentacao para o painel do dia funcionar.
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4">
                      Usar o WhatsApp para aviso, mas manter o historico no portal.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
