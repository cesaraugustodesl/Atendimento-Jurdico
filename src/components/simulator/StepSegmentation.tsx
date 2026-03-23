import { Briefcase, Building2, HardHat } from 'lucide-react';
import type { ContractType } from '../../utils/laborCalculator';

interface StepSegmentationProps {
  value: ContractType | '';
  onChange: (value: ContractType) => void;
  onNext: () => void;
}

const OPTIONS = [
  {
    value: 'clt' as ContractType,
    label: 'CLT',
    description: 'Carteira assinada',
    icon: Briefcase,
    color: 'from-blue-600 to-blue-700',
    border: 'border-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    value: 'pj' as ContractType,
    label: 'PJ',
    description: 'Pessoa Juridica',
    icon: Building2,
    color: 'from-amber-600 to-amber-700',
    border: 'border-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    value: 'informal' as ContractType,
    label: 'Sem registro',
    description: 'Trabalho informal',
    icon: HardHat,
    color: 'from-red-600 to-red-700',
    border: 'border-red-500',
    bg: 'bg-red-500/10',
  },
];

export default function StepSegmentation({ value, onChange, onNext }: StepSegmentationProps) {
  const handleSelect = (contractType: ContractType) => {
    onChange(contractType);
    setTimeout(onNext, 300);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">
          Qual era seu tipo de contratacao?
        </h3>
        <p className="text-gray-400">Selecione a opcao que melhor descreve sua situacao</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
                isSelected
                  ? `${option.border} ${option.bg} scale-[1.02]`
                  : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
              }`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1">{option.label}</h4>
              <p className="text-sm text-gray-400">{option.description}</p>
              {isSelected && (
                <div className={`absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br ${option.color} flex items-center justify-center`}>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
