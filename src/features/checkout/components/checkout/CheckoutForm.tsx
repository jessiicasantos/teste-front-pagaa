import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreditCard, MapPin, User, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { checkoutSchema, type CheckoutFormData } from '../../schemas/checkoutSchema';
import { 
  formatCPF, 
  formatPhone, 
  formatZipCode, 
  formatCardNumber, 
  formatCardExpiry,
  brlCurrency
} from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import { useEffect } from 'react';

interface CheckoutFormProps {
  handleSubmit: (data: CheckoutFormData) => void;
  onInstallmentsChange?: (installments: string) => void;
}

export function CheckoutForm({ handleSubmit, onInstallmentsChange }: CheckoutFormProps) {
  const { cart } = useCart();

  const { 
    register, 
    handleSubmit: handleFormSubmit, 
    control,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      email: '',
      cpf: '',
      phone: '',
      zipCode: '',
      city: '',
      address: '',
      number: '',
      complement: '',
      cardHolder: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      installments: '',
    }
  });

  const installmentsValue = useWatch({
    control,
    name: 'installments',
  });

  useEffect(() => {
    if (onInstallmentsChange) {
      onInstallmentsChange(installmentsValue);
    }
  }, [installmentsValue, onInstallmentsChange]);

  const onSubmit = (data: CheckoutFormData) => {
    handleSubmit(data);
  };

  const hasErrors = Object.keys(errors).length > 0;

  // Helper function to wrap onChange with a formatter
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

  const total = cart?.total ?? 0;
  const installmentOptions = Array.from({ length: 12 }, (_, i) => {
    const count = i + 1;
    const value = total / count;
    return {
      value: count.toString(),
      label: `${count}x de ${brlCurrency.format(value)} ${count === 1 ? 'à vista' : 'sem juros'}`
    };
  });

  return (
    <form id="checkout-form" onSubmit={handleFormSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <div className="dados-pessoais">
          <h2 className="flex items-center gap-2 text-xl mb-6 font-semibold">
            <User className="w-5 h-5" stroke="#a7924e" />
            Dados Pessoais
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Label htmlFor="fullName" className="flex items-center gap-1 font-medium text-gray-700">
                Nome Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                {...register('fullName')}
                placeholder="João da Silva"
                className={errors.fullName ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''}
              />
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
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="joao@exemplo.com"
                className={errors.email ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''}
              />
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
              <Input
                id="cpf"
                {...withMask('cpf', formatCPF)}
                placeholder="000.000.000-00"
                maxLength={14}
                className={errors.cpf ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''}
              />
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
              <Input
                id="phone"
                {...withMask('phone', formatPhone)}
                placeholder="(11) 98765-4321"
                maxLength={15}
                className={errors.phone ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-100" />
        
        <div className="endereco-entrega">
          <h2 className="flex items-center gap-2 text-xl mb-6 font-semibold">
            <MapPin className="w-5 h-5" stroke="#a7924e" />
            Endereço de Entrega
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="zipCode" className="flex items-center gap-1 font-medium text-gray-700">
                CEP <span className="text-red-500">*</span>
              </Label>
              <Input
                id="zipCode"
                {...withMask('zipCode', formatZipCode)}
                placeholder="12345-678"
                maxLength={9}
                className={errors.zipCode ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''}
              />
              {errors.zipCode && (
                <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.zipCode.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="city" className="flex items-center gap-1 font-medium text-gray-700">
                Cidade <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="São Paulo"
                className={errors.city ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''}
              />
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
              <Input
                id="address"
                {...register('address')}
                placeholder="Rua, Avenida, etc."
                className={errors.address ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''}
              />
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
              <Input
                id="number"
                {...register('number')}
                placeholder="123"
                className={errors.number ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''}
              />
              {errors.number && (
                <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.number.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="complement" className="font-medium text-gray-700">Complemento (opcional)</Label>
              <Input
                id="complement"
                {...register('complement')}
                placeholder="Apto 45, Bloco B"
              />
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-100" />

        <div className="pagamento">
          <h2 className="flex items-center gap-2 text-xl mb-6 font-semibold">
            <CreditCard className="w-5 h-5" stroke="#a7924e" />
            Pagamento
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Label htmlFor="cardHolder" className="flex items-center gap-1 font-medium text-gray-700">
                Nome do Titular <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cardHolder"
                {...register('cardHolder')}
                placeholder="Como impresso no cartão"
                className={errors.cardHolder ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''}
              />
              {errors.cardHolder && (
                <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.cardHolder.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="cardNumber" className="flex items-center gap-1 font-medium text-gray-700">
                Número do Cartão <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cardNumber"
                {...withMask('cardNumber', formatCardNumber)}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                className={errors.cardNumber ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''}
              />
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
              <Input
                id="cardExpiry"
                {...withMask('cardExpiry', formatCardExpiry)}
                placeholder="MM/AA"
                maxLength={5}
                className={errors.cardExpiry ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''}
              />
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
              <Input
                id="cardCvv"
                {...register('cardCvv')}
                placeholder="123"
                maxLength={4}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '');
                  register('cardCvv').onChange(e);
                }}
                className={errors.cardCvv ? 'border-red-300 focus-visible:ring-red-400 bg-red-50/10' : ''}
              />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        </div>
      </Card>

      {hasErrors && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
          <p className="flex items-center gap-2 text-red-800 font-semibold mb-1">
            <AlertCircle className="w-5 h-5" />
            Dados incompletos ou incorretos
          </p>
          <p className="text-sm text-red-700">
            Por favor, revise os campos destacados acima para prosseguir com o pagamento.
          </p>
        </div>
      )}
    </form>
  );
}
