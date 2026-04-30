import { Header } from './Header';
import { Footer } from './Footer';
import { CheckoutForm, CHECKOUT_FORM_KEY } from './checkout/CheckoutForm';
import { OrderSummary } from './checkout/OrderSummary';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../hooks/useCart';
import type { CheckoutFormData } from '../schemas/checkoutSchema';

export function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [installments, setInstallments] = useState('');

  const handleCheckout = async (billing: CheckoutFormData) => {
    if (!cart) return;
    
    setIsProcessing(true);

    const orderData = {
      id: Math.random().toString(36).substr(2, 9),
      cart: cart,
      billing: billing,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Clear saved form data and cart
    localStorage.removeItem(CHECKOUT_FORM_KEY);
    await clearCart();

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
              <CheckoutForm 
                handleSubmit={handleCheckout} 
                onInstallmentsChange={setInstallments}
              />
            </div>
            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-8">
                <OrderSummary
                  isProcessing={isProcessing}
                  selectedInstallments={installments}
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
