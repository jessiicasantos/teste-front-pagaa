import type { ComponentType, ReactNode, SVGProps } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface SummarySectionProps {
  icon: IconType;
  title: string;
  onEdit: () => void;
  disabled?: boolean;
  children: ReactNode;
}

export function SummarySection({
  icon: Icon,
  title,
  onEdit,
  disabled = false,
  children,
}: SummarySectionProps) {
  return (
    <section className="summary-section">
      <div className="summary-section-header">
        <h3 className="summary-section-title">
          <Icon />
          {title}
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEdit}
          disabled={disabled}
          className="summary-section-edit"
        >
          <Pencil className="w-3.5 h-3.5 mr-1" />
          <span className="text-xs">Editar</span>
        </Button>
      </div>
      <div className="summary-section-body">{children}</div>
    </section>
  );
}
