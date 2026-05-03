import { useFormContext, Controller, useWatch } from 'react-hook-form';
import {
  CreditCard, WalletCards, Barcode, User, Calendar, Lock, AlertCircle, DollarSign,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type CheckoutFormData } from '../../../schemas/checkoutSchema';
import {
  formatCardNumber,
  formatCardExpiry,
  formatCurrency,
  parseCurrency,
  brlCurrency,
} from '../../../utils/formatters';
import { useCart } from '../../../hooks/useCart';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { FormField } from '../fields/FormField';
import { StepNavigation } from '../fields/StepNavigation';
import { PixIcon } from '../fields/PixIcon';
import { PaymentMethodOption } from './PaymentMethodOption';
import './PaymentStep.css';

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
  isProcessing: boolean;
}

const PAYMENT_METHODS = [
  { value: 'cartao', icon: CreditCard, label: 'Cartão de crédito' },
  { value: 'dois-cartoes', icon: WalletCards, label: 'Dois cartões' },
  { value: 'boleto', icon: Barcode, label: 'Boleto' },
  { value: 'pix', icon: PixIcon, label: 'Pix' },
] as const;

export function PaymentStep({ onNext, onBack, isProcessing }: PaymentStepProps) {
  const { cart } = useCart();
  const total = cart?.total ?? 0;
  const previousTotalRef = useRef(total);

  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useFormContext<CheckoutFormData>();

  const paymentMethod = watch('paymentMethod');

  const installmentsValue = useWatch({ control, name: 'installments' });
  const installmentsValue2 = useWatch({ control, name: 'installments2' });

  const getInstallmentOptions = (amount: number) =>
    Array.from({ length: 12 }, (_, i) => {
      const count = i + 1;
      const value = amount / count;
      return {
        value: count.toString(),
        label: `${count}x de ${brlCurrency.format(value)} ${count === 1 ? 'à vista' : 'sem juros'}`,
      };
    });

  const installmentOptions = getInstallmentOptions(total);
  const amount1Val = parseCurrency(watch('amount1') || '0');
  const amount2Val = parseCurrency(watch('amount2') || '0');
  const installmentOptions1 = getInstallmentOptions(amount1Val);
  const installmentOptions2 = getInstallmentOptions(amount2Val);

  useEffect(() => {
    if (paymentMethod === 'dois-cartoes') {
      const currentAmount1 = watch('amount1');
      const currentAmount2 = watch('amount2');

      if ((!currentAmount1 && !currentAmount2) || previousTotalRef.current !== total) {
        const half = total / 2;
        const val1 = formatCurrency(Math.round(half * 100).toString());
        const val2 = formatCurrency(Math.round((total - half) * 100).toString());

        setValue('amount1', val1);
        setValue('amount2', val2);

        if (!installmentsValue) setValue('installments', '1');
        if (!installmentsValue2) setValue('installments2', '1');

        previousTotalRef.current = total;
        trigger(['amount1', 'amount2']);
      }
    } else {
      previousTotalRef.current = total;
    }
  }, [paymentMethod, total, setValue, watch, installmentsValue, installmentsValue2, trigger]);

  const withMask = (name: keyof CheckoutFormData, formatter: (val: string) => string) => {
    const { onChange, ...rest } = register(name);
    return {
      ...rest,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = formatter(e.target.value);
        onChange(e);
      },
    };
  };

  const handleNext = async () => {
    const baseFields: (keyof CheckoutFormData)[] = ['paymentMethod'];
    let fieldsToValidate: (keyof CheckoutFormData)[] = baseFields;

    if (paymentMethod === 'cartao') {
      fieldsToValidate = [...baseFields, 'cardHolder', 'cardNumber', 'cardExpiry', 'cardCvv', 'installments'];
    } else if (paymentMethod === 'dois-cartoes') {
      fieldsToValidate = [
        ...baseFields,
        'cardHolder', 'cardNumber', 'cardExpiry', 'cardCvv', 'installments', 'amount1',
        'cardHolder2', 'cardNumber2', 'cardExpiry2', 'cardCvv2', 'installments2', 'amount2',
      ];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      onNext();
    } else {
      toast.error('Verifique os dados de pagamento', {
        description: 'Algumas informações do cartão estão incompletas ou incorretas.',
      });
    }
  };

  const handleAmountChange = (name: 'amount1' | 'amount2', otherName: 'amount1' | 'amount2') => {
    const { onChange, ...rest } = register(name);
    return {
      ...rest,
      onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCurrency(e.target.value);
        e.target.value = formatted;

        const val = parseCurrency(formatted);
        const otherVal = Math.max(0, total - val);

        onChange(e);

        setValue(otherName, formatCurrency(Math.round(otherVal * 100).toString()), {
          shouldDirty: true,
          shouldTouch: true,
        });

        await trigger(['amount1', 'amount2']);
      },
    };
  };

  const handleSelectMethod = (value: string) =>
    setValue('paymentMethod', value as CheckoutFormData['paymentMethod'], { shouldDirty: true });

  const cvvOnlyDigits = (name: 'cardCvv' | 'cardCvv2') => (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/\D/g, '');
    register(name).onChange(e);
  };

  const renderCardFields = (suffix: '' | '2') => {
    const holderKey = `cardHolder${suffix}` as 'cardHolder' | 'cardHolder2';
    const numberKey = `cardNumber${suffix}` as 'cardNumber' | 'cardNumber2';
    const expiryKey = `cardExpiry${suffix}` as 'cardExpiry' | 'cardExpiry2';
    const cvvKey = `cardCvv${suffix}` as 'cardCvv' | 'cardCvv2';
    const showAsterisk = suffix === '';

    return (
      <>
        <FormField
          id={holderKey}
          label="Nome do titular"
          icon={User}
          placeholder="Como impresso no cartão"
          required={showAsterisk}
          error={errors[holderKey]?.message}
          wrapperClassName="field-full"
          {...register(holderKey)}
        />
        <FormField
          id={numberKey}
          label="Número do cartão"
          icon={CreditCard}
          placeholder="0000 0000 0000 0000"
          maxLength={19}
          required={showAsterisk}
          error={errors[numberKey]?.message}
          wrapperClassName="field-full"
          {...withMask(numberKey, formatCardNumber)}
        />
        <FormField
          id={expiryKey}
          label="Validade"
          icon={Calendar}
          placeholder="MM/AA"
          maxLength={5}
          required={showAsterisk}
          error={errors[expiryKey]?.message}
          {...withMask(expiryKey, formatCardExpiry)}
        />
        <FormField
          id={cvvKey}
          label="CVV"
          icon={Lock}
          placeholder="123"
          maxLength={4}
          required={showAsterisk}
          error={errors[cvvKey]?.message}
          {...register(cvvKey)}
          onChange={cvvOnlyDigits(cvvKey)}
        />
      </>
    );
  };

  const renderInstallmentsSelect = (
    name: 'installments' | 'installments2',
    options: { value: string; label: string }[],
    label: string,
    placeholder: string,
    showError: boolean,
  ) => (
    <div className="field-full">
      <Label htmlFor={name} className="field-label mb-1">
        {label}
        {name === 'installments' && <span className="field-required">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger
              id={name}
              className={showError && errors[name] ? 'installments-select-invalid' : 'font-normal'}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="font-normal text-gray-700"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {showError && errors[name] && (
        <p className="field-error">
          <AlertCircle className="w-3.5 h-3.5" />
          {errors[name]?.message}
        </p>
      )}
    </div>
  );

  return (
    <div className="payment-step">
      <h2 className="step-heading">
        <CreditCard />
        Pagamento
      </h2>

      <div className="payment-step-methods">
        {PAYMENT_METHODS.map((method) => (
          <PaymentMethodOption
            key={method.value}
            value={method.value}
            current={paymentMethod}
            onSelect={handleSelectMethod}
            icon={method.icon}
            label={method.label}
          />
        ))}
      </div>

      {paymentMethod === 'cartao' && (
        <div className="fields-grid">
          {renderCardFields('')}
          {renderInstallmentsSelect(
            'installments',
            installmentOptions,
            'Parcelas',
            'Selecione o número de parcelas',
            true,
          )}
        </div>
      )}

      {paymentMethod === 'dois-cartoes' && (
        <div className="payment-step-card-form">
          <div className="payment-card-section">
            <h3 className="payment-card-section-title">
              <span className="payment-card-section-badge">1</span>
              Primeiro Cartão
            </h3>
            <div className="fields-grid">
              {renderCardFields('')}
              <FormField
                id="amount1"
                label="Valor a pagar neste cartão"
                icon={DollarSign}
                placeholder="R$ 0,00"
                required={false}
                error={errors.amount1?.message}
                wrapperClassName="field-full"
                {...handleAmountChange('amount1', 'amount2')}
              />
              {renderInstallmentsSelect('installments', installmentOptions1, 'Parcelas (Cartão 1)', 'Parcelas', false)}
            </div>
          </div>

          <div className="payment-card-section">
            <h3 className="payment-card-section-title">
              <span className="payment-card-section-badge">2</span>
              Segundo Cartão
            </h3>
            <div className="fields-grid">
              {renderCardFields('2')}
              <FormField
                id="amount2"
                label="Valor a pagar neste cartão"
                icon={DollarSign}
                placeholder="R$ 0,00"
                required={false}
                error={errors.amount2?.message}
                wrapperClassName="field-full"
                {...handleAmountChange('amount2', 'amount1')}
              />
              {renderInstallmentsSelect('installments2', installmentOptions2, 'Parcelas (Cartão 2)', 'Parcelas', false)}
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'boleto' && (
        <div className="info-panel">
          <Barcode className="info-panel-icon" />
          <div>
            <h3 className="info-panel-title">Pagamento por Boleto Bancário</h3>
            <p className="info-panel-text">
              Ao finalizar a compra, você receberá o boleto bancário por e-mail para realizar o pagamento.
            </p>
            <ul className="bullet-list">
              <li>O boleto vence em 3 dias úteis</li>
              <li>Após o pagamento, a aprovação pode levar até 2 dias úteis</li>
              <li>Você pode pagar em qualquer banco, lotérica ou pelo internet banking</li>
            </ul>
          </div>
        </div>
      )}

      {paymentMethod === 'pix' && (
        <div className="info-panel">
          <PixIcon className="info-panel-icon" />
          <div>
            <h3 className="info-panel-title">Pagamento por Pix</h3>
            <p className="info-panel-text">
              Ao finalizar a compra, você receberá um QR Code para realizar o pagamento via Pix.
            </p>
            <ul className="bullet-list">
              <li>Pagamento instantâneo e seguro</li>
              <li>Aprovação imediata após o pagamento</li>
              <li>Disponível 24 horas por dia, 7 dias por semana</li>
              <li>Use o aplicativo do seu banco para escanear o QR Code</li>
            </ul>
          </div>
        </div>
      )}

      <StepNavigation onBack={onBack} onNext={handleNext} disabled={isProcessing} />
    </div>
  );
}
