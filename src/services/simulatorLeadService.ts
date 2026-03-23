import { supabase } from "../lib/supabase";
import type {
  SimulatorDefinition,
  SimulatorFormValues,
  SimulatorOutcome,
} from "../lib/simulators/types";

interface LeadIdentity {
  name: string;
  whatsapp: string;
  email: string;
  caseSummary: string;
}

interface SaveSimulatorLeadInput {
  simulator: SimulatorDefinition;
  values: SimulatorFormValues;
  result: SimulatorOutcome;
  lead: LeadIdentity;
}

function toLaborViolations(values: SimulatorFormValues) {
  const selected = Array.isArray(values.violations)
    ? values.violations.filter((item): item is string => typeof item === "string")
    : [];

  return {
    horasExtrasNaoPagas: selected.includes("horasExtrasNaoPagas"),
    domingosFeriados: selected.includes("domingosFeriados"),
    intervaloIrregular: selected.includes("intervaloIrregular"),
    trabalhoNoturno: selected.includes("trabalhoNoturno"),
    insalubridade: selected.includes("insalubridade"),
    fgtsNaoPago: selected.includes("fgtsNaoPago"),
    demissaoProblematica: selected.includes("demissaoProblematica"),
    tempoMaisTresAnos: selected.includes("tempoMaisTresAnos"),
  };
}

async function saveLegacyLaborLead(
  values: SimulatorFormValues,
  result: SimulatorOutcome,
  lead: LeadIdentity
) {
  return supabase.from("labor_leads").insert({
    name: lead.name,
    whatsapp: lead.whatsapp,
    email: lead.email,
    contract_type:
      typeof values.contractType === "string" && values.contractType
        ? values.contractType
        : "clt",
    salary: typeof values.salary === "number" ? values.salary : 0,
    years_worked: typeof values.yearsWorked === "number" ? values.yearsWorked : 0,
    violations: toLaborViolations(values),
    score: result.score,
    classification: result.classification,
    estimate_min: result.estimate?.min ?? 0,
    estimate_max: result.estimate?.max ?? 0,
  });
}

export async function saveSimulatorLead({
  simulator,
  values,
  result,
  lead,
}: SaveSimulatorLeadInput) {
  const payload = {
    simulator_slug: simulator.slug,
    nome: lead.name,
    whatsapp: lead.whatsapp,
    email: lead.email,
    case_summary: lead.caseSummary,
    respostas_json: values,
    resultado_json: result,
    lead_score: result.score,
    lead_priority: result.classification,
    origem:
      typeof window !== "undefined" ? window.location.pathname : simulator.path,
    page_url:
      typeof window !== "undefined" ? window.location.href : simulator.path,
    status: "novo",
  };

  const { error } = await supabase.from("simulator_leads").insert(payload);

  if (!error) {
    return;
  }

  if (simulator.id === "labor-general") {
    const legacy = await saveLegacyLaborLead(values, result, lead);
    if (!legacy.error) {
      return;
    }
  }

  throw error;
}
