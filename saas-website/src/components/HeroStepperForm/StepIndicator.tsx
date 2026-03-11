import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const steps = ['Phone', 'Details', 'Verify'];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;
        return (
          <React.Fragment key={stepNum}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                      ? 'bg-gradient-to-r from-[#7c5cfc] to-[#00d4ff] text-white shadow-lg shadow-[#7c5cfc]/30'
                      : 'bg-[#14141f] text-[#5a5a72] border border-[#2a2a3c]'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-[#f0f0f5]' : 'text-[#5a5a72]'}`}>
                {label}
              </span>
            </div>
            {idx < totalSteps - 1 && (
              <div className={`w-12 h-0.5 mb-5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-[#1e1e2e]'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
