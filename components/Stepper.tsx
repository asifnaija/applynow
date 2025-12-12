import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded"></div>
        <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-brand-600 -z-10 rounded transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-brand-600 border-brand-600 text-white' 
                    : isCurrent 
                      ? 'bg-white border-brand-600 text-brand-600' 
                      : 'bg-white border-slate-300 text-slate-300'}
                `}
              >
                {isCompleted ? <Check size={20} /> : <span className="font-semibold text-sm">{index + 1}</span>}
              </div>
              <span 
                className={`absolute mt-12 text-xs font-medium uppercase tracking-wider transition-colors duration-300
                  ${isCurrent || isCompleted ? 'text-brand-600' : 'text-slate-400'}
                `}
                style={{
                    // Small hack for alignment
                    transform: 'translateX(0)', 
                }}
              >
                <span className="hidden sm:inline">{step}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};