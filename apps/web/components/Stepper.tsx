import { CheckIcon } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export default function Stepper({ currentStep = 1, totalSteps }: StepperProps) {
  return (
    <div className="w-full max-w-3xl px-4">
      <ol className="flex items-center w-full">
        {[...Array(totalSteps)].map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <li
              key={stepNumber}
              className={`flex items-center ${
                stepNumber !== totalSteps ? 'w-full' : 'flex-initial'
              }`}
            >
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                  isCompleted
                    ? 'bg-primary border-primary'
                    : isCurrent
                      ? 'border-primary text-primary'
                      : 'border-gray-300 text-gray-300'
                }`}
              >
                {isCompleted ? (
                  <CheckIcon className="w-6 h-6 text-white" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
              {stepNumber !== totalSteps && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    stepNumber < currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`}
                ></div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
