import { useFormContext, type FieldErrors } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { type CheckoutFormData } from '../../../schemas/checkoutSchema';
import { PersonalInfoStep } from '../PersonalInfoStep/PersonalInfoStep';
import { AddressStep } from '../AddressStep/AddressStep';
import { PaymentStep } from '../PaymentStep/PaymentStep';
import { ResumeStep } from '../ResumeStep/ResumeStep';
import { toast } from 'sonner';
import './CheckoutForm.css';

interface CheckoutFormProps {
  handleSubmit: (data: CheckoutFormData) => void;
  currentStep: string;
  onStepChange: (stepId: string) => void;
  isProcessing?: boolean;
}

export function CheckoutForm({
  handleSubmit,
  currentStep,
  onStepChange,
  isProcessing = false,
}: CheckoutFormProps) {
  const {
    handleSubmit: handleFormSubmit,
    formState: { isDirty },
    watch,
  } = useFormContext<CheckoutFormData>();

  const onSubmit = (data: CheckoutFormData) => {
    handleSubmit(data);
  };

  const onInvalid = (formErrors: FieldErrors<CheckoutFormData>) => {
    toast.error('Dados incompletos ou incorretos', {
      description: 'Por favor, revise os campos destacados no formulário para prosseguir.',
    });

    if (formErrors.fullName || formErrors.email || formErrors.cpf || formErrors.phone) {
      onStepChange('personal');
      return;
    }
    if (formErrors.zipCode || formErrors.city || formErrors.address || formErrors.number) {
      onStepChange('address');
      return;
    }
    onStepChange('payment');
  };

  return (
    <form
      id="checkout-form"
      onSubmit={handleFormSubmit(onSubmit, onInvalid)}
      className="checkout-form"
    >
      <Card className="checkout-form-card hover-lift border-lift">
        {currentStep === 'personal' && (
          <PersonalInfoStep onNext={() => onStepChange('address')} />
        )}

        {currentStep === 'address' && (
          <AddressStep
            onNext={() => onStepChange('payment')}
            onBack={() => onStepChange('personal')}
          />
        )}

        {currentStep === 'payment' && (
          <PaymentStep
            onNext={() => onStepChange('resume')}
            onBack={() => onStepChange('address')}
            isProcessing={isProcessing}
          />
        )}

        {currentStep === 'resume' && (
          <ResumeStep
            isProcessing={isProcessing}
            onBack={() => onStepChange('payment')}
            onEdit={onStepChange}
          />
        )}
      </Card>
    </form>
  );
}
