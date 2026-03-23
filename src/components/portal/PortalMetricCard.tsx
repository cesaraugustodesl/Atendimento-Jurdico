import type { ReactNode } from "react";

interface PortalMetricCardProps {
  label: string;
  value: string;
  description: string;
  icon?: ReactNode;
}

export default function PortalMetricCard({
  label,
  value,
  description,
  icon,
}: PortalMetricCardProps) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-bold text-white">{value}</p>
        </div>
        {icon ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sky-300">
            {icon}
          </div>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
    </div>
  );
}
