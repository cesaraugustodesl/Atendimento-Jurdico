import { useEffect, useMemo, useState } from "react";
import { BellRing, FileText, FolderOpenDot, Radio, RefreshCcw } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import RouteLink from "../components/RouteLink";
import CaseTimeline from "../components/portal/CaseTimeline";
import PortalMetricCard from "../components/portal/PortalMetricCard";
import PortalStatusPill from "../components/portal/PortalStatusPill";
import { buildWhatsAppLink, pagePaths } from "../config/site";
import { buildCaseSupportMessage } from "../lib/clientPortal/integrations";
import {
  formatPortalDate,
  notificationChannelLabels,
} from "../lib/clientPortal/types";
import {
  loadClientCaseDetail,
  subscribeToCaseFeed,
} from "../services/clientPortalService";
import {
  getPortalSession,
  onPortalAuthStateChange,
} from "../services/portalAuthService";

interface ClientCaseDetailProps {
  caseId: string;
  onNavigate: (href: string) => void;
}

export default function ClientCaseDetail({
  caseId,
  onNavigate,
}: ClientCaseDetailProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState<Awaited<
    ReturnType<typeof loadClientCaseDetail>
  > | null>(null);

  useEffect(() => {
    let active = true;

    const boot = async () => {
      const currentSession = await getPortalSession();
      if (!active) {
        return;
      }

      setSession(currentSession);
    };

    void boot();

    const { data } = onPortalAuthStateChange((_event, nextSession) => {
      if (!active) {
        return;
      }

      setSession(nextSession);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      setDetail(null);
      return;
    }

    let active = true;

    const refresh = async () => {
      try {
        setLoading(true);
        setError("");

        const nextDetail = await loadClientCaseDetail(caseId);
        if (!active) {
          return;
        }

        setDetail(nextDetail);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Nao foi possivel carregar o caso agora."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void refresh();

    const unsubscribe = subscribeToCaseFeed(caseId, () => {
      void refresh();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [caseId, session]);

  const supportLink = useMemo(() => {
    if (!detail?.caseItem) {
      return buildWhatsAppLink(
        "Ola, preciso de ajuda para acompanhar meu caso no portal."
      );
    }

    return buildWhatsAppLink(buildCaseSupportMessage(detail.caseItem));
  }, [detail?.caseItem]);

  if (!session) {
    return (
      <div className="page-frame pt-16 md:pt-20">
        <section className="section-spacing">
          <div className="container-custom">
            <div className="surface-panel p-8 md:p-10">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                acesso necessario
              </p>
              <h1 className="mt-6 text-4xl font-bold text-white">
                Entre primeiro na area do cliente.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                Para ver o detalhamento do caso, use o link magico enviado para o e-mail do atendimento.
              </p>
              <RouteLink
                href={pagePaths["client-area"]}
                onNavigate={onNavigate}
                className="btn-primary mt-8"
              >
                Ir para a area do cliente
              </RouteLink>
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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <RouteLink
              href={pagePaths["client-area"]}
              onNavigate={onNavigate}
              className="btn-secondary"
            >
              Voltar ao painel
            </RouteLink>
            <button
              type="button"
              className="btn-outline"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw className="h-4 w-4" />
              Atualizar agora
            </button>
          </div>

          {loading ? (
            <div className="surface-panel p-8 md:p-10">
              <h1 className="text-4xl font-bold text-white">Carregando caso...</h1>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          {!loading && detail?.caseItem ? (
            <>
              <div className="surface-panel p-8 md:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <PortalStatusPill kind="status" value={detail.caseItem.status} />
                  <PortalStatusPill kind="priority" value={detail.caseItem.priority} />
                  {detail.caseItem.caseCode ? (
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {detail.caseItem.caseCode}
                    </span>
                  ) : null}
                </div>
                <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white">
                  {detail.caseItem.title}
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
                  {detail.caseItem.summary}
                </p>
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <PortalMetricCard
                    label="ultima movimentacao"
                    value={formatPortalDate(detail.caseItem.lastEventAt)}
                    description={detail.caseItem.lastEventSummary || "Ainda sem resumo no portal."}
                    icon={<BellRing className="h-5 w-5" />}
                  />
                  <PortalMetricCard
                    label="proximo prazo"
                    value={formatPortalDate(detail.caseItem.nextDeadlineAt)}
                    description="Data de referencia mais proxima registrada pela equipe."
                    icon={<Radio className="h-5 w-5" />}
                  />
                  <PortalMetricCard
                    label="documentos"
                    value={String(detail.documents.length)}
                    description="Arquivos disponiveis para consulta nesta etapa."
                    icon={<FileText className="h-5 w-5" />}
                  />
                  <PortalMetricCard
                    label="notificacoes"
                    value={String(detail.notifications.length)}
                    description="Historico de avisos por portal, e-mail ou WhatsApp."
                    icon={<FolderOpenDot className="h-5 w-5" />}
                  />
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Area</p>
                    <p className="mt-2 text-sm text-white">
                      {detail.caseItem.area || "Nao informada"}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      CNJ / monitoramento
                    </p>
                    <p className="mt-2 text-sm text-white">
                      {detail.caseItem.cnjNumber ||
                        detail.caseItem.monitorReference ||
                        "Ainda nao vinculado"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
                <div className="space-y-5">
                  <div>
                    <h2 className="text-3xl font-bold text-white">Linha do tempo</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      As novidades do caso aparecem aqui. Quando a integracao externa estiver ativa,
                      os eventos automaticos entram nesta mesma timeline.
                    </p>
                  </div>
                  <CaseTimeline
                    updates={detail.updates}
                    emptyMessage="A timeline ainda nao recebeu atualizacoes visiveis para o cliente."
                  />
                </div>

                <div className="space-y-5">
                  <div className="surface-card p-6">
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                      documentos
                    </p>
                    <div className="mt-5 space-y-4">
                      {detail.documents.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-white/10 px-4 py-4 text-sm text-slate-300">
                          Nenhum documento visivel foi anexado ainda.
                        </div>
                      ) : (
                        detail.documents.map((document) => (
                          <div
                            key={document.id}
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                          >
                            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                              {document.documentType || "documento"}
                            </p>
                            <h3 className="mt-2 text-lg font-bold text-white">
                              {document.title}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                              {document.description || "Arquivo registrado no portal."}
                            </p>
                            <p className="mt-3 text-xs text-slate-500">
                              {document.fileName || "Arquivo ainda sem nome publico"} -{" "}
                              {formatPortalDate(document.uploadedAt)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="surface-card p-6">
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                      avisos enviados
                    </p>
                    <div className="mt-5 space-y-4">
                      {detail.notifications.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-white/10 px-4 py-4 text-sm text-slate-300">
                          Quando houver envio de e-mail, portal ou WhatsApp, o historico ficara registrado aqui.
                        </div>
                      ) : (
                        detail.notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                                {notificationChannelLabels[notification.channel]}
                              </p>
                              <p className="text-xs text-slate-500">
                                {formatPortalDate(notification.createdAt)}
                              </p>
                            </div>
                            <h3 className="mt-2 text-lg font-bold text-white">
                              {notification.title}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                              {notification.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <RouteLink
                    href={supportLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary w-full justify-center"
                  >
                    Falar com a equipe
                  </RouteLink>
                </div>
              </div>
            </>
          ) : null}

          {!loading && !detail?.caseItem ? (
            <div className="surface-card p-8">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                caso indisponivel
              </p>
              <h2 className="mt-5 text-3xl font-bold text-white">
                Este caso ainda nao esta visivel para o seu acesso.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                O caso pode nao ter sido vinculado ao seu e-mail ainda, ou as migrations do portal ainda nao foram aplicadas neste ambiente.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
