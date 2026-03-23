import { FileText, Mail, Phone, Shield, User } from "lucide-react";

interface StepContactProps {
  name: string;
  whatsapp: string;
  email: string;
  caseSummary: string;
  onNameChange: (value: string) => void;
  onWhatsappChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onCaseSummaryChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function StepContact({
  name,
  whatsapp,
  email,
  caseSummary,
  onNameChange,
  onWhatsappChange,
  onEmailChange,
  onCaseSummaryChange,
  onSubmit,
  onBack,
  loading,
}: StepContactProps) {
  const isValid = name.trim().length >= 2 && whatsapp.replace(/\D/g, "").length >= 10;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white">
          Falta pouco. Conte o caso e diga para quem devemos preparar o resultado.
        </h3>
        <p className="mt-2 text-sm leading-7 text-slate-400">
          Seu relato entra junto na triagem. Os dados de contato servem para
          identificar a simulacao e facilitar o proximo passo com atendimento
          humano, se voce quiser.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <FileText className="w-4 h-4 text-sky-400" />
            Resuma o que aconteceu
          </label>
          <textarea
            rows={5}
            value={caseSummary}
            onChange={(e) => onCaseSummaryChange(e.target.value)}
            placeholder="Exemplo: trabalhei por 4 anos, fazia horas extras quase todos os dias, fui demitido sem receber corretamente FGTS e verbas rescisorias..."
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 text-white placeholder-slate-500 outline-none focus:border-sky-400/50"
          />
          <p className="mt-2 text-xs leading-6 text-slate-500">
            Esse resumo entra junto na triagem e melhora a leitura do caso. Em
            alguns fluxos, ele tambem ajuda a comparar o relato com bases
            publicas semelhantes.
          </p>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <User className="w-4 h-4 text-sky-400" />
            Nome completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Seu nome"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 text-white placeholder-slate-500 outline-none focus:border-sky-400/50"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <Phone className="w-4 h-4 text-emerald-400" />
            WhatsApp principal
          </label>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => onWhatsappChange(formatPhone(e.target.value))}
            placeholder="(11) 99999-9999"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 text-white placeholder-slate-500 outline-none focus:border-sky-400/50"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <Mail className="w-4 h-4 text-amber-300" />
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="seuemail@exemplo.com"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 text-white placeholder-slate-500 outline-none focus:border-sky-400/50"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-start gap-3">
          <Shield className="mt-1 h-4 w-4 flex-shrink-0 text-sky-400" />
          <p className="text-xs leading-6 text-slate-400">
            Esta etapa existe para amarrar a triagem a uma pessoa real. O
            simulador continua sendo uma leitura inicial, nao um parecer final.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-secondary flex-1">
          Voltar
        </button>
        <button
          onClick={onSubmit}
          disabled={!isValid || loading}
          className={`flex-1 rounded-2xl px-6 py-4 font-semibold ${
            isValid && !loading
              ? "bg-gradient-to-r from-emerald-500 to-emerald-700 text-white"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          {loading ? "Calculando..." : "Ver resultado"}
        </button>
      </div>
    </div>
  );
}
