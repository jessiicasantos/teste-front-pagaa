import { useFormContext } from 'react-hook-form';
import { MapPin, Building2, Milestone, Home, Info, AlertCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { type CheckoutFormData } from '../../schemas/checkoutSchema';
import { formatZipCode } from '../../utils/formatters';
import { useState, useRef } from 'react';
import { cepService } from '../../services/cepService';
import { toast } from 'sonner';

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
    <div className="endereco-entrega">
      <h2 className="flex items-center gap-2 text-lg md:text-xl mb-5 font-semibold">
        <MapPin className="w-5 h-5" stroke="var(--accent)" />
        Endereço de Entrega
      </h2>

      <div className="grid md:grid-cols-2 gap-4 md:gap-5">
        <div>
          <Label htmlFor="zipCode" className="flex items-center gap-1 font-medium text-gray-700">
            CEP <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="zipCode"
              name={zipCodeRegister.name}
              ref={zipCodeRegister.ref}
              onBlur={zipCodeRegister.onBlur}
              onChange={handleZipCodeChange}
              placeholder="12345-678"
              maxLength={9}
              className={cn(
                "pl-9 pr-9",
                errors.zipCode || cepError ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
              )}
            />
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            {isCepLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
            )}
          </div>
          {errors.zipCode && (
            <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.zipCode.message}
            </p>
          )}
          {!errors.zipCode && cepError && (
            <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {cepError}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="city" className="flex items-center gap-1 font-medium text-gray-700">
            Cidade <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="city"
              {...register('city')}
              placeholder="São Paulo"
              className={cn(
                "pl-9",
                errors.city ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
              )}
            />
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {errors.city && (
            <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.city.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="address" className="flex items-center gap-1 font-medium text-gray-700">
            Endereço <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="address"
              {...register('address')}
              placeholder="Rua, Avenida, etc."
              className={cn(
                "pl-9",
                errors.address ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
              )}
            />
            <Milestone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {errors.address && (
            <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.address.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="number" className="flex items-center gap-1 font-medium text-gray-700">
            Número <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="number"
              {...register('number')}
              placeholder="123"
              className={cn(
                "pl-9",
                errors.number ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
              )}
            />
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {errors.number && (
            <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.number.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="complement" className="font-medium text-gray-700">Complemento (opcional)</Label>
          <div className="relative">
            <Input
              id="complement"
              {...register('complement')}
              placeholder="Apto 45, Bloco B"
              className="pl-9"
            />
            <Info className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-7 flex justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="btn-back border-(--navy-blue)/20 text-(--navy-blue) hover:bg-(--navy-blue) hover:text-white hover:border-(--navy-blue)"
        >
          <ArrowLeft className="w-4 h-4 mr-2 arrow-icon" />
          Voltar
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          className="btn-next shadow-md shadow-[#110c5d]/20 hover:shadow-lg hover:shadow-[#110c5d]/30 transition-shadow"
        >
          Próximo Passo
          <ArrowRight className="arrow-icon w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
