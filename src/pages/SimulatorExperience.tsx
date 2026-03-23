import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Calculator, Shield, Users } from "lucide-react";
import ProgressBar from "../components/simulator/ProgressBar";
import StepContact from "../components/simulator/StepContact";
import SimulatorQuestionStep from "../components/simulator/SimulatorQuestionStep";
import ResultsPanel from "../components/simulator/ResultsPanel";
import {
  fetchCaseComparison,
  type CaseComparisonInsight,
  type CaseComparisonItem,
  type CaseDurationStats,
} from "../lib/caseComparison";
import type {
  SimulatorDefinition,
  SimulatorFormValues,
  SimulatorValue,
  SimulatorOutcome,
} from "../lib/simulators/types";
import { saveSimulatorLead } from "../services/simulatorLeadService";
import { trackEvent } from "../services/trackingService";

interface SimulatorExperienceProps {
  simulator: SimulatorDefinition;
  onNavigate: (href: string) => void;
}

const FIXED_BENEFITS = [
  {
    icon: Calculator,
    title: "Estimativa inicial",
    text: "Triagem objetiva para organizar o caso e decidir o proximo passo.",
  },
  {
    icon: Shield,
    title: "Fluxo guiado",
    text: "Perguntas curtas para reduzir ruído e melhorar a leitura inicial.",
  },
  {
    icon: Users,
    title: "Escalada humana",
    text: "Quando fizer sentido, o caminho final continua sendo atendimento com a equipe.",
  },
];

