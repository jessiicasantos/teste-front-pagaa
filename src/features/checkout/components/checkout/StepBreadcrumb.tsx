import { User, MapPin, CreditCard, Check, CalendarCheck } from 'lucide-react';
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
  { id: 'resume', title: 'Resumo', icon: CalendarCheck }
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
    <nav aria-label="Etapas do checkout" className="mb-6 md:mb-8">
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
                className="group flex flex-col items-center gap-1.5 md:gap-2 cursor-pointer focus-visible:outline-none flex-shrink-0"
              >
                <span
                  className={cn(
                    'relative flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full transition-all duration-300',
                    isCurrent &&
                      'bg-(--navy-blue) text-white shadow-lg shadow-(--navy-blue)/25',
                    isCompleted &&
                      'bg-(--navy-blue) text-white group-hover:bg-white group-hover:text-(--navy-blue) group-hover:border group-hover:border-(--navy-blue)',
                    !isCurrent &&
                      !isCompleted &&
                      'bg-white border-2 group-hover:text-white group-hover:bg-(--navy-blue) border border-(--navy-blue) text-(--navy-blue)'
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
                      'text-xs md:text-sm font-semibold whitespace-nowrap transition-colors',
                      (isCurrent || isCompleted) && 'text-(--navy-blue)',
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
                  className="flex-1 h-0.5 mt-5 md:mt-[22px] mx-2 md:mx-3 rounded-full bg-(--navy-blue)/20 overflow-hidden"
                  aria-hidden="true"
                >
                  <div
                    className={cn(
                      'h-full rounded-full bg-(--navy-blue) transition-all duration-500 ease-out',
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
