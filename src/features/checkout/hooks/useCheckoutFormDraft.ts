import { useEffect } from 'react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import type { CheckoutFormData } from '../schemas/checkoutSchema';

export const CHECKOUT_FORM_KEY = 'checkout-form-data';

const SAFE_FIELDS: (keyof CheckoutFormData)[] = [
  'fullName', 'email', 'cpf', 'phone',
  'zipCode', 'city', 'address', 'number',
  'complement', 'installments', 'installments2', 'paymentMethod',
];

export function useCheckoutFormDraft() {
  return useLocalStorage<Partial<CheckoutFormData>>(CHECKOUT_FORM_KEY, {});
}

export function useCheckoutFormDraftSync(
  formValues: Partial<CheckoutFormData>,
  isDirty: boolean,
) {
  const [formDraft, setFormDraft] = useCheckoutFormDraft();

  useEffect(() => {
    if (!isDirty || Object.keys(formValues).length === 0) return;

    const dataToSave = Object.fromEntries(
      Object.entries(formValues).filter(([key]) =>
        SAFE_FIELDS.includes(key as keyof CheckoutFormData),
      ),
    );

    if (JSON.stringify(dataToSave) !== JSON.stringify(formDraft)) {
      setFormDraft(dataToSave);
    }
  }, [formValues, formDraft, setFormDraft, isDirty]);
}

export function clearCheckoutFormDraft() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CHECKOUT_FORM_KEY);
}
