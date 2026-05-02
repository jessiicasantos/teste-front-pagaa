import { useLocation, useNavigate } from 'react-router';
import {
  CheckCircle2, Package, MapPin, CreditCard, Barcode, Smartphone, WalletCards,
  User, Mail, Fingerprint, Phone, Building2, Milestone, Home, Info,
  Calendar, Hash, Copy, Truck, ShieldCheck, ArrowLeft, Printer, Receipt, Tag
} from 'lucide-react';
import { useEffect, useState, type ComponentType, type SVGProps } from 'react';
import { brlCurrency, parseCurrency } from '../utils/formatters';
import { Header } from './Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Footer } from './Footer';
import type { Order } from '../types';

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
      <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
        {label}
      </p>
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-(--baby-pink)/50 border border-(--accent-soft)/70 rounded-lg">
        <Icon className="w-4 h-4 flex-shrink-0" stroke="var(--accent)" />
        <span className="text-sm font-medium text-gray-900 truncate">{display}</span>
      </div>
    </div>
  );
}

export function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as Order | undefined;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!order) {
      navigate('/');
    }
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

  const statusConfig = {
    pending: {
      label: 'Aguardando pagamento',
      dotColor: 'bg-yellow-500',
      pillClass: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    },
    completed: {
      label: 'Pagamento confirmado',
      dotColor: 'bg-green-500',
      pillClass: 'bg-green-50 text-green-800 border-green-200',
    },
    cancelled: {
      label: 'Pedido cancelado',
      dotColor: 'bg-red-500',
      pillClass: 'bg-red-50 text-red-800 border-red-200',
    },
  } as const;

  const status = statusConfig[order.status];
  const firstName = order.billing.fullName?.trim().split(' ')[0] ?? '';

  const renderPaymentDetails = () => {
    const {
      paymentMethod, installments, installments2,
      amount1, amount2, cardNumber, cardNumber2, cardHolder, cardHolder2,
    } = order.billing;

    switch (paymentMethod) {
      case 'cartao': {
        const count = parseInt(installments || '1');
        const installmentValue = order.cart.total / count;
        return (
          <div className="grid md:grid-cols-2 gap-5">
            <InfoField icon={CreditCard} label="Forma de pagamento" value="Cartão de crédito" span />
            <InfoField icon={User} label="Titular" value={cardHolder} />
            <InfoField
              icon={Hash}
              label="Cartão"
              value={cardNumber ? `•••• •••• •••• ${cardNumber.slice(-4)}` : ''}
            />
            <InfoField
              icon={Calendar}
              label="Parcelamento"
              value={`${count}x de ${brlCurrency.format(installmentValue)}${count > 1 ? ' sem juros' : ' à vista'}`}
              span
            />
          </div>
        );
      }
      case 'dois-cartoes': {
        const count1 = parseInt(installments || '1');
        const count2 = parseInt(installments2 || '1');
        const value1 = parseCurrency(amount1 || '0');
        const value2 = parseCurrency(amount2 || '0');

        return (
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 px-3 py-2.5 bg-(--baby-pink)/50 border border-(--accent-soft)/70 rounded-lg">
              <WalletCards className="w-4 h-4 flex-shrink-0" stroke="var(--accent)" />
              <span className="text-sm font-medium text-gray-900">Dois cartões de crédito</span>
            </div>

            <div className="border border-gray-100 rounded-lg p-5 bg-gray-50/30">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-white text-xs">1</span>
                Primeiro Cartão
              </h3>
              <div className="grid md:grid-cols-2 gap-5">
                <InfoField icon={User} label="Titular" value={cardHolder} span />
                <InfoField
                  icon={Hash}
                  label="Cartão"
                  value={cardNumber ? `•••• ${cardNumber.slice(-4)}` : ''}
                />
                <InfoField icon={Receipt} label="Valor pago" value={amount1} />
                <InfoField
                  icon={Calendar}
                  label="Parcelamento"
                  value={`${count1}x de ${brlCurrency.format(value1 / count1)}${count1 > 1 ? ' sem juros' : ' à vista'}`}
                  span
                />
              </div>
            </div>

            <div className="border border-gray-100 rounded-lg p-5 bg-gray-50/30">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-white text-xs">2</span>
                Segundo Cartão
              </h3>
              <div className="grid md:grid-cols-2 gap-5">
                <InfoField icon={User} label="Titular" value={cardHolder2} span />
                <InfoField
                  icon={Hash}
                  label="Cartão"
                  value={cardNumber2 ? `•••• ${cardNumber2.slice(-4)}` : ''}
                />
                <InfoField icon={Receipt} label="Valor pago" value={amount2} />
                <InfoField
                  icon={Calendar}
                  label="Parcelamento"
                  value={`${count2}x de ${brlCurrency.format(value2 / count2)}${count2 > 1 ? ' sem juros' : ' à vista'}`}
                  span
                />
              </div>
            </div>
          </div>
        );
      }
      case 'boleto':
        return (
          <div className="grid md:grid-cols-2 gap-5">
            <InfoField icon={Barcode} label="Forma de pagamento" value="Boleto bancário" span />
            <InfoField icon={Calendar} label="Vencimento" value="3 dias úteis" />
            <InfoField icon={Mail} label="Envio" value="Por e-mail" />
            <div className="md:col-span-2 bg-(--baby-pink) border border-(--accent-soft) rounded-lg p-4 flex items-start gap-2.5">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" stroke="var(--accent)" />
              <p className="text-sm text-gray-700">
                Após o pagamento, a aprovação pode levar até 2 dias úteis.
              </p>
            </div>
          </div>
        );
      case 'pix':
        return (
          <div className="grid md:grid-cols-2 gap-5">
            <InfoField icon={Smartphone} label="Forma de pagamento" value="Pix" span />
            <InfoField icon={Calendar} label="Validade do QR Code" value="30 minutos" />
            <InfoField icon={Mail} label="Envio do QR Code" value="Por e-mail" />
            <div className="md:col-span-2 bg-(--baby-pink) border border-(--accent-soft) rounded-lg p-4 flex items-start gap-2.5">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" stroke="var(--accent)" />
              <p className="text-sm text-gray-700">
                Aprovação imediata após o pagamento. Use o app do seu banco para escanear o QR Code.
              </p>
            </div>
          </div>
        );
      default:
        return <p className="text-gray-500">Não informado</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="absolute inset-0 bg-(--baby-pink) rounded-full blur-2xl opacity-80" />
              <CheckCircle2 className="relative w-20 h-20 text-green-500" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-semibold mb-2">Pedido confirmado!</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              {firstName ? `Obrigada pela sua compra, ${firstName}.` : 'Obrigada pela sua compra.'}{' '}
              Enviamos um e-mail de confirmação para: {' '}
              <span className="font-medium text-gray-800">{order.billing.email}</span>.
            </p>
          </div>

          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 ${status.pillClass}`}>
            <span className={`w-2 h-2 rounded-full ${status.dotColor} ${order.status === 'pending' ? 'animate-pulse' : ''}`} />
            <span className="text-sm font-medium">{status.label}</span>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-(--baby-pink) flex items-center justify-center flex-shrink-0">
                <Hash className="w-5 h-5" stroke="var(--accent)" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Pedido</p>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                  title="Copiar número do pedido"
                >
                  <span className="text-sm font-semibold text-gray-900 truncate">#{order.id}</span>
                  <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-(--accent) transition-colors" />
                </button>
                {copied && <p className="text-xs text-green-600 mt-0.5">Copiado!</p>}
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-(--baby-pink) flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5" stroke="var(--accent)" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Data</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(order.createdAt).toLocaleString('pt-BR', {
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            </Card>

            <Card className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-(--baby-pink) flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5" stroke="var(--accent)" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Entrega prevista</p>
                <p className="text-sm font-semibold text-gray-900">Até {getEstimatedDelivery()}</p>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="flex items-center gap-2 text-xl mb-6 font-semibold">
                <Package className="w-5 h-5" stroke="var(--accent)" />
                Itens do pedido ({order.cart?.products?.length ?? 0})
              </h2>
              <div className="space-y-4">
                {order.cart?.products?.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.quantity} × {brlCurrency.format(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {brlCurrency.format(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="flex items-center gap-2 text-xl mb-6 font-semibold">
                <User className="w-5 h-5" stroke="var(--accent)" />
                Dados pessoais
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                <InfoField icon={User} label="Nome completo" value={order.billing.fullName} span />
                <InfoField icon={Mail} label="E-mail" value={order.billing.email} />
                <InfoField icon={Fingerprint} label="CPF" value={order.billing.cpf} />
                <InfoField icon={Phone} label="Telefone" value={order.billing.phone} span />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="flex items-center gap-2 text-xl mb-6 font-semibold">
                <MapPin className="w-5 h-5" stroke="var(--accent)" />
                Endereço de entrega
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                <InfoField icon={MapPin} label="CEP" value={order.billing.zipCode} />
                <InfoField icon={Building2} label="Cidade" value={order.billing.city} />
                <InfoField icon={Milestone} label="Endereço" value={order.billing.address} span />
                <InfoField icon={Home} label="Número" value={order.billing.number} />
                <InfoField icon={Info} label="Complemento" value={order.billing.complement} />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="flex items-center gap-2 text-xl mb-6 font-semibold">
                <CreditCard className="w-5 h-5" stroke="var(--accent)" />
                Método de Pagamento
              </h2>
              {renderPaymentDetails()}
            </Card>

            <Card className="p-6">
              <h2 className="flex items-center gap-2 text-xl mb-6 font-semibold">
                <Receipt className="w-5 h-5" stroke="var(--accent)" />
                Resumo financeiro
              </h2>
              <div className="space-y-2.5">
                {order.cart.subtotal !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">{brlCurrency.format(order.cart.subtotal)}</span>
                  </div>
                )}

                {order.cart.coupon && order.cart.coupon.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      Desconto ({order.cart.coupon.code})
                    </span>
                    <span className="font-medium">- {brlCurrency.format(order.cart.coupon.discount)}</span>
                  </div>
                )}

                {order.cart.shipping !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frete</span>
                    <span className="font-medium text-gray-900">
                      {order.cart.shipping === 0 ? 'Grátis' : brlCurrency.format(order.cart.shipping)}
                    </span>
                  </div>
                )}

                {order.cart.taxes !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Impostos</span>
                    <span className="font-medium text-gray-900">{brlCurrency.format(order.cart.taxes)}</span>
                  </div>
                )}

                <div className="border-t pt-3 mt-3 flex justify-between items-baseline">
                  <span className="text-base font-semibold text-gray-900">Total Pago</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-(--accent)">
                      {brlCurrency.format(order.cart.total)}
                    </span>
                    {order.billing.paymentMethod === 'cartao' && order.billing.installments && parseInt(order.billing.installments) > 1 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        em {order.billing.installments}x de {brlCurrency.format(order.cart.total / parseInt(order.billing.installments))} sem juros
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-(--baby-pink)/40 border-(--accent-soft)">
              <h2 className="flex items-center gap-2 text-xl mb-4 font-semibold">
                <Info className="w-5 h-5" stroke="var(--accent)" />
                Próximos passos
              </h2>
              <ul className="space-y-2.5 text-sm text-gray-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 mt-1.5 bg-accent rounded-full flex-shrink-0" />
                  Você receberá atualizações do status do pedido por e-mail.
                </li>
                {order.billing.paymentMethod === 'boleto' && (
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 mt-1.5 bg-accent rounded-full flex-shrink-0" />
                    O envio será iniciado após a confirmação do pagamento do boleto.
                  </li>
                )}
                {order.billing.paymentMethod === 'pix' && (
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 mt-1.5 bg-accent rounded-full flex-shrink-0" />
                    Realize o pagamento via Pix para iniciarmos a separação do pedido.
                  </li>
                )}
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 mt-1.5 bg-accent rounded-full flex-shrink-0" />
                  Em caso de dúvidas, mantenha o número do pedido em mãos para agilizar o atendimento.
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" stroke="var(--accent)" />
                  Seus dados estão protegidos. Não compartilhamos suas informações com terceiros.
                </li>
              </ul>
            </Card>

            <div className="flex flex-col-reverse md:flex-row gap-3">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="flex-1 border-accent text-accent hover:bg-accent hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar à loja
              </Button>
              <Button
                onClick={() => window.print()}
                className="flex-1 bg-accent hover:bg-accent/90 text-white"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir comprovante
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
