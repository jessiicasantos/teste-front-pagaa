import { Header } from './Header';

import { Footer } from './Footer';
import { CheckoutForm } from './checkout/CheckoutForm';
import { OrderSummary } from './checkout/OrderSummary';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../hooks/useCart';
import type { Cart, Coupon, Billing } from '../types';

export function CheckoutPage() {
  const { data: cart } = useCart();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<Cart[] | []>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingFee = 15.90;
  const taxRate = 0.05;

  const subtotal = 0;
  const discount = coupon ? coupon.discount : 0;
  const subtotalAfterDiscount = subtotal - discount;
  const taxes = subtotalAfterDiscount * taxRate;
  const total = subtotalAfterDiscount + shippingFee + taxes;

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(cart =>
      cart?.map(c => (c.products[0].id === id ? { ...c, quantity } : c))
    );
  };

  const removeItem = (id: string) => {
    setCartItems(cart => cart?.filter(item => item.products[0].id !== id));
  };

  const applyCoupon = (code: string) => {
    const validCoupons: { [key: string]: number } = {
      'DESCONTO10': subtotal * 0.1,
      'BEMVINDO': 20,
      'FRETEGRATIS': shippingFee
    };

    if (validCoupons[code.toUpperCase()]) {
      setCoupon({ code: code.toUpperCase(), discount: validCoupons[code.toUpperCase()] });
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const handleCheckout = async (billing: Partial<Billing>) => {
    setIsProcessing(true);

    const orderData = {
      id: Math.random().toString(36).substr(2, 9),
      billing: billing,
      status: 'pending' as const,
      cart: cart,
      coupons: coupon ? [coupon] : [],
      subtotal,
      discount,
      shipping: shippingFee,
      taxes,
      total: cart?.total,
      createdAt: new Date().toISOString()
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    navigate('/confirmation', { state: { order: orderData } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#a7924e]">Finalizar Compra</h1>
            <p className="text-sm text-gray-600 mt-1">Preencha seus dados para concluir o pedido</p>
          </div>
          <div className="grid lg:grid-cols-12 gap-6 xl:gap-8">
            <div className="lg:col-span-7">
              <CheckoutForm handleSubmit={handleCheckout} />
            </div>
            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-8">
                <OrderSummary
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  applyCoupon={applyCoupon}
                  removeCoupon={removeCoupon}
                  isProcessing={isProcessing}
                />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
