import { supabase } from "../lib/supabase";
import type {
  CaseDocumentItem,
  CaseNotificationItem,
  CaseUpdateItem,
  ClientProfile,
  CreateManualCaseInput,
  OfficePortalSnapshot,
  PortalCaseDetailData,
  PortalCaseSummary,
  PortalDashboardData,
  PortalSetupStatus,
  StaffProfile,
} from "../lib/clientPortal/types";

function normalizeText(value: unknown) {
  return typeof value === "string" ? value : "";
}

function normalizeNullableText(value: unknown) {
  return typeof value === "string" && value ? value : null;
}

function normalizeBoolean(value: unknown) {
  return value === true;
}

function isMissingResourceError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as { code?: string; message?: string; details?: string };
  const message = `${candidate.message ?? ""} ${candidate.details ?? ""}`;

  return (
    candidate.code === "42P01" ||
    candidate.code === "PGRST205" ||
    candidate.code === "PGRST202" ||
    /relation .* does not exist/i.test(message) ||
    /could not find the table/i.test(message) ||
    /could not find the function/i.test(message)
  );
}

function mapSetupStatus(input: Partial<PortalSetupStatus["tables"]>): PortalSetupStatus {
  return {
    tables: {
      clientProfiles: input.clientProfiles ?? false,
      staffProfiles: input.staffProfiles ?? false,
      cases: input.cases ?? false,
      updates: input.updates ?? false,
      documents: input.documents ?? false,
      notifications: input.notifications ?? false,
      simulatorLeads: input.simulatorLeads ?? false,
    },
  };
}

function mapClientProfile(row: Record<string, unknown> | null): ClientProfile | null {
  if (!row) {
    return null;
  }

  return {
    id: normalizeText(row.id),
    authUserId: normalizeNullableText(row.auth_user_id),
    fullName: normalizeText(row.full_name),
    email: normalizeText(row.email),
    whatsapp: normalizeText(row.whatsapp),
    status: normalizeText(row.status),
  };
}

function mapStaffProfile(row: Record<string, unknown> | null): StaffProfile | null {
  if (!row) {
    return null;
  }

  return {
    id: normalizeText(row.id),
    userId: normalizeText(row.user_id),
    fullName: normalizeText(row.full_name),
    role: normalizeText(row.role) === "admin" ? "admin" : "staff",
  };
}

function mapCase(row: Record<string, unknown>): PortalCaseSummary {
  return {
    id: normalizeText(row.id),
    title: normalizeText(row.title),
    area: normalizeText(row.area),
    summary: normalizeText(row.summary),
    status:
      (normalizeText(row.status) as PortalCaseSummary["status"]) || "triagem",
    priority:
      (normalizeText(row.priority) as PortalCaseSummary["priority"]) || "media",
    caseCode: normalizeText(row.case_code),
    cnjNumber: normalizeText(row.cnj_number),
    assignedLawyer: normalizeText(row.assigned_lawyer),
    nextDeadlineAt: normalizeNullableText(row.next_deadline_at),
    lastEventAt: normalizeNullableText(row.last_event_at),
    lastEventSummary: normalizeText(row.last_event_summary),
    monitorProvider: normalizeText(row.monitor_provider),
    monitorReference: normalizeText(row.monitor_reference),
    whatsappOptIn: normalizeBoolean(row.whatsapp_opt_in),
  };
}

function mapUpdate(row: Record<string, unknown>): CaseUpdateItem {
  return {
    id: normalizeText(row.id),
    caseId: normalizeText(row.case_id),
    title: normalizeText(row.title),
    description: normalizeText(row.description),
    updateType:
      (normalizeText(row.update_type) as CaseUpdateItem["updateType"]) || "status",
    source: (normalizeText(row.source) as CaseUpdateItem["source"]) || "manual",
    eventAt: normalizeNullableText(row.event_at),
    visibleToClient: normalizeBoolean(row.visible_to_client),
    highlight: normalizeBoolean(row.highlight),
  };
}

function mapDocument(row: Record<string, unknown>): CaseDocumentItem {
  return {
    id: normalizeText(row.id),
    caseId: normalizeText(row.case_id),
    title: normalizeText(row.title),
    description: normalizeText(row.description),
    documentType: normalizeText(row.document_type),
    filePath: normalizeText(row.file_path),
    fileName: normalizeText(row.file_name),
    uploadedBy: normalizeText(row.uploaded_by),
    visibleToClient: normalizeBoolean(row.visible_to_client),
    uploadedAt: normalizeNullableText(row.uploaded_at),
  };
}

