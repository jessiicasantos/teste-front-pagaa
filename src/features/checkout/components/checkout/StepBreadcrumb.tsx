import { User, MapPin, CreditCard, Check, ChevronRight } from 'lucide-react';
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
    <nav className="mb-8">
      <div className="flex items-center justify-center gap-2 md:gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const state = getStepState(step.id);
          const isCompleted = state === 'completed';
          const isCurrent = state === 'current';
          const isPending = state === 'pending';

          return (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => (isCompleted || isCurrent) && onStepClick(step.id)}
                disabled={isPending}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full transition-all",
                  isCurrent && "bg-(--accent-soft) ring-1 ring-(--accent-soft)",
                  isCompleted && "hover:bg-(--baby-pink)/60",
                  (isCompleted || isCurrent) ? "cursor-pointer" : "cursor-default"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  isCurrent && "bg-accent text-white shadow-md shadow-accent/30",
                  isCompleted && "bg-(--accent) text-white",
                  isPending && "bg-(--baby-pink) text-(--accent-soft)"
                )}>
                  {step.id === 'personal' && isCompleted ? <User className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="flex flex-col items-start">
                  <span className={cn(
                    "text-[10px] uppercase tracking-tighter font-bold opacity-60",
                    (isCurrent || isCompleted) && "text-accent"
                  )}>
                    Passo 0{index + 1}
                  </span>
                  <span className={cn(
                    "text-xs md:text-sm font-semibold whitespace-nowrap",
                    isCurrent && "text-accent",
                    isCompleted && "text-(--accent)",
                    isPending && "text-gray-500"
                  )}>
                    {step.title}
                  </span>
                </div>
              </button>

              {index < steps.length - 1 && (
                <ChevronRight className={cn(
                  "w-4 h-4 mx-1 md:mx-2",
                  completedSteps.includes(step.id) ? "text-(--accent-soft)" : "text-gray-300"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
