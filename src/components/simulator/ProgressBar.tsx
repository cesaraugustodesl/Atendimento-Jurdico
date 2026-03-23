import { Clock } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = ["Contrato", "Emprego", "Sinais", "Contato"];

export default function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300">
          <Clock className="w-4 h-4 text-emerald-400" />
          Leva poucos minutos
        </div>
        <span className="text-sm font-medium text-sky-300">
          Etapa {currentStep + 1} de {totalSteps}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3">
        {STEP_LABELS.map((label, index) => (
          <span
            key={label}
            className={`text-xs font-medium ${
              index <= currentStep ? "text-white" : "text-slate-500"
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
