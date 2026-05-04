import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepNavigationProps {
  onBack?: () => void;
  onNext: () => void;
  disabled?: boolean;
  nextLabel?: string;
}

export function StepNavigation({
  onBack,
  onNext,
  disabled = false,
  nextLabel = 'Próximo Passo',
}: StepNavigationProps) {
  return (
    <div className={`mt-6 md:mt-7 flex gap-3 ${onBack ? 'justify-between' : 'justify-end'}`}>
      {onBack && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={disabled}
          className="btn-back"
        >
          <ArrowLeft className="arrow-icon w-4 h-4" />
          Voltar
        </Button>
      )}
      <Button type="button" onClick={onNext} disabled={disabled} className="btn-next">
        {nextLabel}
        <ArrowRight className="arrow-icon w-4 h-4" />
      </Button>
    </div>
  );
}
