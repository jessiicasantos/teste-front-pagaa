import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  CalendarCheck,
  ShoppingCart,
  ShieldCheck,
  Pencil,
  User,
  MapPin,
  CreditCard,
  WalletCards,
  Barcode,
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { brlCurrency, parseCurrency } from '../../utils/formatters';
import { type CheckoutFormData } from '../../schemas/checkoutSchema';
import '../../../../button-gradient.css';

interface ResumeStepProps {
  onBack: () => void;
  onEdit: (stepId: string) => void;
  isProcessing: boolean;
}

const PixIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 1.5l6 6-6 6-6-6z" />
    <path d="M9 6l-2 2 2 2 2-2z" />
  </svg>
);

const lastFour = (value?: string) => {
  if (!value) return '••••';
  const digits = value.replace(/\D/g, '');
  return digits.slice(-4) || '••••';
};

export const ResumeStep = ({ onBack, onEdit, isProcessing }: ResumeStepProps) => {
  const { cart } = useCart();
  const { watch } = useFormContext<CheckoutFormData>();

  const total = cart?.total ?? 0;
  const isEmpty = !cart || cart.products.length === 0;

  const fullName = watch('fullName');
  const email = watch('email');
  const cpf = watch('cpf');
  const phone = watch('phone');

  const zipCode = watch('zipCode');
  const city = watch('city');
  const address = watch('address');
  const number = watch('number');
  const complement = watch('complement');

  const paymentMethod = watch('paymentMethod');
  const cardNumber = watch('cardNumber');
  const cardNumber2 = watch('cardNumber2');
  const installments = watch('installments');
  const installments2 = watch('installments2');
  const amount1 = parseCurrency(watch('amount1') || '0');
  const amount2 = parseCurrency(watch('amount2') || '0');

  const installmentsCount = installments ? parseInt(installments) : 1;
  const installmentValue = total / installmentsCount;
  const installmentsCount1 = installments ? parseInt(installments) : 1;
  const installmentsCount2 = installments2 ? parseInt(installments2) : 1;

  const paymentLabel = (() => {
    switch (paymentMethod) {
      case 'cartao':
        return 'Cartão de crédito';
      case 'dois-cartoes':
        return 'Dois cartões';
      case 'boleto':
        return 'Boleto bancário';
      case 'pix':
        return 'Pix';
      default:
        return '—';
    }
  })();

  const PaymentIcon = ({ className }: { className?: string }) => {
    if (paymentMethod === 'dois-cartoes') return <WalletCards className={className} />;
    if (paymentMethod === 'boleto') return <Barcode className={className} />;
    if (paymentMethod === 'pix') return <PixIcon className={className} />;
    return <CreditCard className={className} />;
  };

  return (
    <div className="resumo">
      <h2 className="flex items-center gap-2 text-lg md:text-xl mb-1 font-semibold">
        <CalendarCheck className="w-5 h-5" stroke="var(--accent)" />
        Resumo do Pedido
      </h2>
      <p className="text-sm text-gray-600 mb-5">
        Confira seus dados antes de finalizar a compra.
      </p>

      <div className="space-y-3 mb-5">
        <section className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <User className="w-4 h-4" stroke="var(--accent)" />
              Dados pessoais
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit('personal')}
              disabled={isProcessing}
              className="h-7 px-2 text-(--navy-blue) hover:bg-(--navy-blue) hover:text-white"
            >
              <Pencil className="w-3.5 h-3.5 mr-1" />
              <span className="text-xs">Editar</span>
            </Button>
          </div>
          <div className="text-sm text-gray-600 space-y-0.5">
            <p className="text-gray-900 font-medium">{fullName || '—'}</p>
            <p>{email || '—'}</p>
            <p>
              CPF: {cpf || '—'}
              <span className="mx-1.5 text-gray-300">·</span>
              Tel: {phone || '—'}
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <MapPin className="w-4 h-4" stroke="var(--accent)" />
              Endereço de entrega
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit('address')}
              disabled={isProcessing}
              className="h-7 px-2 text-(--navy-blue) hover:bg-(--navy-blue) hover:text-white"
            >
              <Pencil className="w-3.5 h-3.5 mr-1" />
              <span className="text-xs">Editar</span>
            </Button>
          </div>
          <div className="text-sm text-gray-600 space-y-0.5">
            <p className="text-gray-900 font-medium">
              {address || '—'}{number ? `, ${number}` : ''}
            </p>
            {complement && <p>{complement}</p>}
            <p>
              {city || '—'}
              {zipCode && (
                <>
                  <span className="mx-1.5 text-gray-300">·</span>
                  CEP: {zipCode}
                </>
              )}
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <PaymentIcon className="w-4 h-4 text-(--accent)" />
              Forma de pagamento
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEdit('payment')}
              disabled={isProcessing}
              className="h-7 px-2 text-(--navy-blue) hover:bg-(--navy-blue) hover:text-white"
            >
              <Pencil className="w-3.5 h-3.5 mr-1" />
              <span className="text-xs">Editar</span>
            </Button>
          </div>
          <div className="text-sm text-gray-600 space-y-0.5">
            <p className="text-gray-900 font-medium">{paymentLabel}</p>
            {paymentMethod === 'cartao' && (
              <p>
                •••• •••• •••• {lastFour(cardNumber)}
                <span className="mx-1.5 text-gray-300">·</span>
                {installmentsCount}x de {brlCurrency.format(installmentValue)} {installmentsCount === 1 ? 'à vista' : 'sem juros'}
              </p>
            )}
            {paymentMethod === 'dois-cartoes' && (
              <>
                <p>
                  Cartão 1: •••• {lastFour(cardNumber)}
                  <span className="mx-1.5 text-gray-300">·</span>
                  {installmentsCount1}x de {brlCurrency.format(amount1 / installmentsCount1)}
                </p>
                <p>
                  Cartão 2: •••• {lastFour(cardNumber2)}
                  <span className="mx-1.5 text-gray-300">·</span>
                  {installmentsCount2}x de {brlCurrency.format(amount2 / installmentsCount2)}
                </p>
              </>
            )}
            {paymentMethod === 'boleto' && (
              <p>O boleto será enviado por e-mail após finalizar.</p>
            )}
            {paymentMethod === 'pix' && (
              <p>Você receberá o QR Code após finalizar.</p>
            )}
          </div>
        </section>
      </div>

      <Separator className="my-4 md:my-5" />

      <section className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">{brlCurrency.format(cart?.subtotal ?? 0)}</span>
        </div>

        {cart?.coupon && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Desconto ({cart.coupon.code})</span>
            <span className="font-medium">- {brlCurrency.format(cart.coupon.discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Frete</span>
          <span className="font-medium text-gray-900">
            {cart?.shipping === 0 ? 'Grátis' : brlCurrency.format(cart?.shipping ?? 0)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Impostos (5%)</span>
          <span className="font-medium text-gray-900">{brlCurrency.format(cart?.taxes ?? 0)}</span>
        </div>
      </section>

      {paymentMethod === 'dois-cartoes' ? (
        <div className="space-y-1 text-right mt-3">
          <p className="text-xs text-gray-500 italic flex justify-between">
            Cartão 1: <em>{installmentsCount1}x de {brlCurrency.format(amount1 / installmentsCount1)}</em>
          </p>
          <p className="text-xs text-gray-500 italic flex justify-between">
            Cartão 2: <em>{installmentsCount2}x de {brlCurrency.format(amount2 / installmentsCount2)}</em>
          </p>
        </div>
      ) : (
        installments && installmentsCount > 1 && (
          <p className="text-right text-sm text-gray-500 mt-2 italic">
            em {installmentsCount}x de {brlCurrency.format(installmentValue)} sem juros
          </p>
        )
      )}

      <div className="flex justify-between items-center mt-4 mb-5">
        <span className="text-base font-semibold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-gray-900">{brlCurrency.format(total)}</span>
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          form="checkout-form"
          className="w-full h-14 text-base font-semibold btn-checkout"
          disabled={isProcessing || isEmpty}
        >
          {isProcessing ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processando pagamento...</span>
            </>
          ) : (
            <>
              <ShoppingCart size="20" />
              <span>Finalizar Compra</span>
            </>
          )}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5" stroke="#008236" />
          Ao finalizar, você concorda com nossos termos de uso
        </p>
      </div>

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
};