function mapNotification(row: Record<string, unknown>): CaseNotificationItem {
  return {
    id: normalizeText(row.id),
    caseId: normalizeText(row.case_id),
    channel:
      (normalizeText(row.channel) as CaseNotificationItem["channel"]) || "portal",
    notificationType: normalizeText(row.notification_type),
    title: normalizeText(row.title),
    message: normalizeText(row.message),
    status:
      (normalizeText(row.status) as CaseNotificationItem["status"]) || "pending",
    recipient: normalizeText(row.recipient),
    createdAt: normalizeNullableText(row.created_at),
    sentAt: normalizeNullableText(row.sent_at),
    readAt: normalizeNullableText(row.read_at),
  };
}

async function tableAvailable(tableName: string) {
  const { error } = await supabase.from(tableName).select("id", { head: true, count: "exact" });
  return !isMissingResourceError(error);
}

export async function inspectPortalSetup(): Promise<PortalSetupStatus> {
  const [
    clientProfiles,
    staffProfiles,
    cases,
    updates,
    documents,
    notifications,
    simulatorLeads,
  ] = await Promise.all([
    tableAvailable("client_profiles"),
    tableAvailable("staff_profiles"),
    tableAvailable("legal_cases"),
    tableAvailable("case_updates"),
    tableAvailable("case_documents"),
    tableAvailable("case_notifications"),
    tableAvailable("simulator_leads"),
  ]);

  return mapSetupStatus({
    clientProfiles,
    staffProfiles,
    cases,
    updates,
    documents,
    notifications,
    simulatorLeads,
  });
}

export async function claimClientProfileFromSession() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const fullName =
    normalizeText(user.user_metadata?.full_name) ||
    normalizeText(user.user_metadata?.name);

  const { error: rpcError } = await supabase.rpc("claim_client_profile", {
    profile_name: fullName,
    profile_whatsapp: "",
  });

  if (rpcError && !isMissingResourceError(rpcError)) {
    throw rpcError;
  }

  const normalizedEmail = user.email.trim().toLowerCase();
  const { data, error } = await supabase
    .from("client_profiles")
    .select("*")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    if (isMissingResourceError(error)) {
      return null;
    }
    throw error;
  }

  return mapClientProfile((data ?? null) as Record<string, unknown> | null);
}

export async function hasStaffAccess() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data, error } = await supabase
    .from("staff_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    if (isMissingResourceError(error)) {
      return false;
    }
    throw error;
  }

  return Boolean(data);
}

export async function loadClientDashboard(): Promise<PortalDashboardData> {
  const setup = await inspectPortalSetup();
  const profile = await claimClientProfileFromSession();

  if (!profile || !setup.tables.cases) {
    return {
      profile,
      cases: [],
      recentUpdates: [],
      notifications: [],
      setup,
    };
  }

  const { data: caseRows, error: casesError } = await supabase
    .from("legal_cases")
    .select("*")
    .order("updated_at", { ascending: false });

  if (casesError) {
    if (isMissingResourceError(casesError)) {
      return {
        profile,
        cases: [],
        recentUpdates: [],
        notifications: [],
        setup: mapSetupStatus({ ...setup.tables, cases: false }),
      };
    }
    throw casesError;
  }

  const cases = ((caseRows ?? []) as Record<string, unknown>[]).map(mapCase);
  const caseIds = cases.map((item) => item.id);

  if (caseIds.length === 0) {
    return {
      profile,
      cases,
      recentUpdates: [],
      notifications: [],
      setup,
    };
  }

  const [{ data: updateRows, error: updatesError }, { data: notificationRows, error: notificationsError }] =
    await Promise.all([
      supabase
        .from("case_updates")
        .select("*")
        .in("case_id", caseIds)
        .eq("visible_to_client", true)
        .order("event_at", { ascending: false })
        .limit(12),
      supabase
        .from("case_notifications")
        .select("*")
        .in("case_id", caseIds)
        .order("created_at", { ascending: false })
        .limit(12),
    ]);

  if (updatesError && !isMissingResourceError(updatesError)) {
    throw updatesError;
  }

  if (notificationsError && !isMissingResourceError(notificationsError)) {
    throw notificationsError;
  }

  return {
    profile,
    cases,
    recentUpdates: isMissingResourceError(updatesError)
      ? []
      : ((updateRows ?? []) as Record<string, unknown>[]).map(mapUpdate),
    notifications: isMissingResourceError(notificationsError)
      ? []
      : ((notificationRows ?? []) as Record<string, unknown>[]).map(mapNotification),
    setup: mapSetupStatus({
      ...setup.tables,
      updates: setup.tables.updates && !isMissingResourceError(updatesError),
      notifications:
        setup.tables.notifications && !isMissingResourceError(notificationsError),
    }),
  };
}