export default function SimulatorExperience({
  simulator,
  onNavigate,
}: SimulatorExperienceProps) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<SimulatorFormValues>(simulator.initialValues);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [caseSummary, setCaseSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulatorOutcome | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [similarCases, setSimilarCases] = useState<CaseComparisonItem[]>([]);
  const [casesLoading, setCasesLoading] = useState(false);
  const [comparison, setComparison] = useState<CaseComparisonInsight | null>(null);
  const [durationStats, setDurationStats] = useState<CaseDurationStats | null>(null);
  const [comparisonError, setComparisonError] = useState("");
  const stepRef = useRef(step);
  const showResultRef = useRef(showResult);

  const totalSteps = simulator.steps.length + 1;
  const progressLabels = [...simulator.stepLabels, "Contato"];
  const currentStep = simulator.steps[step];

  useEffect(() => {
    stepRef.current = step;
    showResultRef.current = showResult;
  }, [step, showResult]);

  useEffect(() => {
    trackEvent("iniciou_simulador", {
      simulator_slug: simulator.slug,
      simulator_nome: simulator.name,
    });

    return () => {
      if (!showResultRef.current && stepRef.current > 0) {
        trackEvent("abandonou_etapa", {
          simulator_slug: simulator.slug,
          simulator_nome: simulator.name,
          etapa_atual: stepRef.current,
        });
      }
    };
  }, [simulator.slug, simulator.name]);

  const handleValueChange = (fieldId: string, value: SimulatorValue) => {
    setValues((current) => ({ ...current, [fieldId]: value }));
  };

  const handleStepNext = () => {
    trackEvent("avancou_etapa", {
      simulator_slug: simulator.slug,
      simulator_nome: simulator.name,
      etapa_atual: currentStep?.id ?? "contato",
      proxima_etapa: simulator.steps[step + 1]?.id ?? "contato",
    });
    setStep((current) => current + 1);
  };

  const handleStepBack = () => {
    setStep((current) => Math.max(current - 1, 0));
  };

  const fetchComparison = async (computed: SimulatorOutcome, summary: string) => {
    if (!simulator.supportsPublicCaseComparison) {
      setSimilarCases([]);
      setComparison(null);
      setDurationStats(null);
      return;
    }

    const comparisonTags = computed.comparisonTags ?? [];
    if (!summary.trim() && comparisonTags.length === 0) {
      return;
    }

    setCasesLoading(true);
    setComparisonError("");

    try {
      const data = await fetchCaseComparison({
        tags: comparisonTags,
        summary,
        limit: 5,
        context: {
          source: "simulator",
          simulator: simulator.slug,
          score: computed.score,
          classification: computed.classification,
        },
      });

      setSimilarCases(data.cases || []);
      setComparison(data.comparison ?? null);
      setDurationStats(data.durationStats ?? null);
    } catch (error) {
      console.error("Erro ao buscar comparacao publica:", error);
      setSimilarCases([]);
      setComparison(null);
      setDurationStats(null);
      setComparisonError(
        "Nao consegui comparar este caso com a base publica agora. Tente novamente em instantes."
      );
    } finally {
      setCasesLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const computed = simulator.computeResult(values, { caseSummary });
    setResult(computed);
    let leadSaved = false;

    try {
      await saveSimulatorLead({
        simulator,
        values,
        result: computed,
        lead: {
          name,
          whatsapp,
          email,
          caseSummary,
        },
      });
      leadSaved = true;
    } catch {
      // Falha silenciosa para nao travar a experiencia principal.
    }

    trackEvent("enviou_lead", {
      simulator_slug: simulator.slug,
      simulator_nome: simulator.name,
      lead_salvo: leadSaved,
      score: computed.score,
      lead_priority: computed.leadPriority,
    });

    setLoading(false);
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    await fetchComparison(computed, caseSummary.trim());
    trackEvent("visualizou_resultado", {
      simulator_slug: simulator.slug,
      simulator_nome: simulator.name,
      lead_salvo: leadSaved,
      score: computed.score,
      lead_priority: computed.leadPriority,
      confidence_score: computed.confidenceScore,
    });
  };

  const handleReset = () => {
    setStep(0);
    setValues(simulator.initialValues);
    setName("");
    setWhatsapp("");
    setEmail("");
    setCaseSummary("");
    setLoading(false);
    setResult(null);
    setShowResult(false);
    setSimilarCases([]);
    setCasesLoading(false);
    setComparison(null);
    setDurationStats(null);
    setComparisonError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page-frame pt-16 md:pt-20">
      <section className="section-spacing">
        <div className="container-custom">
          {!showResult ? (
            <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
              <div className="space-y-6">
                <div className="surface-panel p-7 md:p-8">
                  <span className="eyebrow">{simulator.eyebrow ?? "simulador juridico"}</span>
                  <h1 className="mt-6">{simulator.heroTitle}</h1>
                  <p className="mt-6 text-lg">{simulator.heroDescription}</p>
                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {FIXED_BENEFITS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.title}
                          className="rounded-3xl border border-white/10 bg-white/5 p-4"
                        >
                          <Icon className="h-5 w-5 text-emerald-400" />
                          <p className="mt-4 text-sm font-semibold text-white">
                            {item.title}
                          </p>
                          <p className="mt-2 text-xs leading-6 text-slate-400">
                            {item.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="surface-card p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-amber-300" />
                    <div>
                      <p className="text-sm font-semibold text-amber-200">
                        Quando faz sentido usar
                      </p>
                      <div className="mt-2 space-y-2">
                        {simulator.introBullets.map((item) => (
                          <p key={item} className="text-sm leading-7">
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="surface-panel p-6 md:p-8">
                <ProgressBar
                  currentStep={step}
                  totalSteps={totalSteps}
                  stepLabels={progressLabels}
                />

                {currentStep ? (
                  <SimulatorQuestionStep
                    step={currentStep}
                    values={values}
                    onChange={handleValueChange}
                    onNext={handleStepNext}
                    onBack={handleStepBack}
                    isFirstStep={step === 0}
                  />
                ) : (
                  <StepContact
                    name={name}
                    whatsapp={whatsapp}
                    email={email}
                    caseSummary={caseSummary}
                    onNameChange={setName}
                    onWhatsappChange={setWhatsapp}
                    onEmailChange={setEmail}
                    onCaseSummaryChange={setCaseSummary}
                    onSubmit={handleSubmit}
                    onBack={handleStepBack}
                    loading={loading}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl">
              <ResultsPanel
                simulator={simulator}
                result={result as SimulatorOutcome}
                similarCases={similarCases}
                casesLoading={casesLoading}
                comparison={comparison}
                durationStats={durationStats}
                comparisonError={comparisonError}
                onReset={handleReset}
                onNavigate={onNavigate}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
