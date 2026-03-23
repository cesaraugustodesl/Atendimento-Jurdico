import { getAbsoluteUrl, pagePaths } from "../../config/site";
import type {
  CaseNotificationItem,
  CaseUpdateItem,
  PortalCaseSummary,
} from "./types";

function readFlag(value: string | undefined) {
  return value === "true";
}

export interface IntegrationReadinessItem {
  id: "portal" | "whatsapp" | "jusbrasil";
  label: string;
  enabled: boolean;
  description: string;
  nextStep: string;
}

export function getIntegrationReadiness(): IntegrationReadinessItem[] {
  const whatsappEnabled = readFlag(import.meta.env.VITE_WHATSAPP_NOTIFICATIONS_ENABLED);
  const jusbrasilEnabled = readFlag(import.meta.env.VITE_JUSBRASIL_MONITORING_ENABLED);

  return [
    {
      id: "portal",
      label: "Portal do cliente",
      enabled: true,
      description:
        "A base do portal mostra caso, timeline, documentos e historico de notificacoes em um painel autenticado.",
      nextStep: "Aplicar as migrations no Supabase e cadastrar os primeiros clientes e casos.",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      enabled: whatsappEnabled,
      description:
        "Canal ideal para alertas transacionais, confirmacao de recebimento e retorno rapido para o cliente.",
      nextStep: whatsappEnabled
        ? "Conectar o provedor oficial, salvar message_id e refletir status no portal."
        : "Habilitar a camada de notificacao via WhatsApp Business Platform e apontar o webhook de entrega.",
    },
    {
      id: "jusbrasil",
      label: "Monitoramento processual",
      enabled: jusbrasilEnabled,
      description:
        "Permite transformar movimentacoes externas em eventos da timeline e avisos automaticos ao cliente.",
      nextStep: jusbrasilEnabled
        ? "Vincular CNJ por caso e consumir o webhook para alimentar case_updates."
        : "Cadastrar o monitoramento de processos e receber webhooks para popular as atualizacoes.",
    },
  ];
}

export function getClientCasePath(caseId: string) {
  return `${pagePaths["client-area"]}/casos/${caseId}`;
}

export function getClientCaseUrl(caseId: string) {
  return getAbsoluteUrl(getClientCasePath(caseId));
}

export function buildCaseSupportMessage(caseItem: PortalCaseSummary) {
  return [
    "Ola, equipe.",
    `Quero acompanhar o caso "${caseItem.title}".`,
    `Status atual no portal: ${caseItem.status}.`,
    caseItem.caseCode ? `Codigo interno: ${caseItem.caseCode}.` : "",
    caseItem.cnjNumber ? `CNJ: ${caseItem.cnjNumber}.` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function buildWhatsAppUpdatePreview(
  caseItem: PortalCaseSummary,
  update: CaseUpdateItem | null,
  notification?: CaseNotificationItem | null
) {
  const caseUrl = getClientCaseUrl(caseItem.id);

  return [
    "Atualizacao do seu caso:",
    caseItem.title,
    update?.title ? `Novidade: ${update.title}.` : "",
    notification?.title ? `Aviso: ${notification.title}.` : "",
    `Acompanhe em: ${caseUrl}`,
  ]
    .filter(Boolean)
    .join(" ");
}
