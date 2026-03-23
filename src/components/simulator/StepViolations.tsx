import {
  Clock,
  Calendar,
  Coffee,
  Moon,
  AlertTriangle,
  Landmark,
  UserX,
  Timer,
} from 'lucide-react';
import type { Violations } from '../../utils/laborCalculator';

interface StepViolationsProps {
  violations: Violations;
  onChange: (violations: Violations) => void;
  onNext: () => void;
  onBack: () => void;
  contractType: string;
}

const VIOLATION_OPTIONS = [
  {
    key: 'horasExtrasNaoPagas' as keyof Violations,
    label: 'Horas extras nao pagas',
    description: 'Trabalhava alem do horario sem receber',
    icon: Clock,
    points: 15,
  },
  {
    key: 'domingosFeriados' as keyof Violations,
    label: 'Domingos e feriados',
    description: 'Trabalhava sem folga compensatoria',
    icon: Calendar,
    points: 10,
  },
  {
    key: 'intervaloIrregular' as keyof Violations,
    label: 'Intervalo irregular',
    description: 'Almoco/descanso menor que 1 hora',
    icon: Coffee,
    points: 10,
  },
  {
    key: 'trabalhoNoturno' as keyof Violations,
    label: 'Trabalho noturno',
    description: 'Apos 22h sem adicional noturno',
    icon: Moon,
    points: 10,
  },
  {
    key: 'insalubridade' as keyof Violations,
    label: 'Insalubridade / Periculosidade',
    description: 'Condicoes de risco sem adicional',
    icon: AlertTriangle,
    points: 10,
  },
  {
    key: 'fgtsNaoPago' as keyof Violations,
    label: 'FGTS nao depositado',
    description: 'Depositos de FGTS ausentes ou irregulares',
    icon: Landmark,
    points: 20,
  },
  {
    key: 'demissaoProblematica' as keyof Violations,
    label: 'Demissao irregular',
    description: 'Verbas rescisorias nao pagas corretamente',
    icon: UserX,
    points: 15,
  },
  {
    key: 'tempoMaisTresAnos' as keyof Violations,
    label: 'Mais de 3 anos na empresa',
    description: 'Maior base de calculo para direitos',
    icon: Timer,
    points: 10,
  },
];

export default function StepViolations({
  violations,
  onChange,
  onNext,
  onBack,
  contractType,
}: StepViolationsProps) {
  const toggleViolation = (key: keyof Violations) => {
    onChange({ ...violations, [key]: !violations[key] });
  };

  const selectedCount = Object.values(violations).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">
          O que acontecia no seu trabalho?
        </h3>
        <p className="text-gray-400">Marque tudo que se aplica ao seu caso</p>
        {contractType === 'pj' && (
          <div className="mt-3 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 inline-block">
            <p className="text-amber-400 text-sm font-medium">
              PJ com subordinacao pode ter vinculo empregaticio reconhecido
            </p>
          </div>
        )}
        {contractType === 'informal' && (
          <div className="mt-3 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 inline-block">
            <p className="text-red-400 text-sm font-medium">
              Trabalho sem registro garante direitos retroativos
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {VIOLATION_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = violations[option.key];
          return (
            <button
              key={option.key}
              onClick={() => toggleViolation(option.key)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-gray-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-bold transition-colors ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                    {option.label}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                </div>
                <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-500'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedCount > 0 && (
        <div className="text-center">
          <span className="text-sm text-emerald-400 font-medium">
            {selectedCount} {selectedCount === 1 ? 'direito selecionado' : 'direitos selecionados'}
          </span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-xl font-bold border-2 border-slate-600 text-gray-400 hover:bg-slate-800 hover:text-white transition-all"
        >
          Voltar
        </button>
        <button
          onClick={onNext}
          disabled={selectedCount === 0}
          className={`flex-1 py-4 rounded-xl font-bold transition-all ${
            selectedCount > 0
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-xl'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          Ver resultado
        </button>
      </div>
    </div>
  );
}
