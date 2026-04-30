import { Header } from './Header';
import { Footer } from './Footer';
import { CheckoutForm, CHECKOUT_FORM_KEY } from './checkout/CheckoutForm';
import { OrderSummary } from './checkout/OrderSummary';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../hooks/useCart';
import { Button } from '@/components/ui/button';
import { checkoutSchema, type CheckoutFormData } from '../schemas/checkoutSchema';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

export function CheckoutPage() {
  const { cart, clearCart, isPending } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [installments, setInstallments] = useState('');

  const [formDraft] = useLocalStorage<Partial<CheckoutFormData>>(
    CHECKOUT_FORM_KEY, 
    {}
  );

  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      email: '',
      cpf: '',
      phone: '',
      zipCode: '',
      city: '',
      address: '',
      number: '',
      complement: '',
      cardHolder: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      installments: '',
      ...formDraft
    }
  });

  const handleCheckout = async (billing: CheckoutFormData) => {
    if (!cart || cart.products.length === 0) return;
    
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

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#a7924e] border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  const isEmpty = !cart || cart.products.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {isEmpty ? (
            <div className="max-w-md mx-auto text-center py-16 px-4">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-gray-400"
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
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Seu carrinho está vazio</h1>
                <p className="text-gray-500 mb-8">
                  Parece que você ainda não adicionou nenhum item ao seu carrinho.
                </p>
                <Button 
                  onClick={() => clearCart()}
                  className="w-full bg-[#a7924e] hover:bg-[#8e7b41] text-white h-12 font-medium"
                >
                  Restaurar Itens de Teste
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-[#a7924e]">Finalizar Compra</h1>
                <p className="text-sm text-gray-600 mt-1">Preencha seus dados para concluir o pedido</p>
              </div>
              <FormProvider {...methods}>
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
              </FormProvider>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
