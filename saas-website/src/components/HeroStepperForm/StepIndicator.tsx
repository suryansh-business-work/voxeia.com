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
                      ? 'bg-gradient-to-r from-[#3fe3cd] to-[#2789ab] text-white shadow-lg shadow-[#3fe3cd]/30'
                      : 'bg-[#132d45] text-[#4a708d] border border-[#234c6a]'
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
              <span className={`text-[10px] font-medium ${isActive ? 'text-[#e8f1f8]' : 'text-[#4a708d]'}`}>
                {label}
              </span>
            </div>
            {idx < totalSteps - 1 && (
              <div className={`w-12 h-0.5 mb-5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-[#1a3a54]'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
