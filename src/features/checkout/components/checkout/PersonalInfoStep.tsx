import { useFormContext } from 'react-hook-form';
import { User, Mail, Fingerprint, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { type CheckoutFormData } from '../../schemas/checkoutSchema';
import { formatCPF, formatPhone } from '../../utils/formatters';

interface PersonalInfoStepProps {
  onNext: () => void;
}

export function PersonalInfoStep({ onNext }: PersonalInfoStepProps) {
  const { register, formState: { errors }, trigger } = useFormContext<CheckoutFormData>();

  const handleNext = async () => {
    const isValid = await trigger(['fullName', 'email', 'cpf', 'phone']);
    if (isValid) {
      onNext();
    }
  };

  const withMask = (name: keyof CheckoutFormData, formatter: (val: string) => string) => {
    const { onChange, ...rest } = register(name);
    return {
      ...rest,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = formatter(e.target.value);
        onChange(e);
      }
    };
  };

  return (
    <div className="dados-pessoais">
      <h2 className="flex items-center gap-2 text-xl mb-6 font-semibold">
        <User className="w-5 h-5" stroke="var(--accent)" />
        Dados Pessoais
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <Label htmlFor="fullName" className="flex items-center gap-1 font-medium text-gray-700">
            Nome Completo <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="fullName"
              {...register('fullName')}
              placeholder="João da Silva"
              className={cn(
                "pl-9",
                errors.fullName ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
              )}
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {errors.fullName && (
            <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="flex items-center gap-1 font-medium text-gray-700">
            E-mail <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="joao@exemplo.com"
              className={cn(
                "pl-9",
                errors.email ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
              )}
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="cpf" className="flex items-center gap-1 font-medium text-gray-700">
            CPF <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="cpf"
              {...withMask('cpf', formatCPF)}
              placeholder="000.000.000-00"
              maxLength={14}
              className={cn(
                "pl-9",
                errors.cpf ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
              )}
            />
            <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {errors.cpf && (
            <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.cpf.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="phone" className="flex items-center gap-1 font-medium text-gray-700">
            Telefone <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="phone"
              {...withMask('phone', formatPhone)}
              placeholder="(11) 98765-4321"
              maxLength={15}
              className={cn(
                "pl-9",
                errors.phone ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
              )}
            />
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {errors.phone && (
            <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          type="button"
          onClick={handleNext}
          className="bg-accent hover:bg-accent/90 text-white"
        >
          Próximo Passo
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
