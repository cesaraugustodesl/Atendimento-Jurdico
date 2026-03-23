import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import type {
  SimulatorField,
  SimulatorFormValues,
  SimulatorStepDefinition,
  SimulatorValue,
} from "../../lib/simulators/types";

interface SimulatorQuestionStepProps {
  step: SimulatorStepDefinition;
  values: SimulatorFormValues;
  onChange: (fieldId: string, value: SimulatorValue) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
}

function isFieldComplete(field: SimulatorField, value: SimulatorValue | undefined) {
  if (!field.required) {
    return true;
  }

  if (field.type === "multiselect") {
    return Array.isArray(value) && value.length > 0;
  }

  if (field.type === "currency" || field.type === "number") {
    return typeof value === "number" && value > 0;
  }

  return typeof value === "string" && value.trim().length > 0;
}

function formatCurrency(value: number) {
  if (!value) {
    return "";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SimulatorQuestionStep({
  step,
  values,
  onChange,
  onNext,
  onBack,
  isFirstStep,
}: SimulatorQuestionStepProps) {
  const canAdvance = step.fields.every((field) =>
    isFieldComplete(field, values[field.id])
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white">{step.title}</h3>
        <p className="mt-2 text-sm leading-7 text-slate-400">{step.description}</p>
      </div>

      <div className="space-y-5">
        {step.fields.map((field) => {
          const value = values[field.id];

          if (field.type === "choice" && field.options) {
            return (
              <div key={field.id} className="space-y-3">
                <label className="text-sm font-medium text-slate-300">
                  {field.label}
                </label>
                <div className="grid gap-3">
                  {field.options.map((option) => {
                    const isSelected = value === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => onChange(field.id, option.value)}
                        className={`rounded-2xl border px-4 py-4 text-left text-sm transition-colors ${
                          isSelected
                            ? "border-sky-400/40 bg-sky-500/10 text-white"
                            : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        <p className="font-semibold">{option.label}</p>
                        {option.description ? (
                          <p className="mt-1 text-xs leading-6 text-slate-400">
                            {option.description}
                          </p>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }

          if (field.type === "yesno" && field.options) {
            return (
              <div key={field.id} className="space-y-3">
                <label className="text-sm font-medium text-slate-300">
                  {field.label}
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {field.options.map((option) => {
                    const isSelected = value === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => onChange(field.id, option.value)}
                        className={`rounded-2xl border px-4 py-4 text-center text-sm font-semibold transition-colors ${
                          isSelected
                            ? "border-sky-400/40 bg-sky-500/10 text-white"
                            : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }

          if (field.type === "multiselect" && field.options) {
            const selectedValues = Array.isArray(value) ? value : [];

            return (
              <div key={field.id} className="space-y-3">
                <label className="text-sm font-medium text-slate-300">
                  {field.label}
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {field.options.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() =>
                          onChange(
                            field.id,
                            isSelected
                              ? selectedValues.filter((item) => item !== option.value)
                              : [...selectedValues, option.value]
                          )
                        }
                        className={`rounded-2xl border p-4 text-left transition-colors ${
                          isSelected
                            ? "border-emerald-400/40 bg-emerald-500/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {isSelected ? (
                            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" />
                          ) : (
                            <Circle className="mt-0.5 h-5 w-5 text-slate-500" />
                          )}
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {option.label}
                            </p>
                            {option.description ? (
                              <p className="mt-1 text-xs leading-6 text-slate-400">
                                {option.description}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }

          if (field.type === "currency") {
            const numericValue = typeof value === "number" ? value : 0;

            return (
              <div key={field.id}>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  {field.label}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatCurrency(numericValue)}
                  onChange={(event) =>
                    onChange(field.id, Number(event.target.value.replace(/\D/g, "")))
                  }
                  placeholder={field.placeholder}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 text-white placeholder-slate-500 outline-none focus:border-sky-400/50"
                />
                {field.helper ? (
                  <p className="mt-2 text-xs leading-6 text-slate-500">{field.helper}</p>
                ) : null}
              </div>
            );
          }

          if (field.type === "number") {
            const numericValue = typeof value === "number" ? value : 0;

            return (
              <div key={field.id}>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  {field.label}
                </label>
                <input
                  type="number"
                  value={numericValue || ""}
                  min={field.min}
                  max={field.max}
                  step={field.step ?? 1}
                  onChange={(event) =>
                    onChange(field.id, Number(event.target.value || 0))
                  }
                  placeholder={field.placeholder}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 text-white placeholder-slate-500 outline-none focus:border-sky-400/50"
                />
                {field.helper ? (
                  <p className="mt-2 text-xs leading-6 text-slate-500">{field.helper}</p>
                ) : null}
              </div>
            );
          }

          return (
            <div key={field.id}>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                {field.label}
              </label>
              <textarea
                rows={5}
                value={typeof value === "string" ? value : ""}
                onChange={(event) => onChange(field.id, event.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 text-white placeholder-slate-500 outline-none focus:border-sky-400/50"
              />
              {field.helper ? (
                <p className="mt-2 text-xs leading-6 text-slate-500">{field.helper}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        {!isFirstStep ? (
          <button onClick={onBack} className="btn-secondary flex-1">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        ) : null}
        <button
          onClick={onNext}
          disabled={!canAdvance}
          className={`flex-1 rounded-2xl px-6 py-4 font-semibold ${
            canAdvance
              ? "bg-gradient-to-r from-sky-500 to-blue-700 text-white"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            Continuar
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>
      </div>
    </div>
  );
}