export async function loadClientCaseDetail(caseId: string): Promise<PortalCaseDetailData> {
  const setup = await inspectPortalSetup();
  const profile = await claimClientProfileFromSession();

  if (!profile || !setup.tables.cases) {
    return {
      profile,
      caseItem: null,
      updates: [],
      documents: [],
      notifications: [],
      setup,
    };
  }

  const { data: caseRow, error: caseError } = await supabase
    .from("legal_cases")
    .select("*")
    .eq("id", caseId)
    .maybeSingle();

  if (caseError) {
    if (isMissingResourceError(caseError)) {
      return {
        profile,
        caseItem: null,
        updates: [],
        documents: [],
        notifications: [],
        setup: mapSetupStatus({ ...setup.tables, cases: false }),
      };
    }
    throw caseError;
  }

  if (!caseRow) {
    return {
      profile,
      caseItem: null,
      updates: [],
      documents: [],
      notifications: [],
      setup,
    };
  }

  const [{ data: updateRows, error: updatesError }, { data: documentRows, error: documentsError }, { data: notificationRows, error: notificationsError }] =
    await Promise.all([
      supabase
        .from("case_updates")
        .select("*")
        .eq("case_id", caseId)
        .eq("visible_to_client", true)
        .order("event_at", { ascending: false }),
      supabase
        .from("case_documents")
        .select("*")
        .eq("case_id", caseId)
        .eq("visible_to_client", true)
        .order("uploaded_at", { ascending: false }),
      supabase
        .from("case_notifications")
        .select("*")
        .eq("case_id", caseId)
        .order("created_at", { ascending: false }),
    ]);

  if (updatesError && !isMissingResourceError(updatesError)) {
    throw updatesError;
  }

  if (documentsError && !isMissingResourceError(documentsError)) {
    throw documentsError;
  }

  if (notificationsError && !isMissingResourceError(notificationsError)) {
    throw notificationsError;
  }

  return {
    profile,
    caseItem: mapCase(caseRow as Record<string, unknown>),
    updates: isMissingResourceError(updatesError)
      ? []
      : ((updateRows ?? []) as Record<string, unknown>[]).map(mapUpdate),
    documents: isMissingResourceError(documentsError)
      ? []
      : ((documentRows ?? []) as Record<string, unknown>[]).map(mapDocument),
    notifications: isMissingResourceError(notificationsError)
      ? []
      : ((notificationRows ?? []) as Record<string, unknown>[]).map(mapNotification),
    setup: mapSetupStatus({
      ...setup.tables,
      updates: setup.tables.updates && !isMissingResourceError(updatesError),
      documents: setup.tables.documents && !isMissingResourceError(documentsError),
      notifications:
        setup.tables.notifications && !isMissingResourceError(notificationsError),
    }),
  };
}

