import { useLocation, useNavigate } from 'react-router';
import { CheckCircle2, Package, MapPin } from 'lucide-react';
import { useEffect } from 'react';
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
                      Quantidade: {item.quantity} × R$ {item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>R$ {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div>
            <Card className="p-6">
              <h2 className="flex items-center gap-2 text-xl mb-4">
                <MapPin className="w-5 h-5" />
                Endereço de Entrega
              </h2>
              <div className="space-y-1 text-sm">
                <p>{order.billing.fullName || 'Não informado'}</p>
                <p>
                  {order.billing.address || 'Rua não informada'}, {order.billing.number || 'S/N'}
                  {order.billing.complement && ` - ${order.billing.complement}`}
                </p>
                <p>{order.billing.city || 'Cidade não informada'} - {order.billing.zipCode || 'CEP não informado'}</p>
                <p className="pt-2 border-t mt-2">{order.billing.phone || 'Telefone não informado'}</p>
                <p>{order.billing.email || 'E-mail não informado'}</p>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl mb-4">Resumo Financeiro</h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>R$ {/* {order.subtotal.toFixed(2)} */}</span>
              </div>

  {/*             {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto</span>
                  <span>- R$ {order.discount.toFixed(2)}</span>
                </div>
              )} */}

        {/*       <div className="flex justify-between">
                <span className="text-gray-600">Frete</span>
                <span>R$ {order.shipping.toFixed(2)}</span>
              </div> */}

            {/*   <div className="flex justify-between">
                <span className="text-gray-600">Impostos</span>
                <span>R$ {order.taxes.toFixed(2)}</span>
              </div> */}

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center text-xl">
                  <span>Total Pago</span>
                  <span className="text-2xl">R$ {/* {order.total.toFixed(2)} */}</span>
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
