import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clipboard,
  FileText,
  Heart,
  MessageSquare,
  Send,
  Shield,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Stethoscope,
  Briefcase,
} from "lucide-react";
import {
  buildMessage,
  categoryQuestions,
  getCategoryKey,
} from "../utils/questionsTemplates";
import RouteLink from "../components/RouteLink";
import { pagePaths } from "../config/site";
import SimilarCases from "../components/simulator/SimilarCases";
import {
  fetchCaseComparison,
  type CaseComparisonInsight,
  type CaseComparisonItem,
  type CaseDurationStats,
} from "../lib/caseComparison";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatProps {
  onNavigate: (href: string) => void;
}

type FlowStep = "consent" | "category" | "questions" | "conversation";

const quickSuggestions = [
  { icon: ShoppingCart, text: "Cobrança indevida", accent: "border-sky-400/20 bg-sky-500/10" },
  { icon: Briefcase, text: "Demissão e verbas", accent: "border-amber-400/20 bg-amber-500/10" },
  { icon: Heart, text: "Pensão alimentícia", accent: "border-pink-400/20 bg-pink-500/10" },
  { icon: Stethoscope, text: "Plano de saúde", accent: "border-emerald-400/20 bg-emerald-500/10" },
  { icon: Smartphone, text: "Golpe ou fraude", accent: "border-violet-400/20 bg-violet-500/10" },
  { icon: FileText, text: "Problema com contrato", accent: "border-slate-300/20 bg-white/5" },
];