export function subscribeToCaseFeed(caseId: string, onRefresh: () => void) {
  const channel = supabase
    .channel(`case-feed-${caseId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "legal_cases", filter: `id=eq.${caseId}` },
      onRefresh
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "case_updates", filter: `case_id=eq.${caseId}` },
      onRefresh
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "case_documents", filter: `case_id=eq.${caseId}` },
      onRefresh
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "case_notifications",
        filter: `case_id=eq.${caseId}`,
      },
      onRefresh
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

export async function loadOfficePortalSnapshot(): Promise<OfficePortalSnapshot> {
  const setup = await inspectPortalSetup();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      staffProfile: null,
      cases: [],
      recentLeads: [],
      notifications: [],
      setup,
    };
  }

  const { data: staffRow, error: staffError } = await supabase
    .from("staff_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (staffError) {
    if (isMissingResourceError(staffError)) {
      return {
        staffProfile: null,
        cases: [],
        recentLeads: [],
        notifications: [],
        setup: mapSetupStatus({ ...setup.tables, staffProfiles: false }),
      };
    }
    throw staffError;
  }

  const staffProfile = mapStaffProfile((staffRow ?? null) as Record<string, unknown> | null);

  if (!staffProfile || !setup.tables.cases) {
    return {
      staffProfile,
      cases: [],
      recentLeads: [],
      notifications: [],
      setup,
    };
  }

  const [{ data: caseRows, error: caseError }, { data: leadRows, error: leadError }, { data: notificationRows, error: notificationError }] =
    await Promise.all([
      supabase
        .from("legal_cases")
        .select("*, client_profiles(id, full_name, email)")
        .order("updated_at", { ascending: false })
        .limit(12),
      supabase
        .from("simulator_leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("case_notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

  if (caseError && !isMissingResourceError(caseError)) {
    throw caseError;
  }

  if (leadError && !isMissingResourceError(leadError)) {
    throw leadError;
  }

  if (notificationError && !isMissingResourceError(notificationError)) {
    throw notificationError;
  }

  const cases = ((caseRows ?? []) as Array<Record<string, unknown> & { client_profiles?: Record<string, unknown> | null }>).map(
    (row) => {
      const mapped = mapCase(row);
      const client = row.client_profiles ?? {};

      return {
        ...mapped,
        clientName: normalizeText(client.full_name),
        clientEmail: normalizeText(client.email),
      };
    }
  );

  const recentLeads = isMissingResourceError(leadError)
    ? []
    : ((leadRows ?? []) as Record<string, unknown>[]).map((row) => ({
        id: normalizeText(row.id),
        createdAt: normalizeNullableText(row.created_at),
        simulatorSlug: normalizeText(row.simulator_slug),
        name: normalizeText(row.nome),
        email: normalizeText(row.email),
        whatsapp: normalizeText(row.whatsapp),
        score: typeof row.lead_score === "number" ? row.lead_score : 0,
        priority: normalizeText(row.lead_priority),
      }));

  const notifications = isMissingResourceError(notificationError)
    ? []
    : ((notificationRows ?? []) as Record<string, unknown>[]).map(mapNotification);

  return {
    staffProfile,
    cases,
    recentLeads,
    notifications,
    setup: mapSetupStatus({
      ...setup.tables,
      simulatorLeads: setup.tables.simulatorLeads && !isMissingResourceError(leadError),
      notifications:
        setup.tables.notifications && !isMissingResourceError(notificationError),
    }),
  };
}

export async function createManualCaseDraft(input: CreateManualCaseInput) {
  const normalizedEmail = input.clientEmail.trim().toLowerCase();
  const clientName = input.clientName.trim();
  const clientWhatsapp = input.clientWhatsapp.trim();
  const title = input.title.trim();
  const area = input.area.trim();
  const summary = input.summary.trim();
  const cnjNumber = input.cnjNumber.trim();

  let clientId = "";

  const { data: existingClient, error: clientLookupError } = await supabase
    .from("client_profiles")
    .select("*")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (clientLookupError && !isMissingResourceError(clientLookupError)) {
    throw clientLookupError;
  }

  if (existingClient) {
    clientId = normalizeText((existingClient as Record<string, unknown>).id);

    const { error: updateClientError } = await supabase
      .from("client_profiles")
      .update({
        full_name:
          clientName || normalizeText((existingClient as Record<string, unknown>).full_name),
        whatsapp:
          clientWhatsapp ||
          normalizeText((existingClient as Record<string, unknown>).whatsapp),
      })
      .eq("id", clientId);

    if (updateClientError) {
      throw updateClientError;
    }
  } else {
    const { data: insertedClient, error: insertClientError } = await supabase
      .from("client_profiles")
      .insert({
        full_name: clientName,
        email: normalizedEmail,
        whatsapp: clientWhatsapp,
        status: "aguardando-acesso",
      })
      .select("*")
      .single();

    if (insertClientError) {
      throw insertClientError;
    }

    clientId = normalizeText((insertedClient as Record<string, unknown>).id);
  }

  const caseCode = `CASO-${Date.now().toString().slice(-6)}`;

  const { data: insertedCase, error: insertCaseError } = await supabase
    .from("legal_cases")
    .insert({
      client_id: clientId,
      case_code: caseCode,
      title,
      area,
      summary,
      status: input.status,
      priority: input.priority,
      cnj_number: cnjNumber,
      last_event_summary: "Caso criado no portal pela equipe.",
      last_event_at: new Date().toISOString(),
      monitor_provider: "",
      monitor_reference: "",
      whatsapp_opt_in: false,
    })
    .select("*")
    .single();

  if (insertCaseError) {
    throw insertCaseError;
  }

  const caseId = normalizeText((insertedCase as Record<string, unknown>).id);

  const { error: insertUpdateError } = await supabase.from("case_updates").insert({
    case_id: caseId,
    update_type: "status",
    source: "manual",
    title: "Caso criado no portal",
    description:
      "A equipe abriu o acompanhamento deste caso. Os proximos passos e documentos aparecerao aqui.",
    visible_to_client: true,
    highlight: true,
    event_at: new Date().toISOString(),
  });

  if (insertUpdateError) {
    throw insertUpdateError;
  }

  return caseId;
}
