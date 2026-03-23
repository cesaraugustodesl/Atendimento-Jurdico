import {
  casePriorityLabels,
  caseStatusLabels,
  type CasePriority,
  type CaseStatus,
} from "../../lib/clientPortal/types";

interface PortalStatusPillProps {
  kind: "status" | "priority";
  value: CaseStatus | CasePriority;
}

const statusClasses: Record<CaseStatus, string> = {
  triagem: "border-slate-400/20 bg-slate-500/10 text-slate-200",
  "analise-inicial": "border-sky-400/25 bg-sky-500/10 text-sky-200",
  "documentos-pendentes": "border-amber-400/25 bg-amber-500/10 text-amber-200",
  "em-andamento": "border-emerald-400/25 bg-emerald-500/10 text-emerald-200",
  "aguardando-terceiros": "border-violet-400/25 bg-violet-500/10 text-violet-200",
  "audiencia-designada": "border-fuchsia-400/25 bg-fuchsia-500/10 text-fuchsia-200",
  concluido: "border-slate-400/20 bg-white/5 text-slate-300",
};

const priorityClasses: Record<CasePriority, string> = {
  baixa: "border-slate-400/20 bg-white/5 text-slate-300",
  media: "border-amber-400/25 bg-amber-500/10 text-amber-200",
  alta: "border-rose-400/25 bg-rose-500/10 text-rose-200",
};

export default function PortalStatusPill({ kind, value }: PortalStatusPillProps) {
  const className =
    kind === "status"
      ? statusClasses[value as CaseStatus]
      : priorityClasses[value as CasePriority];

  const label =
    kind === "status"
      ? caseStatusLabels[value as CaseStatus]
      : casePriorityLabels[value as CasePriority];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${className}`}
    >
      {label}
    </span>
  );
}
