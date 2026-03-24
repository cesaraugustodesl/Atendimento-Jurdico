import { useEffect, useMemo, useState } from "react";
import { FileText, LogOut, ShieldCheck, UserRound } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import RouteLink from "../components/RouteLink";
import PortalStatusPill from "../components/portal/PortalStatusPill";
import { buildWhatsAppLink, pagePaths } from "../config/site";
import {
  buildCaseSupportMessage,
  getClientCasePath,
} from "../lib/clientPortal/integrations";
import { formatPortalDate } from "../lib/clientPortal/types";
import {
  hasStaffAccess,
  loadClientCaseDetail,
  loadClientDashboard,
  subscribeToCaseFeed,
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

type ClientTab = "case" | "profile" | "contract";

function PortalTabButton(props: { active: boolean; label: string; onClick: () => void }) {
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

function InfoTile(props: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/55 px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {props.label}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">{props.value}</p>
      {props.detail ? (
        <p className="mt-2 text-sm leading-6 text-slate-400">{props.detail}</p>
      ) : null}
    </div>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 px-4 py-5 text-sm leading-6 text-slate-400">
      {message}
    </div>
  );
}

export default function ClientPortal({ onNavigate }: ClientPortalProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [dashboard, setDashboard] = useState<Awaited<
    ReturnType<typeof loadClientDashboard>
  > | null>(null);
  const [detail, setDetail] = useState<Awaited<
    ReturnType<typeof loadClientCaseDetail>
  > | null>(null);
  const [hasOfficeAccess, setHasOfficeAccess] = useState(false);
  const [email, setEmail] = useState("");
  const [sendingLink, setSendingLink] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<ClientTab>("case");
  const [selectedCaseId, setSelectedCaseId] = useState("");

  useEffect(() => {
    let active = true;
    const hydrate = async () => {
      const currentSession = await getPortalSession();
      if (!active) return;
      setSession(currentSession);
      setSessionLoading(false);
    };
    void hydrate();
    const { data } = onPortalAuthStateChange((_event, nextSession) => {
      if (!active) return;
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
      setDetail(null);
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
        if (!active) return;
        setDashboard(clientDashboard);
        setHasOfficeAccess(officeAccess);
      } catch (loadError) {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Nao foi possivel carregar a area do cliente agora."
        );
      } finally {
        if (active) setDashboardLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [session]);

  useEffect(() => {
    const caseIds = (dashboard?.cases ?? []).map((item) => item.id);
    if (caseIds.length === 0) {
      setSelectedCaseId("");
      return;
    }
    if (!selectedCaseId || !caseIds.includes(selectedCaseId)) {
      setSelectedCaseId(caseIds[0]);
    }
  }, [dashboard?.cases, selectedCaseId]);

  useEffect(() => {
    if (!session || !selectedCaseId) {
      setDetail(null);
      return;
    }
    let active = true;
    const refresh = async () => {
      try {
        setDetailLoading(true);
        const nextDetail = await loadClientCaseDetail(selectedCaseId);
        if (!active) return;
        setDetail(nextDetail);
      } catch (loadError) {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Nao foi possivel carregar o caso selecionado."
        );
      } finally {
        if (active) setDetailLoading(false);
      }
    };
    void refresh();
    const unsubscribe = subscribeToCaseFeed(selectedCaseId, () => {
      void refresh();
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [session, selectedCaseId]);

  const handleMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setSendingLink(true);
      setNotice("");
      setError("");
      const { error: linkError } = await sendPortalMagicLink(
        email,
        pagePaths["client-area"]
      );
      if (linkError) throw linkError;
      setNotice(
        "Enviamos um link para o e-mail informado. Abra o link e volte para esta area."
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
    setDetail(null);
    setNotice("Sessao encerrada.");
  };

  const cases = dashboard?.cases ?? [];
  const selectedCase = cases.find((item) => item.id === selectedCaseId) ?? cases[0] ?? null;
  const supportLink = useMemo(
    () =>
      buildWhatsAppLink(
        selectedCase
          ? buildCaseSupportMessage(selectedCase)
          : "Ola, preciso de ajuda para acessar a area do cliente."
      ),
    [selectedCase]
  );

  const contractDocuments = useMemo(
    () =>
      (detail?.documents ?? []).filter((item) =>
        `${item.title} ${item.description} ${item.documentType}`
          .toLowerCase()
          .match(/contrat|procur|honorar|assin/)
      ),
    [detail?.documents]
  );

  const contractSignals = useMemo(
    () =>
      (detail?.notifications ?? []).filter((item) =>
        `${item.title} ${item.message}`.toLowerCase().match(/contrat|assin|procur|honorar/)
      ),
    [detail?.notifications]
  );

  if (sessionLoading) {
    return <div className="page-frame pt-16 md:pt-20"><section className="section-spacing"><div className="container-custom"><div className="surface-panel p-8 md:p-10"><p className="text-sm uppercase tracking-[0.18em] text-slate-400">preparando acesso</p><h1 className="mt-6 text-4xl font-bold text-white">Carregando a area do cliente.</h1></div></div></section></div>;
  }

  if (!session) {
    return <div className="page-frame pt-16 md:pt-20"><section className="section-spacing"><div className="container-custom max-w-5xl"><div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"><div className="surface-panel p-8 md:p-9"><p className="text-sm uppercase tracking-[0.18em] text-slate-400">area do cliente</p><h1 className="mt-4 text-3xl md:text-4xl font-semibold text-white">Acesso objetivo para cadastro, caso e contrato.</h1><div className="mt-6 grid gap-3 text-sm leading-7 text-slate-300"><p>1. consultar seus dados de cadastro</p><p>2. ver o caso inicial e os proximos passos</p><p>3. acompanhar contrato e documentos quando forem liberados</p></div></div><div className="surface-card p-8 md:p-9"><p className="text-sm uppercase tracking-[0.18em] text-slate-400">entrar ou ativar acesso</p><h2 className="mt-4 text-2xl font-semibold text-white">Receber link de acesso</h2><form className="mt-6 space-y-4" onSubmit={handleMagicLink}><label className="block"><span className="mb-2 block text-sm font-medium text-slate-200">E-mail</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50" placeholder="voce@exemplo.com" required /></label><button type="submit" className="btn-primary w-full justify-center" disabled={sendingLink}>{sendingLink ? "Enviando..." : "Enviar link de acesso"}</button></form>{notice ? <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{notice}</div> : null}{error ? <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div> : null}</div></div></div></section></div>;
  }

  return (
    <div className="page-frame pt-16 md:pt-20">
      <section className="section-spacing">
        <div className="container-custom space-y-6">
          <div className="surface-panel p-6 md:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  area do cliente
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-white">
                  Painel direto do cliente
                </h1>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Aqui ficam seu cadastro, o caso inicial aberto no portal e a parte
                  contratual quando a equipe liberar os documentos.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {hasOfficeAccess ? (
                  <RouteLink
                    href={pagePaths["office-panel"]}
                    onNavigate={onNavigate}
                    className="btn-secondary"
                  >
                    Painel do escritorio
                  </RouteLink>
                ) : null}
                <button type="button" className="btn-outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <PortalTabButton
                active={activeTab === "case"}
                label="Caso inicial"
                onClick={() => setActiveTab("case")}
              />
              <PortalTabButton
                active={activeTab === "profile"}
                label="Cadastro"
                onClick={() => setActiveTab("profile")}
              />
              <PortalTabButton
                active={activeTab === "contract"}
                label="Contrato"
                onClick={() => setActiveTab("contract")}
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          {!dashboard?.setup.tables.clientProfiles || !dashboard?.setup.tables.cases ? (
            <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
              A base do portal ainda nao esta completa neste ambiente. As tabelas principais
              precisam estar ativas para exibir cadastro e caso de forma consistente.
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-3">
            <InfoTile
              label="cliente"
              value={dashboard?.profile?.fullName || session.user.email || "Sem nome"}
              detail={dashboard?.profile?.status || "Cadastro ainda sem status"}
            />
            <InfoTile
              label="casos vinculados"
              value={String(cases.length)}
              detail={
                selectedCase
                  ? `Proximo prazo: ${formatPortalDate(selectedCase.nextDeadlineAt)}`
                  : "Nenhum caso vinculado ainda"
              }
            />
            <InfoTile
              label="e-mail de acesso"
              value={session.user.email || "Sem e-mail"}
              detail={dashboardLoading ? "Atualizando painel..." : "Magic link ativo para este acesso"}
            />
          </div>

          {activeTab === "profile" ? (
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="surface-card p-6">
                <div className="flex items-center gap-3">
                  <UserRound className="h-5 w-5 text-sky-300" />
                  <div>
                    <h2 className="text-xl font-semibold text-white">Cadastro do cliente</h2>
                    <p className="text-sm text-slate-400">
                      Dados usados para liberar portal, caso e comunicacoes.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <InfoTile
                    label="nome"
                    value={dashboard?.profile?.fullName || "Nao informado"}
                  />
                  <InfoTile
                    label="e-mail"
                    value={dashboard?.profile?.email || session.user.email || "Nao informado"}
                  />
                  <InfoTile
                    label="whatsapp"
                    value={dashboard?.profile?.whatsapp || "Nao informado"}
                  />
                  <InfoTile
                    label="status"
                    value={dashboard?.profile?.status || "Sem status"}
                  />
                </div>
              </div>

              <div className="surface-card p-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-sky-300" />
                  <div>
                    <h2 className="text-xl font-semibold text-white">Orientacao de uso</h2>
                    <p className="text-sm text-slate-400">
                      O portal serve para consulta objetiva e historico do atendimento.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4">
                    Use sempre o mesmo e-mail informado no atendimento.
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4">
                    Quando seus dados mudarem, alinhe com a equipe para refletir aqui no portal.
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4">
                    O WhatsApp continua como canal de aviso, mas o historico do caso fica neste painel.
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "case" ? (
            <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
              <div className="space-y-6">
                <div className="surface-card p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-white">Caso inicial</h2>
                      <p className="text-sm text-slate-400">
                        Resumo objetivo do caso que esta vinculado ao seu e-mail.
                      </p>
                    </div>
                    {cases.length > 1 ? (
                      <select
                        value={selectedCaseId}
                        onChange={(event) => setSelectedCaseId(event.target.value)}
                        className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-sky-400/50"
                      >
                        {cases.map((caseItem) => (
                          <option key={caseItem.id} value={caseItem.id}>
                            {caseItem.title}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </div>

                  {!selectedCase ? (
                    <div className="mt-5">
                      <EmptyPanel message="Nenhum caso foi vinculado ao seu e-mail ainda." />
                    </div>
                  ) : (
                    <>
                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <PortalStatusPill kind="status" value={selectedCase.status} />
                        <PortalStatusPill kind="priority" value={selectedCase.priority} />
                        {selectedCase.caseCode ? (
                          <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                            {selectedCase.caseCode}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <InfoTile
                          label="titulo"
                          value={selectedCase.title}
                          detail={selectedCase.area || "Area nao informada"}
                        />
                        <InfoTile
                          label="proximo prazo"
                          value={formatPortalDate(selectedCase.nextDeadlineAt)}
                          detail={selectedCase.assignedLawyer || "Responsavel ainda nao informado"}
                        />
                      </div>

                      <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          resumo do caso
                        </p>
                        <p className="mt-2 text-sm leading-7 text-slate-300">
                          {selectedCase.summary || "Resumo ainda nao preenchido."}
                        </p>
                      </div>

                      <RouteLink
                        href={getClientCasePath(selectedCase.id)}
                        onNavigate={onNavigate}
                        className="btn-secondary mt-5"
                      >
                        Abrir detalhamento completo
                      </RouteLink>
                    </>
                  )}
                </div>

                <div className="surface-card p-6">
                  <h2 className="text-xl font-semibold text-white">Linha do tempo recente</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Ultimas movimentacoes visiveis para voce.
                  </p>

                  <div className="mt-5 space-y-3">
                    {detailLoading ? (
                      <EmptyPanel message="Atualizando historico do caso..." />
                    ) : (detail?.updates ?? []).length === 0 ? (
                      <EmptyPanel message="Nenhuma atualizacao visivel foi registrada ainda." />
                    ) : (
                      (detail?.updates ?? []).slice(0, 5).map((update) => (
                        <div
                          key={update.id}
                          className="rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4"
                        >
                          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                            {formatPortalDate(update.eventAt)}
                          </p>
                          <p className="mt-2 text-sm font-semibold text-white">
                            {update.title}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {update.description}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="surface-card p-6">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-sky-300" />
                    <div>
                      <h2 className="text-xl font-semibold text-white">Documentos visiveis</h2>
                      <p className="text-sm text-slate-400">
                        Arquivos liberados pela equipe para este caso.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {(detail?.documents ?? []).length === 0 ? (
                      <EmptyPanel message="Nenhum documento foi liberado ainda." />
                    ) : (
                      (detail?.documents ?? []).slice(0, 5).map((document) => (
                        <div
                          key={document.id}
                          className="rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4"
                        >
                          <p className="text-sm font-semibold text-white">{document.title}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {document.description || "Documento registrado no portal."}
                          </p>
                          <p className="mt-2 text-xs text-slate-500">
                            {document.fileName || "Arquivo sem nome"} •{" "}
                            {formatPortalDate(document.uploadedAt)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="surface-card p-6">
                  <h2 className="text-xl font-semibold text-white">Suporte</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Se o caso precisar de alinhamento, fale com a equipe pelo canal oficial.
                  </p>
                  <RouteLink
                    href={supportLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary mt-5 w-full justify-center"
                  >
                    Falar com a equipe
                  </RouteLink>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "contract" ? (
            <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="surface-card p-6">
                <h2 className="text-xl font-semibold text-white">Contrato com a advogada</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Esta aba concentra contrato, procuracao e sinais de assinatura quando esses
                  documentos forem liberados no portal.
                </p>

                <div className="mt-5 space-y-3">
                  <InfoTile
                    label="cadastro liberado"
                    value={dashboard?.profile ? "Sim" : "Nao"}
                  />
                  <InfoTile
                    label="caso aberto"
                    value={selectedCase ? "Sim" : "Nao"}
                  />
                  <InfoTile
                    label="documento contratual"
                    value={contractDocuments.length > 0 ? "Disponivel" : "Pendente"}
                  />
                  <InfoTile
                    label="sinal de assinatura"
                    value={contractSignals.length > 0 ? "Registrado" : "Sem registro"}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="surface-card p-6">
                  <h2 className="text-xl font-semibold text-white">Documentos do contrato</h2>
                  <div className="mt-5 space-y-3">
                    {contractDocuments.length === 0 ? (
                      <EmptyPanel message="Ainda nao existe contrato anexado para este caso. Quando a equipe liberar o documento, ele aparecera aqui." />
                    ) : (
                      contractDocuments.map((document) => (
                        <div
                          key={document.id}
                          className="rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4"
                        >
                          <p className="text-sm font-semibold text-white">{document.title}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {document.description || "Documento contratual liberado."}
                          </p>
                          <p className="mt-2 text-xs text-slate-500">
                            {document.fileName || "Arquivo sem nome"} •{" "}
                            {formatPortalDate(document.uploadedAt)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="surface-card p-6">
                  <h2 className="text-xl font-semibold text-white">Orientacao</h2>
                  <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4">
                      Se o contrato ainda nao apareceu, aguarde a liberacao pela equipe.
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4">
                      A assinatura e a confirmacao contratual nao devem ficar soltas no WhatsApp.
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4">
                      Use o suporte para pedir reenvio ou confirmar o proximo passo documental.
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
