"use client";

import { useState } from "react";
import { areas } from "@/lib/areas-data";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    // PREENCHER: integrar com endpoint próprio (API Route / e-mail transacional / CRM).
    // Exemplo:
    // const formData = new FormData(e.currentTarget);
    // await fetch("/api/contato", { method: "POST", body: formData });

    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="border border-hairline-dark p-10 text-center">
        <p className="code-label mb-4 justify-center">Mensagem enviada</p>
        <p className="font-display text-2xl text-ink mb-2">
          Recebemos sua solicitação.
        </p>
        <p className="text-mist text-sm max-w-md mx-auto">
          Entraremos em contato o quanto antes para dar continuidade ao seu
          atendimento. Se o assunto for urgente, utilize o WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Field label="Nome completo" name="nome" required autoComplete="name" />
      <Field label="WhatsApp" name="whatsapp" type="tel" required autoComplete="tel" />
      <Field label="E-mail" name="email" type="email" required autoComplete="email" />

      <div className="flex flex-col gap-2">
        <label htmlFor="area" className="code-label">
          Área jurídica
        </label>
        <select
          id="area"
          name="area"
          required
          className="bg-transparent border-b border-ink/25 py-3 text-ink focus:border-bronze outline-none transition-colors"
        >
          <option value="">Selecione</option>
          <option value="direito-criminal">Direito Criminal</option>
          {areas.map((area) => (
            <option key={area.slug} value={area.slug}>
              {area.title}
            </option>
          ))}
          <option value="outro">Outro assunto</option>
        </select>
      </div>

      <Field label="Cidade / Estado" name="cidade" required />
      <div className="md:col-span-2 flex flex-col gap-2">
        <label htmlFor="descricao" className="code-label">
          Breve descrição do caso
        </label>
        <textarea
          id="descricao"
          name="descricao"
          rows={5}
          required
          placeholder="Descreva, de forma resumida, sua situação."
          className="bg-transparent border-b border-ink/25 py-3 text-ink placeholder:text-mist-light
            focus:border-bronze outline-none transition-colors resize-none"
        />
      </div>

      <div className="md:col-span-2 flex items-start gap-3">
        <input
          id="lgpd"
          name="lgpd"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 accent-bronze"
        />
        <label htmlFor="lgpd" className="text-xs text-mist leading-relaxed">
          Autorizo o uso dos meus dados exclusivamente para fins de contato e
          atendimento jurídico, em conformidade com a Lei Geral de Proteção de
          Dados (LGPD).
        </label>
      </div>

      <div className="md:col-span-2">
        <button type="submit" disabled={status === "submitting"} className="btn-primary w-full md:w-auto">
          {status === "submitting" ? "Enviando..." : "Solicitar Atendimento"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="code-label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="bg-transparent border-b border-ink/25 py-3 text-ink
          focus:border-bronze outline-none transition-colors"
      />
    </div>
  );
}
