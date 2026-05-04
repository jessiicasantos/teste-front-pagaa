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
import { Header } from '@/features/checkout/components/checkout/Header/Header';
import { Footer } from '@/features/checkout/components/checkout/Footer/Footer';
import type { Order } from '@/features/checkout/types';
import { brlCurrency, parseCurrency } from '@/features/checkout/utils/formatters';

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
    <div className={span ? 'md:col-span-2' : ''}>
      <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2 ml-1">
        {label}
      </p>
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl transition-colors hover:bg-gray-100/50">
        <Icon className="w-4 h-4 flex-shrink-0 text-primary/60" />
        <span className="text-sm font-medium text-gray-900 truncate">{display}</span>
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
          <div className="flex flex-col gap-1.5 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>Cartão 1: **** {last4} * {brlCurrency.format(total)}</span>
            </div>
            {instCount > 1 && (
              <p className="text-xs text-gray-500 ml-6">Em {instCount} vezes</p>
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
          <div className="space-y-3">
            <div className="flex flex-col gap-1.5 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <CreditCard className="w-4 h-4 text-primary" />
                <span>Cartão 1: **** {last4_1} * {brlCurrency.format(val1)}</span>
              </div>
              {instCount1 > 1 && (
                <p className="text-xs text-gray-500 ml-6">Em {instCount1} vezes</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <CreditCard className="w-4 h-4 text-primary" />
                <span>Cartão 2: •••• {last4_2} * {brlCurrency.format(val2)}</span>
              </div>
              {instCount2 > 1 && (
                <p className="text-xs text-gray-500 ml-6">Em {instCount2} vezes</p>
              )}
            </div>
          </div>
        );
      }
      case 'boleto':
        return (
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
            <Barcode className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-900">Boleto bancário * {brlCurrency.format(total)}</span>
          </div>
        );
      case 'pix':
        return (
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
            <Smartphone className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-900">Pix * {brlCurrency.format(total)}</span>
          </div>
        );
      default:
        return <p className="text-gray-500">Não informado</p>;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-3">
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl opacity-50" />
              {isProcessing ? (
                <div className="relative w-24 h-24 rounded-full flex items-center justify-center">
                  <SandHourglass className="relative w-12 h-12 text-yellow-500" />
                </div>
              ) : (
                <div className="relative w-24 h-24 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={2} />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-semibold mb-3">
              {isProcessing ? 'Validando seu pagamento...' : 'Pedido Confirmado!'}
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">
              {firstName ? `Obrigada pela sua compra, ${firstName}.` : 'Obrigada pela sua compra.'}{' '}
              {isProcessing ? (
                'Só um momento enquanto processamos sua transação.'
              ) : (
                <>
                  Enviamos todos os detalhes para: {' '}
                  <span className="font-semibold text-gray-900">{order.billing.email}</span>
                </>
              )}
            </p>
          </div>

          <div className="flex justify-center mb-10">
            <div className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-full border shadow-sm transition-all duration-500 hover-lift",
              isProcessing 
                ? 'bg-yellow-50 text-yellow-800 border-yellow-100' 
                : 'bg-green-50 text-green-800 border-green-100'
            )}>
              {isProcessing ? (
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-green-600" strokeWidth={2.5} />
              )}
              <span className="text-sm font-bold uppercase tracking-wider">
                {isProcessing ? 'Aguardando confirmação' : 'Pagamento Aprovado'}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { label: 'Id Pedido', value: `#${order?.id?.toUpperCase()}`, icon: Hash, action: handleCopy, copyable: true },
              { label: 'Data', value: new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }), icon: Calendar },
              { label: 'Entrega prevista', value: getEstimatedDelivery(), icon: Truck }
            ].map((item, i) => (
              <Card key={i} className="p-5 border-gray-100 shadow-lg shadow-gray-100/50 rounded-2xl flex items-center gap-4 hover-lift border-lift">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 text-primary/60">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">{item.label}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.value}</p>
                    {item.copyable && (
                      <button onClick={item.action} className="text-gray-400 hover:text-primary transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {item.copyable && copied && <p className="text-[10px] text-green-600 font-medium">Copiado!</p>}
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-8">
            <Card className="info-card hover-lift">
              <h2 className="flex items-center gap-2 text-xl mb-8 font-bold text-gray-900">
                <Package className="w-5 h-5 text-primary stroke-(--accent)" />
                Itens do pedido ({order.cart?.products?.length ?? 0})
              </h2>
              <div className="space-y-6">
                {order.cart?.products?.map((item) => (
                  <div key={item.id} className="flex gap-6 pb-6 border-b border-gray-50 last:border-b-0 last:pb-0">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="w-24 h-24 object-cover rounded-2xl flex-shrink-0 bg-gray-50"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-1 mt-1">{item.description}</p>
                      <div className="flex items-center justify-between mt-3 flex-wrap">
                        <p className="text-sm font-medium text-gray-500">
                          {item.quantity} × {brlCurrency.format(item.price)}
                        </p>
                        <p className="font-bold text-gray-900">
                          {brlCurrency.format(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="info-card hover-lift">
                <h2 className="flex items-center gap-2 text-xl mb-6 font-bold text-gray-900">
                  <User className="w-5 h-5 text-primary stroke-(--accent)" />
                  Dados do Cliente
                </h2>
                <div className="space-y-5">
                  <InfoField icon={User} label="Nome completo" value={order.billing.fullName} span />
                  <InfoField icon={Mail} label="E-mail" value={order.billing.email} />
                  <div className="grid grid-cols-2 gap-4">
                    <InfoField icon={Fingerprint} label="CPF" value={order.billing.cpf} />
                    <InfoField icon={Phone} label="Telefone" value={order.billing.phone} />
                  </div>
                </div>
              </Card>

              <Card className="info-card hover-lift">
                <h2 className="flex items-center gap-2 text-xl mb-6 font-bold text-gray-900">
                  <MapPin className="w-5 h-5 text-primary stroke-(--accent)" />
                  Entrega
                </h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <InfoField icon={MapPin} label="CEP" value={order.billing.zipCode} />
                    <InfoField icon={Building2} label="Cidade" value={order.billing.city} />
                  </div>
                  <InfoField icon={Milestone} label="Endereço" value={`${order.billing.address}, ${order.billing.number}`} span />
                  <InfoField icon={Info} label="Complemento" value={order.billing.complement} />
                </div>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="info-card hover-lift">
                <h2 className="flex items-center gap-2 text-xl mb-6 font-bold text-gray-900">
                  <PaymentIcon className="w-5 h-5 text-primary stroke-(--accent)" />
                  Pagamento
                </h2>
                {renderPaymentDetails()}
              </Card>

              <Card className="info-card bg-gradient-to-r from-primary to-gray-900 text-white hover-lift">
                <h2 className="flex items-center gap-2 text-xl mb-8 font-bold">
                  <Receipt className="w-5 h-5 text-white/60" />
                  Resumo Financeiro
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60 font-medium">Subtotal</span>
                    <span className="font-bold">{brlCurrency.format(order.cart.subtotal ?? 0)}</span>
                  </div>

                  {order.cart.coupon && order.cart.coupon.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span className="flex items-center gap-2 font-medium">
                        <Tag className="w-4 h-4" />
                        Cupom: {order.cart.coupon.code}
                      </span>
                      <span className="font-bold">- {brlCurrency.format(order.cart.coupon.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-white/60 font-medium">Frete</span>
                    <span className="font-bold">
                      {order.cart.shipping === 0 ? 'Grátis' : brlCurrency.format(order.cart.shipping ?? 0)}
                    </span>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-baseline">
                    <span className="text-lg font-bold">Total Pago</span>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-black text-white">
                        {brlCurrency.format(order.cart.total)}
                      </span>
                      {order.billing.paymentMethod === 'cartao' && order.billing.installments && parseInt(order.billing.installments) > 1 && (
                        <p className="text-xs text-white/40 mt-1 font-medium">
                          {order.billing.installments}x de {brlCurrency.format(order.cart.total / parseInt(order.billing.installments))}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="info-card border-(--accent-soft) bg-(--baby-pink) hover-lift">
              <h2 className="flex items-center gap-2 text-xl mb-6 font-bold text-gray-900">
                <Info className="w-5 h-5 text-primary stroke-(--accent)" />
                Informações Úteis
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                    <div className="w-2 h-2 mt-1.5 bg-primary/20 rounded-full flex-shrink-0" />
                    Acompanhe o status por e-mail.
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                    <div className="w-2 h-2 mt-1.5 bg-primary/20 rounded-full flex-shrink-0" />
                    Prazo de entrega começa após aprovação.
                  </li>
                </ul>
                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-(--accent-soft)">
                  <ShieldCheck className="w-8 h-8 text-green-500 flex-shrink-0" />
                  <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                    Compra 100% segura. Seus dados estão protegidos por criptografia de ponta a ponta.
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="flex-1 h-14 rounded-2xl border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar à Loja
              </Button>
              <Button
                onClick={() => window.print()}
                className="flex-1 h-14 rounded-2xl btn-next font-bold"
              >
                <Printer className="w-5 h-5 mr-2" />
                Imprimir Comprovante
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
