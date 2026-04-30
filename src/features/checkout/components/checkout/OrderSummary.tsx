import { useState } from 'react';
import { Minus, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useCart } from '../../hooks/useCart';
import { brlCurrency } from '../../utils/formatters';

interface OrderSummaryProps {
  isProcessing: boolean;
}

export function OrderSummary({
  isProcessing
}: OrderSummaryProps) {
  const { cart, updateQuantity, removeItem, applyCoupon, removeCoupon, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('Digite um cupom válido');
      return;
    }

    const success = applyCoupon(couponCode);
    if (success) {
      setCouponCode('');
      setCouponError('');
    } else {
      setCouponError('Cupom inválido');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Resumo do Pedido</h2>

          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-gray-400 hover:text-red-500 text-xs font-normal h-8"
          >
            Resetar Carrinho
          </Button>
      </div>

      <section>
        <h3 className="text-sm font-medium text-gray-700 mb-3 mt-1">Itens ({cart?.products.length})</h3>
        <ul className="space-y-4">
          {cart?.products.map((item: any) => (
            <li key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
              <img
                src={item.image}
                alt={item.imageAlt}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{item.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 h-8 w-8 p-0 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </Button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {brlCurrency.format(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Separator className="mb-3 mt-5" />

      <section>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Cupom de Desconto</h3>

        {cart?.coupon ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
            <div>
              <p className="text-sm font-medium text-green-800">{cart?.coupon.code}</p>
              <p className="text-xs text-green-600 mt-0.5">
                Desconto de {brlCurrency.format(cart?.coupon.discount)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeCoupon}
              className="text-red-500 hover:text-red-700 h-8"
            >
              Remover
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Código do cupom"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  setCouponError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
              />
              <Button type="button" onClick={handleApplyCoupon}>
                Aplicar
              </Button>
            </div>
            {couponError && (
              <p className="text-sm text-red-500">{couponError}</p>
            )}
            <p className="text-xs text-gray-500">
              Cupons: DESCONTO10, BEMVINDO, FRETEGRATIS
            </p>
          </div>
        )}
      </section>

      <Separator className="my-3" />

      <section className="space-y-1">
        {cart?.subtotal &&
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">{brlCurrency.format(cart?.subtotal)}</span>
          </div>
        }

        {cart?.coupon && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Desconto ({cart?.coupon?.code})</span>
            <span className="font-medium">- {brlCurrency.format(cart?.coupon?.discount)}</span>
          </div>
        )}

        {cart?.shipping &&
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Frete</span>
            <span className="font-medium text-gray-900">{brlCurrency.format(cart?.shipping)}</span>
          </div>
        }

        {cart?.taxes &&
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Impostos (5%)</span>
            <span className="font-medium text-gray-900">{brlCurrency.format(cart?.taxes)}</span>
          </div>
        }
      </section>

      <Separator className="my-3" />

      {cart?.total &&      
        <div className="flex justify-between items-center mb-6">
          <span className="text-base font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-gray-900">{brlCurrency.format(cart?.total)}</span>
        </div>
      }

      <div className="space-y-3">
        <Button
          type="submit"
          form="checkout-form"
          className="w-full h-14 text-base font-semibold"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processando pagamento...
            </span>
          ) : (
            'Finalizar Compra'
          )}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5" stroke="#008236" />
          Ao finalizar, você concorda com nossos termos de uso
        </p>
      </div>
    </Card>
  );
}
