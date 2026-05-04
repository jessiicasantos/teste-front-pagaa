import type { ComponentProps, ComponentType, ReactNode, SVGProps } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

type InputProps = Omit<ComponentProps<typeof Input>, 'id'>;

interface FormFieldProps extends InputProps {
  id: string;
  label: string;
  icon: IconType;
  error?: string;
  required?: boolean;
  endSlot?: ReactNode;
  wrapperClassName?: string;
}

export function FormField({
  id,
  label,
  icon: Icon,
  error,
  required = true,
  endSlot,
  wrapperClassName,
  className,
  ...inputProps
}: FormFieldProps) {
  return (
    <div className={wrapperClassName}>
      <Label htmlFor={id} className="field-label">
        {label}
        {required && <span className="field-required">*</span>}
      </Label>
      <div className="field-control">
        <Input
          id={id}
          {...inputProps}
          className={cn('pl-9', error && 'field-input-invalid', className)}
        />
        <Icon className="field-icon" />
        {endSlot}
      </div>
      {error && (
        <p className="field-error">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
