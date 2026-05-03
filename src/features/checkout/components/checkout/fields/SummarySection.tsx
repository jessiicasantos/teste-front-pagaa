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
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Icon className="w-4 h-4" stroke="var(--accent)" />
          {title}
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEdit}
          disabled={disabled}
          className="h-7 px-2 text-(--navy-blue) hover:bg-(--navy-blue) hover:text-white"
        >
          <Pencil className="w-3.5 h-3.5 mr-1" />
          <span className="text-xs">Editar</span>
        </Button>
      </div>
      <div className="text-sm text-gray-600 space-y-0.5">{children}</div>
    </section>
  );
}
