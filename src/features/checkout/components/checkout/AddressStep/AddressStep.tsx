import { useFormContext } from 'react-hook-form';
import { MapPin, Building2, Milestone, Home, Info, AlertCircle, Loader2 } from 'lucide-react';
import { type CheckoutFormData } from '../../../schemas/checkoutSchema';
import { formatZipCode } from '../../../utils/formatters';
import { useState, useRef } from 'react';
import { cepService } from '../../../services/cepService';
import { toast } from 'sonner';
import { FormField } from '../fields/FormField';
import { StepNavigation } from '../fields/StepNavigation';
import './AddressStep.css';

interface AddressStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function AddressStep({ onNext, onBack }: AddressStepProps) {
  const { register, formState: { errors }, trigger, setValue } = useFormContext<CheckoutFormData>();
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const lastFetchedCepRef = useRef<string>('');
  const zipCodeRegister = register('zipCode');

  const handleNext = async () => {
    const isValid = await trigger(['zipCode', 'city', 'address', 'number']);

    if (cepError || isCepLoading) {
      toast.error(cepError || 'Validando CEP...', {
        description: isCepLoading
          ? 'Por favor, aguarde a validação do CEP.'
          : 'O CEP informado não foi encontrado.'
      });
      return;
    }

    if (isValid) {
      onNext();
    } else {
      toast.error('Verifique o endereço', {
        description: 'Preencha todos os campos obrigatórios corretamente para continuar.'
      });
    }
  };

  const fetchAddressByCep = async (zipCode: string) => {
    const cleanCep = zipCode.replace(/\D/g, '');
    if (cleanCep.length !== 8 || cleanCep === lastFetchedCepRef.current) return;

    lastFetchedCepRef.current = cleanCep;
    setCepError(null);
    setIsCepLoading(true);

    try {
      const address = await cepService.fetchAddress(cleanCep);
      setValue('address', address.logradouro, { shouldValidate: true, shouldDirty: true });
      setValue('city', address.localidade, { shouldValidate: true, shouldDirty: true });
    } catch {
      setCepError('CEP não encontrado. Verifique e tente novamente.');
      setValue('address', '', { shouldValidate: true });
      setValue('city', '', { shouldValidate: true });
    } finally {
      setIsCepLoading(false);
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatZipCode(e.target.value);
    zipCodeRegister.onChange(e);

    const cleanCep = e.target.value.replace(/\D/g, '');
    if (cleanCep.length < 8 && lastFetchedCepRef.current) {
      lastFetchedCepRef.current = '';
      setCepError(null);
    }
    if (cleanCep.length === 8) {
      fetchAddressByCep(e.target.value);
    }
  };

  return (
    <div className="address-step">
      <h2 className="step-heading">
        <MapPin />
        Endereço de Entrega
      </h2>

      <div className="fields-grid">
        <div>
          <FormField
            id="zipCode"
            label="CEP"
            icon={MapPin}
            placeholder="12345-678"
            maxLength={9}
            className={isCepLoading ? 'pr-9' : ''}
            error={errors.zipCode?.message}
            name={zipCodeRegister.name}
            ref={zipCodeRegister.ref}
            onBlur={zipCodeRegister.onBlur}
            onChange={handleZipCodeChange}
            endSlot={isCepLoading ? <Loader2 className="cep-loading-icon" /> : null}
          />
          {!errors.zipCode && cepError && (
            <p className="field-error">
              <AlertCircle className="w-3.5 h-3.5" />
              {cepError}
            </p>
          )}
        </div>

        <FormField
          id="city"
          label="Cidade"
          icon={Building2}
          placeholder="São Paulo"
          error={errors.city?.message}
          {...register('city')}
        />

        <FormField
          id="address"
          label="Endereço"
          icon={Milestone}
          placeholder="Rua, Avenida, etc."
          error={errors.address?.message}
          wrapperClassName="field-full"
          {...register('address')}
        />

        <FormField
          id="number"
          label="Número"
          icon={Home}
          placeholder="123"
          error={errors.number?.message}
          {...register('number')}
        />

        <FormField
          id="complement"
          label="Complemento (opcional)"
          icon={Info}
          placeholder="Apto 45, Bloco B"
          required={false}
          {...register('complement')}
        />
      </div>

      <StepNavigation onBack={onBack} onNext={handleNext} />
    </div>
  );
}
