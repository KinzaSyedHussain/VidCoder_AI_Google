import { Upload, ScanText, Sparkles, Download } from "lucide-react";

interface WorkflowStatusProps {
  currentStep: 'upload' | 'extract' | 'improve' | 'download';
}

export default function WorkflowStatus({ currentStep }: WorkflowStatusProps) {
  const steps = [
    { key: 'upload', icon: Upload, label: 'Upload File' },
    { key: 'extract', icon: ScanText, label: 'Extract Code' },
    { key: 'improve', icon: Sparkles, label: 'Improve Code' },
    { key: 'download', icon: Download, label: 'Download' }
  ];

  const getStepIndex = (step: string) => steps.findIndex(s => s.key === step);
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-8">
        {steps.map((step, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const IconComponent = step.icon;

          return (
            <div key={step.key} className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className={`text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-slate-700' 
                    : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 ml-8 transition-colors ${
                  index < currentIndex 
                    ? 'bg-primary' 
                    : 'bg-slate-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
