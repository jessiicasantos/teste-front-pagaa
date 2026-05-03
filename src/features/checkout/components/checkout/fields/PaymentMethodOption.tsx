import type { ComponentType, SVGProps } from 'react';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface PaymentMethodOptionProps {
  value: string;
  current: string;
  onSelect: (value: string) => void;
  icon: IconType;
  label: string;
}

export function PaymentMethodOption({
  value,
  current,
  onSelect,
  icon: Icon,
  label,
}: PaymentMethodOptionProps) {
  const selected = value === current;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      data-selected={selected}
      className="payment-option"
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm">{label}</span>
    </button>
  );
}
