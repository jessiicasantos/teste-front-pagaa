import { User, MapPin, CreditCard, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  icon: typeof User;
}

const steps: Step[] = [
  { id: 'personal', title: 'Identificação', icon: User },
  { id: 'address', title: 'Entrega', icon: MapPin },
  { id: 'payment', title: 'Pagamento', icon: CreditCard },
];

interface StepBreadcrumbProps {
  currentStep: string;
  completedSteps: string[];
  onStepClick: (stepId: string) => void;
}

export function StepBreadcrumb({
  currentStep,
  completedSteps,
  onStepClick,
}: StepBreadcrumbProps) {
  const getStepState = (stepId: string) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  return (
    <nav aria-label="Etapas do checkout" className="mb-8">
      <ol className="flex items-start justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const state = getStepState(step.id);
          const isCompleted = state === 'completed';
          const isCurrent = state === 'current';
          const isLast = index === steps.length - 1;

          return (
            <li key={step.id} className="flex-1 flex items-start min-w-0">
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                aria-current={isCurrent ? 'step' : undefined}
                className="group flex flex-col items-center gap-2 cursor-pointer focus-visible:outline-none flex-shrink-0"
              >
                <span
                  className={cn(
                    'relative flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full transition-all duration-300',
                    'group-focus-visible:ring-2 group-focus-visible:ring-accent group-focus-visible:ring-offset-2',
                    isCurrent &&
                      'bg-accent text-white shadow-lg shadow-accent/30 ring-4 ring-(--accent-soft)',
                    isCompleted &&
                      'bg-accent text-white group-hover:shadow-md group-hover:shadow-accent/25',
                    !isCurrent &&
                      !isCompleted &&
                      'bg-white border-2 border-(--accent-soft) text-(--accent-light) group-hover:border-accent group-hover:text-accent group-hover:bg-(--baby-pink)'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" strokeWidth={2.5} />
                  ) : (
                    <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                  )}
                </span>
                <span className="flex flex-col items-center gap-0.5 px-1">
                  <span
                    className={cn(
                      'text-[10px] uppercase tracking-wider font-semibold transition-colors',
                      isCurrent || isCompleted
                        ? 'text-accent'
                        : 'text-gray-400 group-hover:text-accent/70'
                    )}
                  >
                    Passo 0{index + 1}
                  </span>
                  <span
                    className={cn(
                      'text-xs md:text-sm font-semibold whitespace-nowrap transition-colors',
                      isCurrent && 'text-(--navy-blue)',
                      isCompleted && 'text-(--text)',
                      !isCurrent &&
                        !isCompleted &&
                        'text-gray-500 group-hover:text-(--navy-blue)'
                    )}
                  >
                    {step.title}
                  </span>
                </span>
              </button>

              {!isLast && (
                <div
                  className="flex-1 h-0.5 mt-5 md:mt-[22px] mx-2 md:mx-3 rounded-full bg-(--baby-pink) overflow-hidden"
                  aria-hidden="true"
                >
                  <div
                    className={cn(
                      'h-full rounded-full bg-accent transition-all duration-500 ease-out',
                      isCompleted ? 'w-full' : 'w-0'
                    )}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
