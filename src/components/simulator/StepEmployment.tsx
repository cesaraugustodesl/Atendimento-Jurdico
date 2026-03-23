import { DollarSign, CalendarDays } from 'lucide-react';

interface StepEmploymentProps {
  salary: number;
  yearsWorked: number;
  onSalaryChange: (value: number) => void;
  onYearsChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepEmployment({
  salary,
  yearsWorked,
  onSalaryChange,
  onYearsChange,
  onNext,
  onBack,
}: StepEmploymentProps) {
  const canAdvance = salary > 0 && yearsWorked > 0;

  const formatSalaryDisplay = (value: number): string => {
    if (value === 0) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleSalaryInput = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    onSalaryChange(Number(digits));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">
          Dados do emprego
        </h3>
        <p className="text-gray-400">Essas informacoes sao usadas para calcular sua estimativa</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Quanto voce recebia por mes? (salario bruto)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={salary > 0 ? formatSalaryDisplay(salary) : ''}
            onChange={(e) => handleSalaryInput(e.target.value)}
            placeholder="Ex: R$ 3.000"
            className="w-full px-4 py-4 bg-slate-800 border-2 border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <CalendarDays className="w-4 h-4 text-blue-400" />
            Quantos anos trabalhou nessa empresa?
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {[0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15].map((year) => (
              <button
                key={year}
                onClick={() => onYearsChange(year)}
                className={`py-3 px-2 rounded-xl text-sm font-medium border-2 transition-all ${
                  yearsWorked === year
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                    : 'border-slate-600 text-gray-400 hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                {year < 1 ? '6m' : `${year}a`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-xl font-bold border-2 border-slate-600 text-gray-400 hover:bg-slate-800 hover:text-white transition-all"
        >
          Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!canAdvance}
          className={`flex-1 py-4 rounded-xl font-bold transition-all ${
            canAdvance
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-xl'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
