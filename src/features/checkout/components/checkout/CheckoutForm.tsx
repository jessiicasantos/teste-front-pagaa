import { useFormContext, type FieldErrors } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { type CheckoutFormData } from '../../schemas/checkoutSchema';
import { useEffect } from 'react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { PersonalInfoStep } from './PersonalInfoStep/PersonalInfoStep';
import { AddressStep } from './AddressStep/AddressStep';
import { PaymentStep } from './PaymentStep/PaymentStep';
import { ResumeStep } from './ResumeStep/ResumeStep';
import { toast } from 'sonner';

export const CHECKOUT_FORM_KEY = 'checkout-form-data';

const SAFE_FIELDS: (keyof CheckoutFormData)[] = [
  'fullName', 'email', 'cpf', 'phone', 
  'zipCode', 'city', 'address', 'number', 
  'complement', 'installments', 'installments2', 'paymentMethod'
];

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
  isProcessing = false
}: CheckoutFormProps) {
  // Use useLocalStorage to manage form draft (safe fields only)
  const [formDraft, setFormDraft] = useLocalStorage<Partial<CheckoutFormData>>(
    CHECKOUT_FORM_KEY, 
    {}
  );

  const { 
    handleSubmit: handleFormSubmit, 
    formState: { isDirty },
    watch,
  } = useFormContext<CheckoutFormData>();

  const formValues = watch();

  useEffect(() => {
    if (!isDirty || Object.keys(formValues).length === 0) {
      return;
    }

    const dataToSave = Object.fromEntries(
      Object.entries(formValues).filter(([key]) => 
        SAFE_FIELDS.includes(key as keyof CheckoutFormData)
      )
    );
    
    if (JSON.stringify(dataToSave) !== JSON.stringify(formDraft)) {
      setFormDraft(dataToSave);
    }
  }, [formValues, formDraft, setFormDraft, isDirty]);

  const onSubmit = (data: CheckoutFormData) => {
    handleSubmit(data);
  };

  const onInvalid = (formErrors: FieldErrors<CheckoutFormData>) => {
    toast.error('Dados incompletos ou incorretos', {
      description: 'Por favor, revise os campos destacados no formulário para prosseguir.'
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
    <form id="checkout-form" onSubmit={handleFormSubmit(onSubmit, onInvalid)} className="space-y-5 md:space-y-6">
      <Card className="p-5 md:p-6 hover-lift">
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
