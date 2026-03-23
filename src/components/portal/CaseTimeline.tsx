import { BellRing, FileText, Gavel, MessageSquare, Timer } from "lucide-react";
import {
  formatPortalDate,
  updateSourceLabels,
  type CaseUpdateItem,
} from "../../lib/clientPortal/types";

interface CaseTimelineProps {
  updates: CaseUpdateItem[];
  emptyMessage: string;
}

function getIcon(type: CaseUpdateItem["updateType"]) {
  switch (type) {
    case "documento":
      return <FileText className="h-4 w-4" />;
    case "audiencia":
      return <Gavel className="h-4 w-4" />;
    case "prazo":
      return <Timer className="h-4 w-4" />;
    case "mensagem":
      return <MessageSquare className="h-4 w-4" />;
    default:
      return <BellRing className="h-4 w-4" />;
  }
}

export default function CaseTimeline({ updates, emptyMessage }: CaseTimelineProps) {
  if (updates.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-5 py-6 text-sm text-slate-300">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {updates.map((update) => (
        <div key={update.id} className="surface-card p-5">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sky-300">
              {getIcon(update.updateType)}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {updateSourceLabels[update.source]}
                </p>
                <p className="text-xs text-slate-500">{formatPortalDate(update.eventAt)}</p>
                {update.highlight ? (
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                    destaque
                  </span>
                ) : null}
              </div>
              <h3 className="mt-3 text-xl font-bold text-white">{update.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{update.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
