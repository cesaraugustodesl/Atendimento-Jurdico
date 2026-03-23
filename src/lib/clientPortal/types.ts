export type CaseStatus =
  | "triagem"
  | "analise-inicial"
  | "documentos-pendentes"
  | "em-andamento"
  | "aguardando-terceiros"
  | "audiencia-designada"
  | "concluido";

export type CasePriority = "baixa" | "media" | "alta";

export type CaseUpdateType =
  | "status"
  | "movimentacao"
  | "documento"
  | "prazo"
  | "mensagem"
  | "audiencia";

export type CaseUpdateSource = "manual" | "jusbrasil" | "tribunal" | "cliente" | "whatsapp";

export type NotificationChannel = "portal" | "email" | "whatsapp";

export type NotificationStatus =
  | "pending"
  | "queued"
  | "sent"
  | "delivered"
  | "failed"
  | "read";

export interface ClientProfile {
  id: string;
  authUserId: string | null;
  fullName: string;
  email: string;
  whatsapp: string;
  status: string;
}

export interface PortalCaseSummary {
  id: string;
  title: string;
  area: string;
  summary: string;
  status: CaseStatus;
  priority: CasePriority;
  caseCode: string;
  cnjNumber: string;
  assignedLawyer: string;
  nextDeadlineAt: string | null;
  lastEventAt: string | null;
  lastEventSummary: string;
  monitorProvider: string;
  monitorReference: string;
  whatsappOptIn: boolean;
}

export interface CaseUpdateItem {
  id: string;
  caseId: string;
  title: string;
  description: string;
  updateType: CaseUpdateType;
  source: CaseUpdateSource;
  eventAt: string | null;
  visibleToClient: boolean;
  highlight: boolean;
}

export interface CaseDocumentItem {
  id: string;
  caseId: string;
  title: string;
  description: string;
  documentType: string;
  filePath: string;
  fileName: string;
  uploadedBy: string;
  visibleToClient: boolean;
  uploadedAt: string | null;
}

export interface CaseNotificationItem {
  id: string;
  caseId: string;
  channel: NotificationChannel;
  notificationType: string;
  title: string;
  message: string;
  status: NotificationStatus;
  recipient: string;
  createdAt: string | null;
  sentAt: string | null;
  readAt: string | null;
}

export interface PortalSetupStatus {
  tables: {
    clientProfiles: boolean;
    staffProfiles: boolean;
    cases: boolean;
    updates: boolean;
    documents: boolean;
    notifications: boolean;
    simulatorLeads: boolean;
  };
}

export interface PortalDashboardData {
  profile: ClientProfile | null;
  cases: PortalCaseSummary[];
  recentUpdates: CaseUpdateItem[];
  notifications: CaseNotificationItem[];
  setup: PortalSetupStatus;
}

export interface PortalCaseDetailData {
  profile: ClientProfile | null;
  caseItem: PortalCaseSummary | null;
  updates: CaseUpdateItem[];
  documents: CaseDocumentItem[];
  notifications: CaseNotificationItem[];
  setup: PortalSetupStatus;
}

export interface StaffProfile {
  id: string;
  userId: string;
  fullName: string;
  role: "staff" | "admin";
}

export interface OfficePortalSnapshot {
  staffProfile: StaffProfile | null;
  cases: Array<PortalCaseSummary & { clientName: string; clientEmail: string }>;
  recentLeads: Array<{
    id: string;
    createdAt: string | null;
    simulatorSlug: string;
    name: string;
    email: string;
    whatsapp: string;
    score: number;
    priority: string;
  }>;
  notifications: CaseNotificationItem[];
  setup: PortalSetupStatus;
}

export interface CreateManualCaseInput {
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

export const caseStatusLabels: Record<CaseStatus, string> = {
  triagem: "Triagem",
  "analise-inicial": "Analise inicial",
  "documentos-pendentes": "Documentos pendentes",
  "em-andamento": "Em andamento",
  "aguardando-terceiros": "Aguardando terceiros",
  "audiencia-designada": "Audiencia designada",
  concluido: "Concluido",
};

export const casePriorityLabels: Record<CasePriority, string> = {
  baixa: "Baixa prioridade",
  media: "Media prioridade",
  alta: "Alta prioridade",
};

export const updateSourceLabels: Record<CaseUpdateSource, string> = {
  manual: "Equipe",
  jusbrasil: "Jusbrasil",
  tribunal: "Tribunal",
  cliente: "Cliente",
  whatsapp: "WhatsApp",
};

export const notificationChannelLabels: Record<NotificationChannel, string> = {
  portal: "Portal",
  email: "E-mail",
  whatsapp: "WhatsApp",
};

export function formatPortalDate(value: string | null, options?: Intl.DateTimeFormatOptions) {
  if (!value) {
    return "Ainda sem data";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Data indisponivel";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(parsed);
}
