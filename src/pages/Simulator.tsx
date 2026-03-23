import { useState } from "react";
import { AlertTriangle, Calculator, Shield, Users } from "lucide-react";
import ProgressBar from "../components/simulator/ProgressBar";
import StepSegmentation from "../components/simulator/StepSegmentation";
import StepEmployment from "../components/simulator/StepEmployment";
import StepViolations from "../components/simulator/StepViolations";
import StepContact from "../components/simulator/StepContact";
import ResultsPanel from "../components/simulator/ResultsPanel";
import type { CaseData } from "../components/simulator/SimilarCases";
import { supabase } from "../lib/supabase";
import {
  computeResult,
  type ContractType,
  type Violations,
  type SimulatorResult,
} from "../utils/laborCalculator";

interface SimulatorProps {
  onNavigate: (href: string) => void;
}

const INITIAL_VIOLATIONS: Violations = {
  horasExtrasNaoPagas: false,
  domingosFeriados: false,
  intervaloIrregular: false,
  trabalhoNoturno: false,
  insalubridade: false,
  fgtsNaoPago: false,
  demissaoProblematica: false,
  tempoMaisTresAnos: false,
};

const TOTAL_STEPS = 4;

export default function Simulator({ onNavigate }: SimulatorProps) {
  const [step, setStep] = useState(0);
  const [contractType, setContractType] = useState<ContractType | "">("");
  const [salary, setSalary] = useState(0);
  const [yearsWorked, setYearsWorked] = useState(0);
  const [violations, setViolations] = useState<Violations>(INITIAL_VIOLATIONS);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulatorResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [similarCases, setSimilarCases] = useState<CaseData[]>([]);
  const [casesLoading, setCasesLoading] = useState(false);

  const fetchSimilarCases = async (activeViolations: string[]) => {
    setCasesLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/buscar-jurisprudencia`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags: activeViolations, limit: 5 }),
      });

      if (response.ok) {
        const data = await response.json();
        setSimilarCases(data.cases || []);
      }
    } catch {
      setSimilarCases([]);
    } finally {
      setCasesLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!contractType) {
      return;
    }

    setLoading(true);

    const formData = {
      contractType: contractType as ContractType,
      salary,
      yearsWorked,
      violations,
      name,
      whatsapp,
      email,
    };

    const computed = computeResult(formData);
    setResult(computed);

    const activeViolationTags = Object.entries(violations)
      .filter(([, value]) => value)
      .map(([key]) => key);

    try {
      await supabase.from("labor_leads").insert({
        name,
        whatsapp,
        email,
        contract_type: contractType,
        salary,
        years_worked: yearsWorked,
        violations,
        score: computed.score,
        classification: computed.classification,
        estimate_min: computed.estimateMin,
        estimate_max: computed.estimateMax,
      });
    } catch {
      // Falha silenciosa para nao travar a experiencia.
    }

    setLoading(false);
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (activeViolationTags.length > 0) {
      fetchSimilarCases(activeViolationTags);
    }
  };

  const handleReset = () => {
    setStep(0);
    setContractType("");
    setSalary(0);
    setYearsWorked(0);
    setViolations(INITIAL_VIOLATIONS);
    setName("");
    setWhatsapp("");
    setEmail("");
    setResult(null);
    setShowResult(false);
    setSimilarCases([]);
    setCasesLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextStep = () => setStep((current) => Math.min(current + 1, TOTAL_STEPS - 1));
  const prevStep = () => setStep((current) => Math.max(current - 1, 0));

  return (
    <div className="page-frame pt-16 md:pt-20">
      <section className="section-spacing">
        <div className="container-custom">
          {!showResult ? (
            <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
              <div className="space-y-6">
                <div className="surface-panel p-7 md:p-8">
                  <span className="eyebrow">simulador trabalhista</span>
                  <h1 className="mt-6">
                    Use este fluxo quando a pergunta central for: existe direito
                    trabalhista nao pago aqui?
                  </h1>
                  <p className="mt-6 text-lg">
                    O simulador nao promete valor exato. Ele organiza sinais de
                    risco, gera uma faixa estimada e indica se faz sentido levar
                    o caso para analise humana.
                  </p>
                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {[
                      {
                        icon: Calculator,
                        title: "Estimativa inicial",
                        text: "Leitura rapida para orientar a decisao, nao para fechar calculo pericial.",
                      },
                      {
                        icon: Shield,
                        title: "Triagem objetiva",
                        text: "Perguntas curtas para medir contrato, tempo e violacoes.",
                      },
                      {
                        icon: Users,
                        title: "Escalada humana",
                        text: "Se o score justificar, o proximo passo natural e consulta.",
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                          <Icon className="w-5 h-5 text-emerald-400" />
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
                      <p className="mt-2 text-sm leading-7">
                        Demissao, horas extras, FGTS, contrato PJ suspeito,
                        trabalho sem registro, intervalo irregular ou outras
                        violacoes recorrentes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="surface-panel p-6 md:p-8">
                <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

                {step === 0 && (
                  <StepSegmentation
                    value={contractType}
                    onChange={setContractType}
                    onNext={nextStep}
                  />
                )}

                {step === 1 && (
                  <StepEmployment
                    salary={salary}
                    yearsWorked={yearsWorked}
                    onSalaryChange={setSalary}
                    onYearsChange={setYearsWorked}
                    onNext={nextStep}
                    onBack={prevStep}
                  />
                )}

                {step === 2 && (
                  <StepViolations
                    violations={violations}
                    onChange={setViolations}
                    onNext={nextStep}
                    onBack={prevStep}
                    contractType={contractType as string}
                  />
                )}

                {step === 3 && (
                  <StepContact
                    name={name}
                    whatsapp={whatsapp}
                    email={email}
                    onNameChange={setName}
                    onWhatsappChange={setWhatsapp}
                    onEmailChange={setEmail}
                    onSubmit={handleSubmit}
                    onBack={prevStep}
                    loading={loading}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl">
              <ResultsPanel
                result={result as SimulatorResult}
                contractType={contractType as ContractType}
                similarCases={similarCases}
                casesLoading={casesLoading}
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
