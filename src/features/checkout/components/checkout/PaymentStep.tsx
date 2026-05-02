import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { CreditCard, WalletCards, Barcode, Smartphone, User, Calendar, Lock, AlertCircle, ArrowLeft, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type CheckoutFormData } from '../../schemas/checkoutSchema';
import {
  formatCardNumber,
  formatCardExpiry,
  formatCurrency,
  parseCurrency,
  brlCurrency
} from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import { useEffect, useRef } from 'react';

interface PaymentStepProps {
  onBack: () => void;
  isProcessing: boolean;
}

export function PaymentStep({ onBack, isProcessing }: PaymentStepProps) {
  const { cart } = useCart();
  const total = cart?.total ?? 0;
  const previousTotalRef = useRef(total);

  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useFormContext<CheckoutFormData>();

  const paymentMethod = watch('paymentMethod');

  const installmentsValue = useWatch({
    control,
    name: 'installments',
  });

  const installmentsValue2 = useWatch({
    control,
    name: 'installments2',
  });

  const getInstallmentOptions = (amount: number) => {
    return Array.from({ length: 12 }, (_, i) => {
      const count = i + 1;
      const value = amount / count;
      return {
        value: count.toString(),
        label: `${count}x de ${brlCurrency.format(value)} ${count === 1 ? 'à vista' : 'sem juros'}`
      };
    });
  };

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
      }
    };
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
          shouldTouch: true
        });

        await trigger(['amount1', 'amount2']);
      }
    };
  };

  return (
    <div className="pagamento">
      <h2 className="flex items-center gap-2 text-lg md:text-xl mb-5 font-semibold">
        <CreditCard className="w-5 h-5" stroke="var(--accent)" />
        Pagamento
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 mb-5">
        <button
          type="button"
          onClick={() => setValue('paymentMethod', 'cartao', { shouldDirty: true })}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
            paymentMethod === 'cartao'
              ? 'border-accent bg-(--baby-pink)'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <CreditCard className={`w-5 h-5 ${paymentMethod === 'cartao' ? 'text-accent' : 'text-gray-500'}`} />
          <span className={`text-sm ${paymentMethod === 'cartao' ? 'font-medium text-accent' : 'text-gray-600'}`}>Cartão de crédito</span>
        </button>

        <button
          type="button"
          onClick={() => setValue('paymentMethod', 'dois-cartoes', { shouldDirty: true })}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
            paymentMethod === 'dois-cartoes'
              ? 'border-accent bg-(--baby-pink)'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <WalletCards className={`w-5 h-5 ${paymentMethod === 'dois-cartoes' ? 'text-accent' : 'text-gray-500'}`} />
          <span className={`text-sm ${paymentMethod === 'dois-cartoes' ? 'font-medium text-accent' : 'text-gray-600'}`}>Dois cartões</span>
        </button>

        <button
          type="button"
          onClick={() => setValue('paymentMethod', 'boleto', { shouldDirty: true })}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
            paymentMethod === 'boleto'
              ? 'border-accent bg-(--baby-pink)'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <Barcode className={`w-5 h-5 ${paymentMethod === 'boleto' ? 'text-accent' : 'text-gray-500'}`} />
          <span className={`text-sm ${paymentMethod === 'boleto' ? 'font-medium text-accent' : 'text-gray-600'}`}>Boleto</span>
        </button>

        <button
          type="button"
          onClick={() => setValue('paymentMethod', 'pix', { shouldDirty: true })}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
            paymentMethod === 'pix'
              ? 'border-accent bg-(--baby-pink)'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <Smartphone className={`w-5 h-5 ${paymentMethod === 'pix' ? 'text-accent' : 'text-gray-500'}`} />
          <span className={`text-sm ${paymentMethod === 'pix' ? 'font-medium text-accent' : 'text-gray-600'}`}>Pix</span>
        </button>
      </div>

      {paymentMethod === 'cartao' && (
        <div className="grid md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Label htmlFor="cardHolder" className="flex items-center gap-1 font-medium text-gray-700">
              Nome do titular <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="cardHolder"
                {...register('cardHolder')}
                placeholder="Como impresso no cartão"
                className={cn(
                  "pl-9",
                  errors.cardHolder ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
                )}
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.cardHolder && (
              <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.cardHolder.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="cardNumber" className="flex items-center gap-1 font-medium text-gray-700">
              Número do cartão <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="cardNumber"
                {...withMask('cardNumber', formatCardNumber)}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                className={cn(
                  "pl-9",
                  errors.cardNumber ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
                )}
              />
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.cardNumber && (
              <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.cardNumber.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="cardExpiry" className="flex items-center gap-1 font-medium text-gray-700">
              Validade <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="cardExpiry"
                {...withMask('cardExpiry', formatCardExpiry)}
                placeholder="MM/AA"
                maxLength={5}
                className={cn(
                  "pl-9",
                  errors.cardExpiry ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
                )}
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.cardExpiry && (
              <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.cardExpiry.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="cardCvv" className="flex items-center gap-1 font-medium text-gray-700">
              CVV <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="cardCvv"
                {...register('cardCvv')}
                placeholder="123"
                maxLength={4}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '');
                  register('cardCvv').onChange(e);
                }}
                className={cn(
                  "pl-9",
                  errors.cardCvv ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
                )}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.cardCvv && (
              <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.cardCvv.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="installments" className="flex items-center gap-1 font-medium text-gray-700 mb-1">
              Parcelas <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="installments"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    id="installments"
                    className={errors.installments ? 'border-red-300 focus:ring-red-400 bg-red-50/10' : 'font-normal'}
                  >
                    <SelectValue placeholder="Selecione o número de parcelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {installmentOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="font-normal text-gray-700">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.installments && (
              <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.installments.message}
              </p>
            )}
          </div>
        </div>
      )}

      {paymentMethod === 'dois-cartoes' && (
        <div className="space-y-6">
          <div className="border border-gray-100 rounded-lg p-5 bg-gray-50/30">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-white text-xs">1</span>
              Primeiro Cartão
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Label htmlFor="cardHolder" className="font-medium text-gray-700">Nome do titular</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="cardHolder"
                    {...register('cardHolder')}
                    placeholder="Como impresso no cartão"
                    className={cn(
                      "pl-9",
                      errors.cardHolder ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
                    )}
                  />
                </div>
                {errors.cardHolder && (
                  <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.cardHolder.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="cardNumber" className="font-medium text-gray-700">Número do cartão</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="cardNumber"
                    {...withMask('cardNumber', formatCardNumber)}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className={cn(
                      "pl-9",
                      errors.cardNumber ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
                    )}
                  />
                </div>
                {errors.cardNumber && (
                  <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.cardNumber.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="cardExpiry" className="font-medium text-gray-700">Validade</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="cardExpiry"
                    {...withMask('cardExpiry', formatCardExpiry)}
                    placeholder="MM/AA"
                    maxLength={5}
                    className={cn(
                      "pl-9",
                      errors.cardExpiry ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
                    )}
                  />
                </div>
                {errors.cardExpiry && (
                  <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.cardExpiry.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="cardCvv" className="font-medium text-gray-700">CVV</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="cardCvv"
                    {...register('cardCvv')}
                    placeholder="123"
                    maxLength={4}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, '');
                      register('cardCvv').onChange(e);
                    }}
                    className={cn(
                      "pl-9",
                      errors.cardCvv ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
                    )}
                  />
                </div>
                {errors.cardCvv && (
                  <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.cardCvv.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="amount1" className="font-medium text-gray-700">Valor a pagar neste cartão</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="amount1"
                    {...handleAmountChange('amount1', 'amount2')}
                    placeholder="R$ 0,00"
                    className={cn(
                      "pl-9",
                      errors.amount1 ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
                    )}
                  />
                </div>
                {errors.amount1 && (
                  <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.amount1.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="installments" className="font-medium text-gray-700 mb-1">Parcelas (Cartão 1)</Label>
                <Controller
                  name="installments"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="installments" className="font-normal">
                        <SelectValue placeholder="Parcelas" />
                      </SelectTrigger>
                      <SelectContent>
                        {installmentOptions1.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="font-normal text-gray-700">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-lg p-5 bg-gray-50/30">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-white text-xs">2</span>
              Segundo Cartão
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Label htmlFor="cardHolder2" className="font-medium text-gray-700">Nome do titular</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="cardHolder2"
                    {...register('cardHolder2')}
                    placeholder="Como impresso no cartão"
                    className={cn(
                      "pl-9",
                      errors.cardHolder2 ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
                    )}
                  />
                </div>
                {errors.cardHolder2 && (
                  <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.cardHolder2.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="cardNumber2" className="font-medium text-gray-700">Número do cartão</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="cardNumber2"
                    {...withMask('cardNumber2', formatCardNumber)}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className={cn(
                      "pl-9",
                      errors.cardNumber2 ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
                    )}
                  />
                </div>
                {errors.cardNumber2 && (
                  <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.cardNumber2.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="cardExpiry2" className="font-medium text-gray-700">Validade</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="cardExpiry2"
                    {...withMask('cardExpiry2', formatCardExpiry)}
                    placeholder="MM/AA"
                    maxLength={5}
                    className={cn(
                      "pl-9",
                      errors.cardExpiry2 ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
                    )}
                  />
                </div>
                {errors.cardExpiry2 && (
                  <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.cardExpiry2.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="cardCvv2" className="font-medium text-gray-700">CVV</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="cardCvv2"
                    {...register('cardCvv2')}
                    placeholder="123"
                    maxLength={4}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, '');
                      register('cardCvv2').onChange(e);
                    }}
                    className={cn(
                      "pl-9",
                      errors.cardCvv2 ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
                    )}
                  />
                </div>
                {errors.cardCvv2 && (
                  <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.cardCvv2.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="amount2" className="font-medium text-gray-700">Valor a pagar neste cartão</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="amount2"
                    {...handleAmountChange('amount2', 'amount1')}
                    placeholder="R$ 0,00"
                    className={cn(
                      "pl-9",
                      errors.amount2 ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''
                    )}
                  />
                </div>
                {errors.amount2 && (
                  <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.amount2.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="installments2" className="font-medium text-gray-700 mb-1">Parcelas (Cartão 2)</Label>
                <Controller
                  name="installments2"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="installments2" className="font-normal">
                        <SelectValue placeholder="Parcelas" />
                      </SelectTrigger>
                      <SelectContent>
                        {installmentOptions2.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="font-normal text-gray-700">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'boleto' && (
        <div className="bg-(--baby-pink) border border-(--accent-soft) rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Barcode className="w-6 h-6 text-(--accent) flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Pagamento por Boleto Bancário</h3>
              <p className="text-sm text-gray-700 mb-3">
                Ao finalizar a compra, você receberá o boleto bancário por e-mail para realizar o pagamento.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent rounded-full" />
                  O boleto vence em 3 dias úteis
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent rounded-full" />
                  Após o pagamento, a aprovação pode levar até 2 dias úteis
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent rounded-full" />
                  Você pode pagar em qualquer banco, lotérica ou pelo internet banking
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'pix' && (
        <div className="bg-(--baby-pink) border border-(--accent-soft) rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Smartphone className="w-6 h-6 text-(--accent) flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Pagamento por Pix</h3>
              <p className="text-sm text-gray-700 mb-3">
                Ao finalizar a compra, você receberá um QR Code para realizar o pagamento via Pix.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent rounded-full" />
                  Pagamento instantâneo e seguro
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent rounded-full" />
                  Aprovação imediata após o pagamento
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent rounded-full" />
                  Disponível 24 horas por dia, 7 dias por semana
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent rounded-full" />
                  Use o aplicativo do seu banco para escanear o QR Code
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 md:mt-7 flex justify-start">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
          className="btn-back border-(--navy-blue)/20 text-(--navy-blue) hover:bg-(--navy-blue) hover:text-white hover:border-(--navy-blue)"
        >
          <ArrowLeft className="arrow-icon w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    </div>
  );
}
