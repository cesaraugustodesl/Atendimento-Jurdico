import { useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
} from "lucide-react";
import { buildWhatsAppLink, siteConfig, type Page } from "../config/site";

interface ContactProps {
  onNavigate: (page: Page) => void;
}

export default function Contact({ onNavigate }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    area: "",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const areas = useMemo(
    () => [
      "Consumidor",
      "Trabalhista",
      "Familia",
      "Contratos",
      "Saude",
      "Golpes e fraudes",
      "Outro assunto",
    ],
    []
  );

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (formData.name.trim().length < 2) {
      nextErrors.name = "Informe seu nome completo.";
    }

    if (formData.whatsapp.replace(/\D/g, "").length < 10) {
      nextErrors.whatsapp = "Informe um WhatsApp valido.";
    }

    if (formData.email.trim()) {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      if (!isValidEmail) {
        nextErrors.email = "Digite um e-mail valido ou deixe o campo em branco.";
      }
    }

    if (!formData.area) {
      nextErrors.area = "Selecione a area principal do caso.";
    }

    if (formData.message.trim().length < 12) {
      nextErrors.message = "Descreva o contexto com um pouco mais de detalhe.";
    }

    if (!formData.consent) {
      nextErrors.consent =
        "Voce precisa concordar com o tratamento dos dados para continuar.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleWhatsAppSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const message = [
      "Olá, gostaria de solicitar uma análise.",
      "",
      `Nome: ${formData.name}`,
      `WhatsApp: ${formData.whatsapp}`,
      `E-mail: ${formData.email || "nao informado"}`,
      `Area: ${formData.area}`,
      "Resumo do caso:",
      formData.message,
    ].join("\n");

    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <div className="pt-16 md:pt-20">
      <section className="section-spacing">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="surface-panel p-7 md:p-9">
              <span className="eyebrow">contato e qualificacao</span>
              <h1 className="mt-6">
                Se voce ja quer atendimento humano, esta pagina deve ser o ponto
                de entrada.
              </h1>
              <p className="mt-6 max-w-2xl text-lg">
                A proposta aqui e simples: voce deixa o minimo necessario para
                qualificar o caso e segue para o WhatsApp com a mensagem pronta,
                sem formulario falso e sem prometer automacao que nao existe.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  {
                    icon: Calendar,
                    title: "Consulta",
                    text: "Para estrategia, documento e definicao do proximo movimento.",
                  },
                  {
                    icon: Shield,
                    title: "Sigilo",
                    text: "Coleta inicial enxuta, com foco em contexto e triagem.",
                  },
                  {
                    icon: MessageSquare,
                    title: "WhatsApp",
                    text: "Depois do envio, o contato continua em canal mais direto.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <Icon className="w-5 h-5 text-sky-400" />
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

            <div className="surface-card p-7 md:p-9">
              <span className="eyebrow">rota recomendada</span>
              <h2 className="section-title mt-5">
                Antes da consulta, vale decidir se voce precisa de triagem ou
                de estrategia.
              </h2>
              <div className="mt-8 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-white">
                    Use o Chat IA se:
                  </p>
                  <p className="mt-2 text-sm leading-6">
                    voce ainda esta entendendo o problema e quer organizar fatos,
                    perguntas e documentos antes do contato humano.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold text-white">
                    Use o Simulador se:
                  </p>
                  <p className="mt-2 text-sm leading-6">
                    a sua duvida e trabalhista e voce quer uma faixa inicial de
                    risco ou valor possivel antes da consulta.
                  </p>
                </div>
                <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5">
                  <p className="text-sm font-semibold text-red-300">
                    Va direto para contato se:
                  </p>
                  <p className="mt-2 text-sm leading-6">
                    ha prazo correndo, notificacao formal, risco urgente,
                    violencia, saude ou necessidade de estrategia imediata.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => onNavigate("chat")}
                  className="btn-secondary flex-1"
                >
                  Ir para o chat
                </button>
                <button
                  onClick={() => onNavigate("simulator")}
                  className="btn-secondary flex-1"
                >
                  Abrir simulador
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <form onSubmit={handleWhatsAppSubmit} className="surface-panel p-7 md:p-9">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="eyebrow">agendar pelo WhatsApp</span>
                  <h2 className="section-title mt-5">
                    Deixe o contexto minimo e siga com a mensagem pronta.
                  </h2>
                </div>
                {submitted && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    WhatsApp aberto
                  </div>
                )}
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-sky-400/50"
                    placeholder="Seu nome"
                  />
                  {errors.name && (
                    <p className="mt-2 text-xs text-red-300">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsapp: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-sky-400/50"
                    placeholder="(11) 99999-9999"
                  />
                  {errors.whatsapp && (
                    <p className="mt-2 text-xs text-red-300">{errors.whatsapp}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-sky-400/50"
                    placeholder="seuemail@exemplo.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-xs text-red-300">{errors.email}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Area principal do caso
                  </label>
                  <select
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-sky-400/50"
                  >
                    <option value="">Selecione uma area</option>
                    {areas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  {errors.area && (
                    <p className="mt-2 text-xs text-red-300">{errors.area}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Resuma o caso
                  </label>
                  <textarea
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-sky-400/50"
                    placeholder="Explique o que aconteceu, o que mais te preocupa e se existe alguma urgencia."
                  />
                  {errors.message && (
                    <p className="mt-2 text-xs text-red-300">{errors.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
                <label className="flex items-start gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) =>
                      setFormData({ ...formData, consent: e.target.checked })
                    }
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-950 text-sky-500"
                  />
                  <span>
                    Concordo com o tratamento inicial dos dados conforme a{" "}
                    <button
                      type="button"
                      onClick={() => onNavigate("privacy")}
                      className="text-sky-300 hover:text-sky-200"
                    >
                      Politica de Privacidade
                    </button>{" "}
                    e os{" "}
                    <button
                      type="button"
                      onClick={() => onNavigate("terms")}
                      className="text-sky-300 hover:text-sky-200"
                    >
                      Termos de Uso
                    </button>
                    .
                  </span>
                </label>
                {errors.consent && (
                  <p className="mt-2 text-xs text-red-300">{errors.consent}</p>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="submit" className="btn-primary flex-1">
                  <MessageSquare className="w-5 h-5" />
                  Continuar no WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("chat")}
                  className="btn-secondary flex-1"
                >
                  Prefiro passar pela triagem IA
                </button>
              </div>
            </form>

            <div className="space-y-6">
              <div className="surface-card p-7 md:p-8">
                <span className="eyebrow">informacoes de contato</span>
                <div className="mt-6 space-y-5 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-sky-400" />
                    <span>{siteConfig.contact.addressFull}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 flex-shrink-0 text-sky-400" />
                    <span>{siteConfig.contact.phoneDisplay}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 flex-shrink-0 text-sky-400" />
                    <span>{siteConfig.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 flex-shrink-0 text-sky-400" />
                    <span>{siteConfig.contact.officeHours}</span>
                  </div>
                </div>
              </div>

              <div className="surface-panel p-7 md:p-8">
                <span className="eyebrow">nota importante</span>
                <h2 className="section-title mt-5">
                  Este fluxo nao substitui consulta juridica formal.
                </h2>
                <p className="section-lead">
                  O objetivo aqui e reduzir atrito no primeiro contato. A
                  confirmacao da tese, a leitura de documentos e a estrategia
                  continuam dependendo de atendimento humano.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
