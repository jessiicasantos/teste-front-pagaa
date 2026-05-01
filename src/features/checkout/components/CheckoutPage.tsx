import { Header } from './Header';
import { Footer } from './Footer';
import { CheckoutForm, CHECKOUT_FORM_KEY } from './checkout/CheckoutForm';
import { OrderSummary } from './checkout/OrderSummary';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../hooks/useCart';
import { getCheckoutSchema, type CheckoutFormData } from '../schemas/checkoutSchema';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

export function CheckoutPage() {
  const { cart, isPending } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [installments, setInstallments] = useState('');
  const [installments2, setInstallments2] = useState('');

  const [formDraft] = useLocalStorage<Partial<CheckoutFormData>>(
    CHECKOUT_FORM_KEY, 
    {}
  );

  const total = cart?.total ?? 0;
  const schema = useMemo(() => getCheckoutSchema(total), [total]);

  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(schema),
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
      paymentMethod: 'cartao',
      cardHolder: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      installments: '',
      cardHolder2: '',
      cardNumber2: '',
      cardExpiry2: '',
      cardCvv2: '',
      amount1: '',
      amount2: '',
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">Finalizar Compra</h1>
            <p className="text-sm text-gray-600 mt-1">Preencha seus dados para concluir o pedido</p>
          </div>
          <FormProvider {...methods}>
            <div className="grid lg:grid-cols-12 gap-6 xl:gap-8">
              <div className="lg:col-span-7">
                <CheckoutForm 
                  handleSubmit={handleCheckout} 
                  onInstallmentsChange={(inst1, inst2) => {
                    setInstallments(inst1);
                    setInstallments2(inst2 || '');
                  }}
                />
              </div>
              <aside className="lg:col-span-5">
                <div className="lg:sticky lg:top-8">
                  <OrderSummary
                    isProcessing={isProcessing}
                    selectedInstallments={installments}
                    selectedInstallments2={installments2}
                  />
                </div>
              </aside>
            </div>
          </FormProvider>
        </div>
      </main>
      <Footer />
    </div>
  );
}