const categoryTagMap: Record<string, string[]> = {
  cobranca: [],
  demissao: [
    "demissaoProblematica",
    "fgtsNaoPago",
    "horasExtrasNaoPagas",
    "tempoMaisTresAnos",
  ],
  pensao: [],
  plano_saude: [],
  golpe: [],
  contrato: [],
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function getSectionIcon(title: string) {
  const normalized = normalizeText(title);

  if (normalized.includes("RESUMO")) {
    return <FileText className="w-5 h-5 text-sky-400" />;
  }

  if (normalized.includes("PERGUNTAS")) {
    return <MessageSquare className="w-5 h-5 text-sky-400" />;
  }

  if (normalized.includes("ATENCAO")) {
    return <AlertTriangle className="w-5 h-5 text-amber-300" />;
  }

  if (normalized.includes("DOCUMENTOS") || normalized.includes("PROXIMOS PASSOS")) {
    return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
  }

  return <Sparkles className="w-5 h-5 text-sky-400" />;
}

export default function Chat({ onNavigate }: ChatProps) {
  const [flowStep, setFlowStep] = useState<FlowStep>("consent");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [composerValue, setComposerValue] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [caseSummary, setCaseSummary] = useState("");
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState("");
  const [similarCases, setSimilarCases] = useState<CaseComparisonItem[]>([]);
  const [comparison, setComparison] = useState<CaseComparisonInsight | null>(null);
  const [durationStats, setDurationStats] = useState<CaseDurationStats | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, flowStep, isSending]);

  const currentQuestion =
    selectedCategory && categoryQuestions[selectedCategory]
      ? categoryQuestions[selectedCategory].questions[currentQuestionIndex]
      : null;

  const currentAnswer = currentQuestion ? answers[currentQuestion.id] ?? "" : "";
  const canProceed = currentAnswer.trim().length > 0;
  const supportsPublicCaseComparison = selectedCategory === "demissao";

  const handleCategorySelect = (categoryText: string) => {
    setSelectedCategory(getCategoryKey(categoryText));
    setAnswers({});
    setCurrentQuestionIndex(0);
    setFlowStep("questions");
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const sendConversation = async (conversation: Message[]) => {
    setIsSending(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-juridico`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            messages: conversation.map((message) => ({
              role: message.role,
              content: message.content,
            })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Nao foi possivel processar a mensagem.");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Erro no chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Nao consegui processar sua mensagem agora. Tente novamente em alguns instantes ou siga para contato humano.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const runCaseComparison = async (
    summary: string,
    conversation: Message[]
  ) => {
    setComparisonLoading(true);
    setComparisonError("");

    try {
      const data = await fetchCaseComparison({
        tags: categoryTagMap[selectedCategory] ?? [],
        summary,
        limit: 5,
        context: {
          source: "chat",
          category: selectedCategory,
          categoryLabel: categoryQuestions[selectedCategory]?.category ?? "",
          userMessages: conversation
            .filter((message) => message.role === "user")
            .map((message) => message.content)
            .join("\n\n")
            .slice(0, 2200),
        },
      });

      setSimilarCases(data.cases || []);
      setComparison(data.comparison ?? null);
      setDurationStats(data.durationStats ?? null);
    } catch (error) {
      console.error("Erro ao comparar casos:", error);
      setSimilarCases([]);
      setComparison(null);
      setDurationStats(null);
      setComparisonError(
        "Nao consegui comparar esse caso com a base publica agora. Tente novamente em instantes."
      );
    } finally {
      setComparisonLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    const category = categoryQuestions[selectedCategory];
    if (!category) {
      return;
    }

    if (currentQuestionIndex < category.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      return;
    }

    const messageText = buildMessage(selectedCategory, answers);
    const summarySeed =
      (answers.detalhes ?? "").trim() ||
      category.questions
        .map((question) => {
          const answer = answers[question.id]?.trim();
          return answer ? `${question.text}: ${answer}` : "";
        })
        .filter(Boolean)
        .join("\n");

    setCaseSummary(summarySeed);
    const initialMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages([initialMessage]);
    setFlowStep("conversation");
    if (selectedCategory === "demissao" && summarySeed.trim()) {
      await Promise.all([
        sendConversation([initialMessage]),
        runCaseComparison(summarySeed.trim(), [initialMessage]),
      ]);
      return;
    }

    await sendConversation([initialMessage]);
  };

  const handleFollowUp = async () => {
    const trimmed = composerValue.trim();
    if (!trimmed || isSending) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    const nextConversation = [...messages, userMessage];
    const nextSummary = [caseSummary.trim(), trimmed].filter(Boolean).join("\n");
    setMessages(nextConversation);
    setComposerValue("");
    if (supportsPublicCaseComparison) {
      setCaseSummary(nextSummary);
      await Promise.all([
        sendConversation(nextConversation),
        runCaseComparison(nextSummary, nextConversation),
      ]);
      return;
    }

    await sendConversation(nextConversation);
  };

  const handleCopyMessage = async (message: Message) => {
    await navigator.clipboard.writeText(message.content);
    setCopiedId(message.id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  const resetChat = () => {
    setSelectedCategory("");
    setAnswers({});
    setCurrentQuestionIndex(0);
    setMessages([]);
    setComposerValue("");
    setIsSending(false);
    setCaseSummary("");
    setComparisonLoading(false);
    setComparisonError("");
    setSimilarCases([]);
    setComparison(null);
    setDurationStats(null);
    setFlowStep(consentGiven ? "category" : "consent");
  };

  const formatAssistantMessage = (content: string) => {
    const lines = content.split("\n");

    return lines.map((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return <div key={index} className="h-3" />;
      }

      if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        const title = trimmed.replace(/\*\*/g, "");
        return (
          <div
            key={index}
            className="mt-7 mb-3 flex items-center gap-3 border-t border-white/10 pt-5 first:mt-0 first:border-t-0 first:pt-0"
          >
            {getSectionIcon(title)}
            <h4 className="text-xl font-bold text-white">{title}</h4>
          </div>
        );
      }

      return (
        <p key={index} className="text-sm leading-7 text-slate-300">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="page-frame pt-16 md:pt-20">
      <section className="section-spacing">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-6">
              <div className="surface-panel p-7 md:p-8">
                <span className="eyebrow">chat juridico guiado</span>
                <h1 className="mt-6">
                  O chat agora funciona como triagem acompanhada, nao como bloco
                  isolado.
                </h1>
                <p className="mt-6 text-lg">
                  Primeiro voce escolhe a area, responde perguntas objetivas e
                  recebe uma primeira leitura organizada. Depois, pode mandar
                  follow-up e manter a conversa ativa.
                </p>
                <div className="mt-8 space-y-3 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <Shield className="mt-1 h-5 w-5 flex-shrink-0 text-sky-400" />
                    <span>Fluxo de triagem antes da conversa livre.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="mt-1 h-5 w-5 flex-shrink-0 text-sky-400" />
                    <span>Resumo enviado pelo usuario fica visivel na tela.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-1 h-5 w-5 flex-shrink-0 text-sky-400" />
                    <span>
                      Se a IA nao bastar, o proximo passo natural e contato
                      humano.
                    </span>
                  </div>
                </div>
              </div>

              <div className="surface-card p-6">
                <p className="text-sm font-semibold text-white">
                  Como esse fluxo ficou organizado
                </p>
                <div className="mt-4 grid gap-3">
                  {[
                    "1. aceite e escolha da area",
                    "2. perguntas curtas para contexto",
                    "3. resposta estruturada da IA",
                    "4. follow-up e escalada para atendimento humano",
                  ].map((step) => (
                    <div
                      key={step}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="surface-panel p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                    fluxo do chat
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {flowStep === "consent" && "Etapa 1 · aceite e contexto"}
                    {flowStep === "category" && "Etapa 2 · escolha da area"}
                    {flowStep === "questions" && "Etapa 3 · perguntas guiadas"}
                    {flowStep === "conversation" && "Etapa 4 · conversa ativa"}
                  </p>
                </div>
                {flowStep === "conversation" && (
                  <button onClick={resetChat} className="btn-secondary px-4 py-2 text-sm min-h-0">
                    Nova analise
                  </button>
                )}
              </div>

              {flowStep === "consent" && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <h2 className="text-2xl font-bold text-white">
                      Antes de comecar
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-slate-300">
                      Este chat foi redesenhado para triagem inicial. Ele ajuda a
                      entender melhor o contexto, mas nao substitui consulta
                      juridica formal.
                    </p>
                    <label className="mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={consentGiven}
                        onChange={(e) => setConsentGiven(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-950 text-sky-500"
                      />
                      <span>
                        Li o aviso e concordo em usar esta triagem inicial de
                        forma informativa.
                      </span>
                    </label>
                  </div>
                  <button
                    onClick={() => setFlowStep("category")}
                    disabled={!consentGiven}
                    className={`w-full rounded-2xl px-6 py-4 font-semibold ${
                      consentGiven
                        ? "bg-gradient-to-r from-sky-500 to-blue-700 text-white"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    Continuar
                  </button>
                </div>
              )}

              {flowStep === "category" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Qual tema melhor descreve sua duvida?
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      Escolher a area primeiro melhora a qualidade da triagem e
                      evita resposta generica demais.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {quickSuggestions.map((suggestion) => {
                      const Icon = suggestion.icon;
                      return (
                        <button
                          key={suggestion.text}
                          onClick={() => handleCategorySelect(suggestion.text)}
                          className={`rounded-3xl border p-5 text-left transition-transform hover:-translate-y-1 ${suggestion.accent}`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                          <p className="mt-5 text-base font-semibold text-white">
                            {suggestion.text}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {flowStep === "questions" && currentQuestion && (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
                      {categoryQuestions[selectedCategory].category}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white">
                      {currentQuestion.text}
                    </h2>
                    <div className="mt-4 h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"
                        style={{
                          width: `${((currentQuestionIndex + 1) /
                            categoryQuestions[selectedCategory].questions.length) *
                            100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {currentQuestion.type === "choice" && currentQuestion.options && (
                    <div className="grid gap-3">
                      {currentQuestion.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswer(currentQuestion.id, option)}
                          className={`rounded-2xl border px-4 py-4 text-left text-sm transition-colors ${
                            currentAnswer === option
                              ? "border-sky-400/40 bg-sky-500/10 text-white"
                              : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === "yesno" && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {["Sim", "Não"].map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswer(currentQuestion.id, option)}
                          className={`rounded-2xl border px-4 py-4 text-center text-sm font-semibold transition-colors ${
                            currentAnswer === option
                              ? "border-sky-400/40 bg-sky-500/10 text-white"
                              : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === "text" && (
                    <textarea
                      rows={5}
                      value={currentAnswer}
                      onChange={(e) =>
                        handleAnswer(currentQuestion.id, e.target.value)
                      }
                      placeholder="Escreva com suas palavras. Quanto mais claro o contexto, melhor a resposta."
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 text-white placeholder-slate-500 outline-none focus:border-sky-400/50"
                    />
                  )}

                  <div className="flex gap-3">
                    {currentQuestionIndex > 0 && (
                      <button onClick={() => setCurrentQuestionIndex((prev) => prev - 1)} className="btn-secondary flex-1">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                      </button>
                    )}
                    <button
                      onClick={handleNextQuestion}
                      disabled={!canProceed}
                      className={`flex-1 rounded-2xl px-6 py-4 font-semibold ${
                        canProceed
                          ? "bg-gradient-to-r from-sky-500 to-blue-700 text-white"
                          : "bg-slate-800 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      {currentQuestionIndex <
                      categoryQuestions[selectedCategory].questions.length - 1 ? (
                        <span className="inline-flex items-center gap-2">
                          Proxima pergunta
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          Enviar para a IA
                          <Send className="w-4 h-4" />
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {flowStep === "conversation" && (
                <div className="space-y-5">
                  <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
                    A resposta abaixo e uma triagem inicial. Use o botao de
                    contato se precisar transformar isso em estrategia juridica
                    formal.
                  </div>

                  <div className="max-h-[42rem] space-y-4 overflow-y-auto pr-1">
                    {messages.map((message) =>
                      message.role === "user" ? (
                        <div key={message.id} className="chat-message flex justify-end">
                          <div className="max-w-[85%] rounded-3xl border border-sky-400/20 bg-sky-500/10 px-5 py-4 text-sm leading-7 text-slate-100">
                            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-sky-300">
                              Sua mensagem
                            </p>
                            <pre className="whitespace-pre-wrap font-sans text-sm leading-7">
                              {message.content}
                            </pre>
                          </div>
                        </div>
                      ) : (
                        <div key={message.id} className="chat-message">
                          <div className="rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-5">
                            <div className="mb-4 flex items-center justify-between gap-4">
                              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                Resposta da IA
                              </p>
                              <button
                                onClick={() => handleCopyMessage(message)}
                                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white"
                              >
                                <Clipboard className="w-4 h-4" />
                                {copiedId === message.id ? "Copiado" : "Copiar"}
                              </button>
                            </div>
                            <div className="space-y-2">
                              {formatAssistantMessage(message.content)}
                            </div>
                          </div>
                        </div>
                      )
                    )}

                    {isSending && (
                      <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
                        Analisando sua mensagem...
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
                    <textarea
                      rows={4}
                      value={composerValue}
                      onChange={(e) => setComposerValue(e.target.value)}
                      placeholder="Se quiser, faca uma pergunta complementar ou detalhe algum ponto do caso."
                      className="w-full resize-none bg-transparent text-sm leading-7 text-white placeholder-slate-500 outline-none"
                    />
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={handleFollowUp}
                        disabled={composerValue.trim().length === 0 || isSending}
                        className={`flex-1 rounded-2xl px-6 py-3 font-semibold ${
                          composerValue.trim().length > 0 && !isSending
                            ? "bg-gradient-to-r from-sky-500 to-blue-700 text-white"
                            : "bg-slate-800 text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        Enviar follow-up
                      </button>
                      <RouteLink
                        href={pagePaths.contact}
                        onNavigate={onNavigate}
                        className="btn-secondary flex-1"
                      >
                        Levar para atendimento humano
                      </RouteLink>
                    </div>
                  </div>

                  {supportsPublicCaseComparison ? (
                    <>
                      {comparisonError ? (
                        <div className="surface-card p-5 md:p-6">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-red-300" />
                            <div>
                              <h3 className="text-xl font-bold text-white">
                                Nao consegui montar a comparacao publica
                              </h3>
                              <p className="mt-3 text-sm leading-7 text-slate-300">
                                {comparisonError}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      <SimilarCases
                        cases={similarCases}
                        loading={comparisonLoading}
                        comparison={comparison}
                        durationStats={durationStats}
                        title="Casos publicos comparaveis"
                        subtitle="Comparacao montada a partir do resumo que voce escreveu na triagem e das mensagens do fluxo trabalhista."
                      />
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
