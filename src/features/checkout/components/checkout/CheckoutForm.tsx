import { useForm } from 'react-hook-form';
import { CreditCard, MapPin, User, AlertCircle } from 'lucide-react';
import type { FormData } from '../CheckoutPage';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CheckoutFormProps {
  onSubmit: (data: Partial<FormData>) => void;
}

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const handleFormSubmit = () => {
    // Sempre submete, mesmo com erros
    const formData = getValues();
    onSubmit(formData);
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatZipCode = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})\d+?$/, '$1');
  };

  const formatCardExpiry = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\/\d{2})\d+?$/, '$1');
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form id="checkout-form" onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }} className="space-y-6">
      <Card className="p-6">
        <div className="dados-pessoais">
          <h2 className="flex items-center gap-2 text-xl mb-6">
            <User className="w-5 h-5" />
            Dados Pessoais
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Label htmlFor="name" className="flex items-center gap-1">
                Nome Completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register('name', {
                  minLength: { value: 3, message: 'Nome deve ter pelo menos 3 caracteres' },
                  validate: (value) => {
                    if (!value || value.trim() === '') return 'Por favor, informe seu nome completo';
                    return true;
                  }
                })}
                placeholder="João da Silva"
                className={errors.name ? 'border-amber-300 focus-visible:ring-amber-400 bg-amber-50/30' : ''}
              />
              {errors.name && (
                <p className="text-sm text-amber-700 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-1">
                E-mail <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Por favor, informe seu e-mail',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Por favor, informe um e-mail válido'
                  }
                })}
                placeholder="joao@exemplo.com"
                className={errors.email ? 'border-amber-300 focus-visible:ring-amber-400 bg-amber-50/30' : ''}
              />
              {errors.email && (
                <p className="text-sm text-amber-700 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="cpf" className="flex items-center gap-1">
                CPF <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cpf"
                {...register('cpf', {
                  required: 'Por favor, informe seu CPF',
                  pattern: {
                    value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                    message: 'CPF incompleto ou inválido'
                  },
                  minLength: { value: 14, message: 'CPF incompleto' }
                })}
                placeholder="000.000.000-00"
                maxLength={14}
                onChange={(e) => {
                  e.target.value = formatCPF(e.target.value);
                }}
                className={errors.cpf ? 'border-amber-300 focus-visible:ring-amber-400 bg-amber-50/30' : ''}
              />
              {errors.cpf && (
                <p className="text-sm text-amber-700 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.cpf.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="phone" className="flex items-center gap-1">
                Telefone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                {...register('phone', {
                  required: 'Por favor, informe seu telefone',
                  pattern: {
                    value: /^\(\d{2}\) \d{5}-\d{4}$/,
                    message: 'Telefone incompleto ou inválido'
                  },
                  minLength: { value: 15, message: 'Telefone incompleto' }
                })}
                placeholder="(11) 98765-4321"
                maxLength={15}
                onChange={(e) => {
                  e.target.value = formatPhone(e.target.value);
                }}
                className={errors.phone ? 'border-amber-300 focus-visible:ring-amber-400 bg-amber-50/30' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-amber-700 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <hr className="my-5" />
        
        <div className="endereco-entrega">
          <h2 className="flex items-center gap-2 text-xl mb-6">
            <MapPin className="w-5 h-5" />
            Endereço de Entrega
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="zipCode" className="flex items-center gap-1">
                CEP <span className="text-red-500">*</span>
              </Label>
              <Input
                id="zipCode"
                {...register('zipCode', {
                  required: 'Por favor, informe o CEP',
                  pattern: {
                    value: /^\d{5}-\d{3}$/,
                    message: 'CEP incompleto ou inválido'
                  },
                  minLength: { value: 9, message: 'CEP incompleto' }
                })}
                placeholder="12345-678"
                maxLength={9}
                onChange={(e) => {
                  e.target.value = formatZipCode(e.target.value);
                }}
                className={errors.zipCode ? 'border-amber-300 focus-visible:ring-amber-400 bg-amber-50/30' : ''}
              />
              {errors.zipCode && (
                <p className="text-sm text-amber-700 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.zipCode.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="city" className="flex items-center gap-1">
                Cidade <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                {...register('city', {
                  required: 'Por favor, informe a cidade',
                  minLength: { value: 2, message: 'Nome da cidade muito curto' }
                })}
                placeholder="São Paulo"
                className={errors.city ? 'border-amber-300 focus-visible:ring-amber-400 bg-amber-50/30' : ''}
              />
              {errors.city && (
                <p className="text-sm text-amber-700 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.city.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="street" className="flex items-center gap-1">
                Rua <span className="text-red-500">*</span>
              </Label>
              <Input
                id="street"
                {...register('street', {
                  required: 'Por favor, informe a rua',
                  minLength: { value: 3, message: 'Nome da rua muito curto' }
                })}
                placeholder="Rua das Flores"
                className={errors.street ? 'border-amber-300 focus-visible:ring-amber-400 bg-amber-50/30' : ''}
              />
              {errors.street && (
                <p className="text-sm text-amber-700 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.street.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="number" className="flex items-center gap-1">
                Número <span className="text-red-500">*</span>
              </Label>
              <Input
                id="number"
                {...register('number', { required: 'Por favor, informe o número' })}
                placeholder="123"
                className={errors.number ? 'border-amber-300 focus-visible:ring-amber-400 bg-amber-50/30' : ''}
              />
              {errors.number && (
                <p className="text-sm text-amber-700 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.number.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="complement">Complemento (opcional)</Label>
              <Input
                id="complement"
                {...register('complement')}
                placeholder="Apto 45, Bloco B"
              />
            </div>
          </div>
        </div>

        <hr className="my-5" />

        <div className="pagamento">
          <h2 className="flex items-center gap-2 text-xl mb-6">
            <CreditCard className="w-5 h-5" />
            Pagamento
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Label htmlFor="cardHolder" className="flex items-center gap-1">
                Nome do Titular <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cardHolder"
                {...register('cardHolder', {
                  required: 'Por favor, informe o nome do titular',
                  minLength: { value: 3, message: 'Nome deve ter pelo menos 3 caracteres' }
                })}
                placeholder="Nome como impresso no cartão"
                className={errors.cardHolder ? 'border-amber-300 focus-visible:ring-amber-400 bg-amber-50/30' : ''}
              />
              {errors.cardHolder && (
                <p className="text-sm text-amber-700 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.cardHolder.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="cardNumber" className="flex items-center gap-1">
                Número do Cartão <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cardNumber"
                {...register('cardNumber', {
                  required: 'Por favor, informe o número do cartão',
                  pattern: {
                    value: /^\d{4} \d{4} \d{4} \d{4}$/,
                    message: 'Número do cartão incompleto ou inválido'
                  },
                  minLength: { value: 19, message: 'Número do cartão incompleto' }
                })}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                onChange={(e) => {
                  e.target.value = formatCardNumber(e.target.value);
                }}
                className={errors.cardNumber ? 'border-amber-300 focus-visible:ring-amber-400 bg-amber-50/30' : ''}
              />
              {errors.cardNumber && (
                <p className="text-sm text-amber-700 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.cardNumber.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="cardExpiry" className="flex items-center gap-1">
                Validade <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cardExpiry"
                {...register('cardExpiry', {
                  required: 'Por favor, informe a validade',
                  pattern: {
                    value: /^\d{2}\/\d{2}$/,
                    message: 'Formato inválido (use MM/AA)'
                  },
                  minLength: { value: 5, message: 'Validade incompleta' }
                })}
                placeholder="12/28"
                maxLength={5}
                onChange={(e) => {
                  e.target.value = formatCardExpiry(e.target.value);
                }}
                className={errors.cardExpiry ? 'border-amber-300 focus-visible:ring-amber-400 bg-amber-50/30' : ''}
              />
              {errors.cardExpiry && (
                <p className="text-sm text-amber-700 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.cardExpiry.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="cardCvv" className="flex items-center gap-1">
                CVV <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cardCvv"
                {...register('cardCvv', {
                  required: 'Por favor, informe o CVV',
                  pattern: {
                    value: /^\d{3,4}$/,
                    message: 'CVV deve ter 3 ou 4 dígitos'
                  },
                  minLength: { value: 3, message: 'CVV incompleto' }
                })}
                placeholder="123"
                maxLength={4}
                type="text"
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '');
                }}
                className={errors.cardCvv ? 'border-amber-300 focus-visible:ring-amber-400 bg-amber-50/30' : ''}
              />
              {errors.cardCvv && (
                <p className="text-sm text-amber-700 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.cardCvv.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {hasErrors && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="flex items-center gap-2 text-amber-800 font-medium mb-1">
            <AlertCircle className="w-5 h-5" />
            Atenção aos campos destacados
          </p>
          <p className="text-sm text-amber-700">
            Alguns campos estão incompletos ou inválidos. Você pode continuar, mas recomendamos revisar as informações.
          </p>
        </div>
      )}
    </form>
  );
}
