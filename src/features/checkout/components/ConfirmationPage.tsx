import { useLocation, useNavigate } from 'react-router';
import { CheckCircle2, Package, MapPin, CreditCard, Barcode, Smartphone, WalletCards } from 'lucide-react';
import { useEffect } from 'react';
import { brlCurrency } from '../utils/formatters';
import { Header } from './Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Footer } from './Footer';
import type { Order } from '../types';

export function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as Order | undefined;
  
  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  const statusConfig = {
    pending: { label: 'Pendente', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
    completed: { label: 'Confirmado', color: 'text-green-600 bg-green-50 border-green-200' },
    cancelled: { label: 'Cancelado', color: 'text-red-600 bg-red-50 border-red-200' }
  };

  const status = statusConfig[order.status];

  const renderPaymentInfo = () => {
    const { paymentMethod, installments, amount1, amount2, cardNumber, cardNumber2 } = order.billing;
    
    switch (paymentMethod) {
      case 'cartao':
        return (
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium">Cartão de Crédito</p>
              <p className="text-sm text-gray-600">
                Final {cardNumber?.slice(-4)} • {installments}x de {brlCurrency.format(order.cart.total / parseInt(installments || '1'))}
              </p>
            </div>
          </div>
        );
      case 'dois-cartoes':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <WalletCards className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">Dois Cartões de Crédito</p>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-gray-600">
                    Cartão 1: Final {cardNumber?.slice(-4)} • {amount1}
                  </p>
                  <p className="text-sm text-gray-600">
                    Cartão 2: Final {cardNumber2?.slice(-4)} • {amount2}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'boleto':
        return (
          <div className="flex items-center gap-3">
            <Barcode className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium">Boleto Bancário</p>
              <p className="text-sm text-gray-600">Aguardando pagamento • Vence em 3 dias</p>
            </div>
          </div>
        );
      case 'pix':
        return (
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium">Pix</p>
              <p className="text-sm text-gray-600">Aprovação imediata • QR Code enviado por e-mail</p>
            </div>
          </div>
        );
      default:
        return <p>Não informado</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl mb-2">Pedido Confirmado!</h1>
          <p className="text-gray-600">
            Pedido #{order.id} realizado em {new Date(order.createdAt).toLocaleString('pt-BR')}
          </p>
        </div>

        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 ${status.color}`}>
          <div className={`w-2 h-2 rounded-full ${order.status === 'completed' ? 'bg-green-600' : order.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'}`} />
          <span>Status: {status.label}</span>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="flex items-center gap-2 text-xl mb-4">
              <Package className="w-5 h-5" />
              Itens do Pedido
            </h2>

            <div className="space-y-4">
              {order.cart?.products?.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-sm mt-1">
                      Quantidade: {item.quantity} × {brlCurrency.format(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>{brlCurrency.format(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="flex items-center gap-2 text-xl mb-4">
                <MapPin className="w-5 h-5" />
                Endereço de Entrega
              </h2>
              <div className="space-y-1 text-sm">
                <p className="font-medium text-base">{order.billing.fullName || 'Não informado'}</p>
                <p>
                  {order.billing.address || 'Rua não informada'}, {order.billing.number || 'S/N'}
                  {order.billing.complement && ` - ${order.billing.complement}`}
                </p>
                <p>{order.billing.city || 'Cidade não informada'} - {order.billing.zipCode || 'CEP não informado'}</p>
                <div className="pt-2 border-t mt-2 text-gray-600">
                  <p>{order.billing.phone || 'Telefone não informado'}</p>
                  <p>{order.billing.email || 'E-mail não informado'}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="flex items-center gap-2 text-xl mb-4">
                <CreditCard className="w-5 h-5" />
                Pagamento
              </h2>
              <div className="h-full flex flex-col justify-center">
                {renderPaymentInfo()}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl mb-4">Resumo Financeiro</h2>

            <div className="space-y-2">
              {order.cart.subtotal &&
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{brlCurrency.format(order.cart.subtotal)}</span>
                </div>
              }

              {order.cart.coupon && order.cart.coupon.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto</span>
                  <span>- {brlCurrency.format(order.cart.coupon.discount)}</span>
                </div>
              )}

              {order.cart.shipping &&
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span>{brlCurrency.format(order.cart.shipping)}</span>
                </div>
              }

              {order.cart.taxes &&
                <div className="flex justify-between">
                  <span className="text-gray-600">Impostos</span>
                  <span>{brlCurrency.format(order.cart.taxes)}</span>
                </div>
              }

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center text-xl">
                  <span>Total Pago</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold">{brlCurrency.format(order.cart.total)}</span>
                    {order.billing.paymentMethod === 'cartao' && order.billing.installments && parseInt(order.billing.installments) > 1 && (
                      <p className="text-sm text-gray-500 font-normal">
                        em {order.billing.installments}x de {brlCurrency.format(order.cart.total / parseInt(order.billing.installments))} sem juros
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="flex-1"
            >
              Voltar ao Início
            </Button>
            <Button
              onClick={() => window.print()}
              className="flex-1"
            >
              Imprimir Pedido
            </Button>
          </div>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
