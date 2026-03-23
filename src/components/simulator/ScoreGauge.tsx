import { useEffect, useState } from 'react';
import type { Classification } from '../../utils/laborCalculator';

interface ScoreGaugeProps {
  score: number;
  classification: Classification;
}

const CLASSIFICATION_CONFIG = {
  baixa: {
    label: 'Baixa probabilidade',
    color: 'text-amber-400',
    gradient: 'from-amber-500 to-amber-600',
    track: 'text-amber-500',
  },
  media: {
    label: 'Media probabilidade',
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-blue-600',
    track: 'text-blue-500',
  },
  alta: {
    label: 'Alta probabilidade',
    color: 'text-emerald-400',
    gradient: 'from-emerald-500 to-emerald-600',
    track: 'text-emerald-500',
  },
};

export default function ScoreGauge({ score, classification }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const config = CLASSIFICATION_CONFIG[classification];

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [score]);

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-700"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className={config.track}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-black ${config.color}`}>
            {animatedScore}
          </span>
          <span className="text-xs text-gray-500 font-medium">de 100</span>
        </div>
      </div>
      <div className={`mt-3 px-4 py-1.5 rounded-full bg-gradient-to-r ${config.gradient} bg-opacity-20`}>
        <span className="text-sm font-bold text-white">{config.label}</span>
      </div>
    </div>
  );
}
