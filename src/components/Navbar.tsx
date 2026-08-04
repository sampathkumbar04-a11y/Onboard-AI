import React from 'react';
import { Sparkles, Cpu, CheckCircle2, RotateCcw } from 'lucide-react';

interface NavbarProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  canNavigate: boolean;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  onSelectStep,
  canNavigate,
  onReset
}) => {
  const steps = [
    { number: 1, label: 'Upload & Inputs' },
    { number: 2, label: 'Extracted Skills' },
    { number: 3, label: 'Gap & Match Score' },
    { number: 4, label: 'Adaptive Roadmap' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectStep(1)}>
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900">
                  AI Adaptive Onboarding
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Engine 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Skills Alignment & Personalized Roadmap Planner</p>
            </div>
          </div>

          {/* Step Wizard Buttons */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200">
            {steps.map((step) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              const isDisabled = !canNavigate && step.number > 1;

              return (
                <button
                  key={step.number}
                  onClick={() => !isDisabled && onSelectStep(step.number)}
                  disabled={isDisabled}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : isCompleted
                      ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                      : isDisabled
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? 'bg-white text-indigo-600'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : step.number}
                  </span>
                  <span>{step.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
              title="Reset inputs and load fresh dataset"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <div className="hidden lg:flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Gemini Ready</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
