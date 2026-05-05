import { useLocation, useNavigate } from 'react-router';
import {
  CheckCircle2, Package, MapPin, CreditCard, Barcode, Smartphone, WalletCards,
  User, Mail, Fingerprint, Phone, Building2, Milestone, Info,
  Calendar, Hash, Copy, Truck, ShieldCheck, ArrowLeft, Printer, Receipt, Tag
} from 'lucide-react';
import { useEffect, useState, type ComponentType, type SVGProps } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Order } from '@/features/Checkout/types';
import { brlCurrency, parseCurrency } from '@/features/Checkout/utils/formatters';
import { useCart } from '@/features/Checkout/hooks/useCart';
import './ConfirmationPage.css';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface InfoFieldProps {
  icon: IconType;
  label: string;
  value?: string | null;
  span?: boolean;
}

function InfoField({ icon: Icon, label, value, span = false }: InfoFieldProps) {
  const display = value && value.trim() !== '' ? value : '—';
  return (
    <div className={span ? 'info-field-span-2' : ''}>
      <p className="info-field-label">
        {label}
      </p>
      <div className="info-field-container">
        <Icon className="info-field-icon" />
        <span className="info-field-value">{display}</span>
      </div>
    </div>
  );
}

function SandHourglass({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <defs>
        <clipPath id="sand-clip-path">
          <path d="M12 12l7-7V2H5v3l7 7-7 7v3h14v-3l-7-7z" />
        </clipPath>
      </defs>
      
      <path d="M5 2h14" />
      <path d="M5 22h14" />
      <path d="M12 12l7-7V2H5v3l7 7-7 7v3h14v-3l-7-7z" />
      
      <g clipPath="url(#sand-clip-path)">
        <rect
          x="5"
          y="2"
          width="14"
          height="10"
          fill="currentColor"
          className="animate-sand-top"
        />
        <rect
          x="5"
          y="12"
          width="14"
          height="10"
          fill="currentColor"
          className="animate-sand-bottom"
        />
      </g>
      
      <line
        x1="12"
        y1="11"
        x2="12"
        y2="21"
        stroke="currentColor"
        strokeDasharray="1 1"
        className="animate-sand-line"
      />
    </svg>
  );
}

