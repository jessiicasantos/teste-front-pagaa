import { useState } from 'react';
import { Minus, Plus, Trash2, RotateCcw, Tag, Lock, ShoppingCart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useCart } from '../../hooks/useCart';
import { brlCurrency } from '../../utils/formatters';
import './CheckoutCart.css';

interface CheckoutCartProps {
  isLocked?: boolean;
}

export function CheckoutCart({ isLocked = false }: CheckoutCartProps) {
  const { cart, clearCart, updateQuantity, removeItem, applyCoupon, removeCoupon } = useCart();
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

  const isEmpty = !cart || cart.products.length === 0;

  return (
    <>
      <Card className="cart-wrapper hover-lift border-lift">
        <div className="cart-header">
          <div className="cart-header-title">
            <ShoppingCart size="20" className="cart-icon" />
            <h2 className="cart-title">Carrinho</h2>
          </div>
          {!isEmpty && !isLocked && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearCart()}
              className="cart-reset-button text-gray-500 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-xs">Resetar</span>
            </Button>
          )}
          {!isEmpty && isLocked && (
            <span className="cart-locked-status">
              <Lock className="w-3.5 h-3.5" />
              Carrinho travado
            </span>
          )}
        </div>

        <section>
          {isEmpty ? (
            <div className="cart-empty-container">
              <div className="cart-empty-icon-wrapper">
                <svg
                  className="cart-empty-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="cart-empty-title">Carrinho vazio</h3>
              <p className="cart-empty-description">
                Adicione itens para continuar.
              </p>
              <Button
                onClick={() => clearCart()}
                variant="outline"
                className="cart-empty-button border-accent text-accent hover:bg-accent hover:text-white"
              >
                Restaurar Itens de Teste
              </Button>
            </div>
          ) : (
            <>
              <h3 className="cart-items-count">Itens ({cart?.products.length})</h3>
              <ul className="cart-items-list">
                {cart?.products.map((item: any) => (
                  <li key={item.id} className="cart-item">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="cart-item-image"
                    />

                    <div className="cart-item-info">
                      <div className="cart-item-header">
                        <div className="cart-item-details">
                          <h4 className="cart-item-title">{item.title}</h4>
                          <p className="cart-item-description">{item.description}</p>
                        </div>
                        {!isLocked && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="cart-item-remove text-gray-400 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="cart-item-footer">
                        {isLocked ? (
                          <span className="cart-item-locked-qty">
                            Qtd: <span className="cart-item-qty-value">{item.quantity}</span>
                          </span>
                        ) : (
                          <div className="cart-item-quantity">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="cart-item-qty-btn hover:bg-gray-50 hover:border-(--primary)"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </Button>
                            <span className="cart-item-qty-text">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="cart-item-qty-btn hover:bg-gray-50 hover:border-(--primary)"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                        <p className="cart-item-price">
                          {brlCurrency.format(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        {!isEmpty && (
          <>
            {(cart?.coupon || !isLocked) && (
              <>
                <Separator className="my-4 md:my-5" />

                <section>
                  <h3 className="cart-coupon-title">Cupom de Desconto</h3>

                  {cart?.coupon ? (
                    <div className="cart-coupon-applied">
                      <div>
                        <p className="cart-coupon-code">{cart?.coupon.code}</p>
                        <p className="cart-coupon-discount">
                          Desconto de {brlCurrency.format(cart?.coupon.discount)}
                        </p>
                      </div>
                      {!isLocked && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeCoupon}
                          className="cart-coupon-remove text-(--primary) hover:bg-(--primary) hover:text-white"
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="cart-coupon-form">
                      <div className="cart-coupon-input-group">
                        <Input
                          placeholder="Código do cupom"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponError('');
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          className="cart-coupon-input pl-9"
                        />
                        <Tag className="cart-coupon-input-icon" />
                        <Button
                          type="button"
                          onClick={handleApplyCoupon}
                          variant="outline"
                          className="cart-coupon-apply border-accent text-accent hover:bg-accent hover:text-white"
                        >
                          Aplicar
                        </Button>
                      </div>

                      {couponError && (
                        <p className="cart-coupon-error">{couponError}</p>
                      )}
                      <p className="cart-coupon-hint">
                        Ex: DESCONTO10, BEMVINDO, FRETEGRATIS
                      </p>
                    </div>
                  )}
                </section>
              </>
            )}

            <Separator className="my-4 md:my-5" />

            <div>
              <div className="cart-total-container">
                <span className="cart-total-label">Total</span>
                <span className="cart-total-value">{brlCurrency.format(cart?.total ?? 0)}</span>
              </div>
            </div>
          </>
        )}
      </Card>
    </>
  );
}
