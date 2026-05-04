import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  CalendarCheck,
  ShoppingCart,
  ShieldCheck,
  User,
  MapPin,
  CreditCard,
  WalletCards,
  Barcode,
} from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { brlCurrency, parseCurrency } from '../../../utils/formatters';
import { type CheckoutFormData } from '../../../schemas/checkoutSchema';
import { PixIcon } from '../fields/PixIcon';
import { SummarySection } from './SummarySection';
import './ResumeStep.css';

interface ResumeStepProps {
  onBack: () => void;
  onEdit: (stepId: string) => void;
  isProcessing: boolean;
}

const lastFour = (value?: string) => {
  if (!value) return '••••';
  const digits = value.replace(/\D/g, '');
  return digits.slice(-4) || '••••';
};

const PAYMENT_LABELS: Record<string, string> = {
  cartao: 'Cartão de crédito',
  'dois-cartoes': 'Dois cartões',
  boleto: 'Boleto bancário',
  pix: 'Pix',
};

export const ResumeStep = ({ onEdit, isProcessing }: ResumeStepProps) => {
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

  const paymentLabel = PAYMENT_LABELS[paymentMethod] ?? '—';

  const PaymentIcon = ({ className }: { className?: string }) => {
    if (paymentMethod === 'dois-cartoes') return <WalletCards className={className} />;
    if (paymentMethod === 'boleto') return <Barcode className={className} />;
    if (paymentMethod === 'pix') return <PixIcon className={className} strokeWidth={1.8} />;
    return <CreditCard className={className} />;
  };

  return (
    <div className="resume-step">
      <h2 className="step-heading">
        <CalendarCheck />
        Resumo do Pedido
      </h2>
      <p className="step-subtitle">
        Confira seus dados antes de finalizar a compra.
      </p>

      <div className="resume-step-sections">
        <SummarySection
          icon={User}
          title="Dados pessoais"
          onEdit={() => onEdit('personal')}
          disabled={isProcessing}
        >
          <p>{fullName || '—'}</p>
          <p>{email || '—'}</p>
          <p>
            CPF: {cpf || '—'}
            <span className="summary-section-divider">·</span>
            Tel: {phone || '—'}
          </p>
        </SummarySection>

        <SummarySection
          icon={MapPin}
          title="Endereço de entrega"
          onEdit={() => onEdit('address')}
          disabled={isProcessing}
        >
          <p>
            {address || '—'}{number ? `, ${number}` : ''}
          </p>
          {complement && <p>{complement}</p>}
          <p>
            {city || '—'}
            {zipCode && (
              <>
                <span className="summary-section-divider">·</span>
                CEP: {zipCode}
              </>
            )}
          </p>
        </SummarySection>

        <SummarySection
          icon={PaymentIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>}
          title="Forma de pagamento"
          onEdit={() => onEdit('payment')}
          disabled={isProcessing}
        >
          <p>{paymentLabel}</p>
          {paymentMethod === 'cartao' && (
            <p>
              •••• •••• •••• {lastFour(cardNumber)}
              <span className="summary-section-divider">·</span>
              {installmentsCount}x de {brlCurrency.format(installmentValue)} {installmentsCount === 1 ? 'à vista' : 'sem juros'}
            </p>
          )}
          {paymentMethod === 'dois-cartoes' && (
            <>
              <p>
                Cartão 1: •••• {lastFour(cardNumber)}
                <span className="summary-section-divider">·</span>
                {installmentsCount1}x de {brlCurrency.format(amount1 / installmentsCount1)}
              </p>
              <p>
                Cartão 2: •••• {lastFour(cardNumber2)}
                <span className="summary-section-divider">·</span>
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
        </SummarySection>
      </div>

      <Separator className="my-4 md:my-5" />

      <section className="resume-step-totals">
        <div className="resume-step-totals-row">
          <span className="label">Subtotal</span>
          <span className="value">{brlCurrency.format(cart?.subtotal ?? 0)}</span>
        </div>

        {cart?.coupon && (
          <div className="resume-step-totals-row is-discount">
            <span className="label">Desconto ({cart.coupon.code})</span>
            <span className="value">- {brlCurrency.format(cart.coupon.discount)}</span>
          </div>
        )}

        <div className="resume-step-totals-row">
          <span className="label">Frete</span>
          <span className="value">
            {cart?.shipping === 0 ? 'Grátis' : brlCurrency.format(cart?.shipping ?? 0)}
          </span>
        </div>

        <div className="resume-step-totals-row">
          <span className="label">Impostos (5%)</span>
          <span className="value">{brlCurrency.format(cart?.taxes ?? 0)}</span>
        </div>
      </section>

      <div className="resume-step-total">
        <span className="resume-step-total-label">Total</span>
        <span className="resume-step-total-value">{brlCurrency.format(total)}</span>
      </div>

      {paymentMethod === 'dois-cartoes' ? (
        <div className="resume-step-installments-multi">
          <p>
            Cartão 1: <em>{installmentsCount1}x de {brlCurrency.format(amount1 / installmentsCount1)}</em>
          </p>
          <p>
            Cartão 2: <em>{installmentsCount2}x de {brlCurrency.format(amount2 / installmentsCount2)}</em>
          </p>
        </div>
      ) : (
        installments && installmentsCount > 1 && (
          <p className="resume-step-installments">
            em {installmentsCount}x de {brlCurrency.format(installmentValue)} sem juros
          </p>
        )
      )}

      <div className="resume-step-finalize">
        <Button
          type="submit"
          form="checkout-form"
          className="resume-step-finalize-button btn-checkout"
          disabled={isProcessing || isEmpty}
        >
          {isProcessing ? (
            <>
              <span className="resume-step-spinner" />
              <span>Processando pagamento...</span>
            </>
          ) : (
            <>
              <ShoppingCart size="20" />
              <span>Finalizar Compra</span>
            </>
          )}
        </Button>

        <p className="resume-step-secure-note">
          <ShieldCheck className="w-3.5 h-3.5" stroke="#008236" />
          Ao finalizar, você concorda com nossos termos de uso
        </p>
      </div>
    </div>
  );
};