export function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const order = location.state?.order as Order | undefined;
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);

  window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    if (!order) {
      navigate('/');
      return;
    }

    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  const handleBack = () => {
    localStorage.clear();
    clearCart();

    navigate('/');
  }

  const handleCopy = async () => {
    if (!order.id) return;
    try {
      await navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors silently
    }
  };

  const getEstimatedDelivery = () => {
    const extraDays = order.billing.paymentMethod === 'boleto' ? 8 : 5;
    const date = new Date(order.createdAt);
    date.setDate(date.getDate() + extraDays);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  };

  const firstName = order.billing.fullName?.trim().split(' ')[0] ?? '';

  const paymentIcons = {
    cartao: CreditCard,
    'dois-cartoes': WalletCards,
    boleto: Barcode,
    pix: Smartphone,
  };
  const PaymentIcon = paymentIcons[order.billing.paymentMethod] || CreditCard;

  const renderPaymentDetails = () => {
    const {
      paymentMethod, installments, installments2,
      amount1, amount2, cardNumber, cardNumber2,
    } = order.billing;

    const total = order.cart.total;

    switch (paymentMethod) {
      case 'cartao': {
        const last4 = cardNumber?.replace(/\s/g, '').slice(-4) || '****';
        const instCount = parseInt(installments || '1');
        return (
          <div className="payment-details-card">
            <div className="payment-details-row">
              <CreditCard className="payment-details-icon" />
              <span>Cartão 1: **** {last4} * {brlCurrency.format(total)}</span>
            </div>
            {instCount > 1 && (
              <p className="payment-details-installments">Em {instCount} vezes</p>
            )}
          </div>
        );
      }
      case 'dois-cartoes': {
        const last4_1 = cardNumber?.replace(/\s/g, '').slice(-4) || '****';
        const last4_2 = cardNumber2?.replace(/\s/g, '').slice(-4) || '****';
        const instCount1 = parseInt(installments || '1');
        const instCount2 = parseInt(installments2 || '1');
        const val1 = parseCurrency(amount1 || '0');
        const val2 = parseCurrency(amount2 || '0');

        return (
          <div className="payment-details-list">
            <div className="payment-details-card">
              <div className="payment-details-row">
                <CreditCard className="payment-details-icon" />
                <span>Cartão 1: **** {last4_1} * {brlCurrency.format(val1)}</span>
              </div>
              {instCount1 > 1 && (
                <p className="payment-details-installments">Em {instCount1} vezes</p>
              )}
            </div>
            <div className="payment-details-card">
              <div className="payment-details-row">
                <CreditCard className="payment-details-icon" />
                <span>Cartão 2: •••• {last4_2} * {brlCurrency.format(val2)}</span>
              </div>
              {instCount2 > 1 && (
                <p className="payment-details-installments">Em {instCount2} vezes</p>
              )}
            </div>
          </div>
        );
      }
      case 'boleto':
        return (
          <div className="payment-details-row info-field-container">
            <Barcode className="payment-details-icon" />
            <span className="info-field-value">Boleto bancário * {brlCurrency.format(total)}</span>
          </div>
        );
      case 'pix':
        return (
          <div className="payment-details-row info-field-container">
            <Smartphone className="payment-details-icon" />
            <span className="info-field-value">Pix * {brlCurrency.format(total)}</span>
          </div>
        );
      default:
        return <p className="text-gray-500">Não informado</p>;
    }
  };

  return (
    <main className="confirm-wrapper">
      <div className="confirm-container">
        <div className="head-details">
          <div className="animated-icons">
            <div className="animated-icons-bg" />
            {isProcessing ? (
              <div className="icon-wrapper">
                <SandHourglass className="status-icon-processing" />
              </div>
            ) : (
              <div className="icon-wrapper">
                <CheckCircle2 className="status-icon-check" strokeWidth={2} />
              </div>
            )}
          </div>
          <h1 className="confirm-title">
            {isProcessing ? 'Validando seu pagamento...' : 'Pedido Confirmado!'}
          </h1>
          <p className="confirm-description">
            {firstName ? `Obrigada pela sua compra, ${firstName}.` : 'Obrigada pela sua compra.'}{' '}
            {isProcessing ? (
              'Só um momento enquanto processamos sua transação.'
            ) : (
              <>
                Enviamos todos os detalhes para: {' '}
                <span className="confirm-email">{order.billing.email}</span>
              </>
            )}
          </p>
        </div>

        <div className="status-badge-wrapper">
          <div className={cn(
            "status-badge hover-lift",
            isProcessing 
              ? 'status-badge-processing' 
              : 'status-badge-approved'
          )}>
            {isProcessing ? (
              <span className="status-dot-processing" />
            ) : (
              <CheckCircle2 className="status-icon-approved" strokeWidth={2.5} />
            )}
            <span className="status-text">
              {isProcessing ? 'Aguardando confirmação' : 'Pagamento Aprovado'}
            </span>
          </div>
        </div>

        <div className="top-info-grid">
          {[
            { label: 'Id Pedido', value: `#${order?.id?.toUpperCase()}`, icon: Hash, action: handleCopy, copyable: true },
            { label: 'Data', value: new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }), icon: Calendar },
            { label: 'Entrega prevista', value: getEstimatedDelivery(), icon: Truck }
          ].map((item, i) => (
            <Card key={i} className="top-info-card hover-lift border-lift">
              <div className="top-info-icon-wrapper">
                <item.icon className="top-info-icon" />
              </div>
              <div className="top-info-content">
                <p className="top-info-label">{item.label}</p>
                <div className="top-info-value-wrapper">
                  <p className="top-info-value">{item.value}</p>
                  {item.copyable && (
                    <button onClick={item.action} className="top-info-copy-button">
                      <Copy className="top-info-copy-icon" />
                    </button>
                  )}
                </div>
                {item.copyable && copied && <p className="top-info-copied-text">Copiado!</p>}
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-8">
          <Card className="info-card hover-lift">
            <h2 className="section-title">
              <Package className="section-icon" />
              Itens do pedido ({order.cart?.products?.length ?? 0})
            </h2>
            <div className="items-list">
              {order.cart?.products?.map((item) => (
                <div key={item.id} className="item-row">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h3 className="item-title">{item.title}</h3>
                    <p className="item-description">{item.description}</p>
                    <div className="item-price-row">
                      <p className="item-quantity">
                        {item.quantity} × {brlCurrency.format(item.price)}
                      </p>
                      <p className="item-total">
                        {brlCurrency.format(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="info-sections-grid">
            <Card className="info-card hover-lift">
              <h2 className="section-title">
                <User className="section-icon" />
                Dados do Cliente
              </h2>
              <div className="section-content">
                <InfoField icon={User} label="Nome completo" value={order.billing.fullName} span />
                <InfoField icon={Mail} label="E-mail" value={order.billing.email} />
                <div className="field-grid-2">
                  <InfoField icon={Fingerprint} label="CPF" value={order.billing.cpf} />
                  <InfoField icon={Phone} label="Telefone" value={order.billing.phone} />
                </div>
              </div>
            </Card>

            <Card className="info-card hover-lift">
              <h2 className="section-title">
                <MapPin className="section-icon" />
                Entrega
              </h2>
              <div className="section-content">
                <div className="field-grid-2">
                  <InfoField icon={MapPin} label="CEP" value={order.billing.zipCode} />
                  <InfoField icon={Building2} label="Cidade" value={order.billing.city} />
                </div>
                <InfoField icon={Milestone} label="Endereço" value={`${order.billing.address}, ${order.billing.number}`} span />
                <InfoField icon={Info} label="Complemento" value={order.billing.complement} />
              </div>
            </Card>
          </div>

          <div className="info-sections-grid">
            <Card className="info-card hover-lift">
              <h2 className="section-title">
                <PaymentIcon className="section-icon" />
                Pagamento
              </h2>
              {renderPaymentDetails()}
            </Card>

            <Card className="info-card summary-card bg-(--baby-pink) hover-lift">
              <h2 className="section-title">
                <Receipt className="summary-icon" />
                Resumo Financeiro
              </h2>
              <div className="summary-content">
                <div className="summary-row">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-value">{brlCurrency.format(order.cart.subtotal ?? 0)}</span>
                </div>

                {order.cart.coupon && order.cart.coupon.discount > 0 && (
                  <div className="summary-row summary-row-discount">
                    <span className="summary-coupon-label">
                      <Tag className="summary-coupon-icon" />
                      Cupom: {order.cart.coupon.code}
                    </span>
                    <span className="summary-value">- {brlCurrency.format(order.cart.coupon.discount)}</span>
                  </div>
                )}

                <div className="summary-row">
                  <span className="summary-label">Frete</span>
                  <span className="summary-value">
                    {order.cart.shipping === 0 ? 'Grátis' : brlCurrency.format(order.cart.shipping ?? 0)}
                  </span>
                </div>

                <div className="summary-total-row">
                  <span className="summary-total-label">Total Pago</span>
                  <div className="summary-total-amount-wrapper">
                    <span className="summary-total-amount">
                      {brlCurrency.format(order.cart.total)}
                    </span>
                    {order.billing.paymentMethod === 'cartao' && order.billing.installments && parseInt(order.billing.installments) > 1 && (
                      <p className="summary-total-installments">
                        {order.billing.installments}x de {brlCurrency.format(order.cart.total / parseInt(order.billing.installments))}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="info-card useful-info-card hover-lift">
            <h2 className="section-title">
              <Info className="section-icon" />
              Informações Úteis
            </h2>
            <div className="useful-info-grid">
              <ul className="useful-info-list">
                <li className="useful-info-item">
                  <div className="useful-info-bullet" />
                  Acompanhe o status por e-mail.
                </li>
                <li className="useful-info-item">
                  <div className="useful-info-bullet" />
                  Prazo de entrega começa após aprovação.
                </li>
              </ul>
              <div className="security-badge">
                <ShieldCheck className="security-icon" />
                <p className="security-text">
                  Compra 100% segura. Seus dados estão protegidos por criptografia de ponta a ponta.
                </p>
              </div>
            </div>
          </Card>

          <div className="action-buttons">
            <Button
              onClick={handleBack}
              variant="outline"
              className="btn-secondary btn-back btn-back-h-gray"
            >
              <ArrowLeft className="btn-icon arrow-icon" />
              Voltar à Loja
            </Button>
            <Button
              onClick={() => window.print()}
              className="btn-primary btn-next"
            >
              <Printer className="btn-icon" />
              Imprimir Comprovante
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
