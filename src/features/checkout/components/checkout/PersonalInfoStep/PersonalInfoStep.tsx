import { useFormContext } from 'react-hook-form';
import { User, Mail, Fingerprint, Phone } from 'lucide-react';
import { type CheckoutFormData } from '../../../schemas/checkoutSchema';
import { formatCPF, formatPhone } from '../../../utils/formatters';
import { toast } from 'sonner';
import { FormField } from '../fields/FormField';
import { StepNavigation } from '../fields/StepNavigation';
import './PersonalInfoStep.css';

interface PersonalInfoStepProps {
  onNext: () => void;
}

export function PersonalInfoStep({ onNext }: PersonalInfoStepProps) {
  const { register, formState: { errors }, trigger } = useFormContext<CheckoutFormData>();

  const handleNext = async () => {
    const isValid = await trigger(['fullName', 'email', 'cpf', 'phone']);
    if (isValid) {
      onNext();
    } else {
      toast.error('Verifique os dados pessoais', {
        description: 'Preencha todos os campos obrigatórios corretamente para continuar.'
      });
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
    <div className="personal-info-step">
      <h2 className="step-heading">
        <User />
        Dados Pessoais
      </h2>

      <div className="fields-grid">
        <FormField
          id="fullName"
          label="Nome Completo"
          icon={User}
          placeholder="João da Silva"
          error={errors.fullName?.message}
          wrapperClassName="field-full"
          {...register('fullName')}
        />

        <FormField
          id="email"
          label="E-mail"
          icon={Mail}
          type="email"
          placeholder="joao@exemplo.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <FormField
          id="cpf"
          label="CPF"
          icon={Fingerprint}
          placeholder="000.000.000-00"
          maxLength={14}
          error={errors.cpf?.message}
          {...withMask('cpf', formatCPF)}
        />

        <FormField
          id="phone"
          label="Telefone"
          icon={Phone}
          placeholder="(11) 98765-4321"
          maxLength={15}
          error={errors.phone?.message}
          wrapperClassName="field-full"
          {...withMask('phone', formatPhone)}
        />
      </div>

      <StepNavigation onNext={handleNext} />
    </div>
  );
}
