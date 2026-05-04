import { User, MapPin, CreditCard, Check, CalendarCheck } from 'lucide-react';
import './CheckoutStepper.css';

interface Step {
  id: string;
  title: string;
  icon: typeof User;
}

const steps: Step[] = [
  { id: 'personal', title: 'Identificação', icon: User },
  { id: 'address', title: 'Entrega', icon: MapPin },
  { id: 'payment', title: 'Pagamento', icon: CreditCard },
  { id: 'resume', title: 'Resumo', icon: CalendarCheck },
];

type StepState = 'completed' | 'current' | 'pending';

interface CheckoutStepperProps {
  currentStep: string;
  completedSteps: string[];
  onStepClick: (stepId: string) => void;
}

export function CheckoutStepper({
  currentStep,
  completedSteps,
  onStepClick,
}: CheckoutStepperProps) {
  const getStepState = (stepId: string): StepState => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  return (
    <nav aria-label="Etapas do checkout" className="breadcrumb">
      <ol>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const state = getStepState(step.id);
          const isLast = index === steps.length - 1;

          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                aria-current={state === 'current' ? 'step' : undefined}
                className="step"
                data-state={state}
              >
                <span className="step-circle">
                  {state === 'completed' ? (
                    <Check strokeWidth={2.5} />
                  ) : (
                    <Icon strokeWidth={2} />
                  )}
                </span>
                <span className="step-title">{step.title}</span>
              </button>

              {!isLast && (
                <div
                  className="step-connector"
                  data-state={state}
                  aria-hidden="true"
                >
                  <div className="step-connector-progress" />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
