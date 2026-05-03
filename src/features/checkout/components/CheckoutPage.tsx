import { Header } from './checkout/Header/Header';
import { Footer } from './checkout/Footer/Footer';
import { CheckoutForm, CHECKOUT_FORM_KEY } from './checkout/CheckoutForm';
import { OrderSummary } from './checkout/OrderSummary';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../hooks/useCart';
import { getCheckoutSchema, type CheckoutFormData } from '../schemas/checkoutSchema';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { Jumbotron } from './checkout/Jumbotron/Jumbotron';
import { Breadcrumb } from './checkout/Breadcrumb/Breadcrumb';
import { toast } from 'sonner';

export function CheckoutPage() {
  const { cart, applyCoupon, isPending } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("personal");

  const handleStepClick = (stepId: string) => {
    setCurrentStep(stepId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePromoSelect = (code: string) => {
    applyCoupon(code);
  };

  const [formDraft] = useLocalStorage<Partial<CheckoutFormData>>(
    CHECKOUT_FORM_KEY, 
    {}
  );

  const total = cart?.total ?? 0;
  const schema = useMemo(() => getCheckoutSchema(total), [total]);

  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
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

  const formValues = methods.watch([
    'fullName', 'email', 'cpf', 'phone',
    'zipCode', 'city', 'address', 'number',
    'paymentMethod',
    'cardHolder', 'cardNumber', 'cardExpiry', 'cardCvv', 'installments',
    'cardHolder2', 'cardNumber2', 'cardExpiry2', 'cardCvv2', 'installments2',
    'amount1', 'amount2',
  ]);
  const [
    fullName, email, cpf, phone,
    zipCode, city, address, number,
    paymentMethod,
    cardHolder, cardNumber, cardExpiry, cardCvv, installments,
    cardHolder2, cardNumber2, cardExpiry2, cardCvv2, installments2,
    amount1, amount2,
  ] = formValues;
  const { errors } = methods.formState;

  const completedSteps = useMemo(() => {
    const completed = [];
    const personalFilled = fullName && email && cpf && phone;
    const personalHasErrors = !!(errors.fullName || errors.email || errors.cpf || errors.phone);
    if (personalFilled && !personalHasErrors) {
      completed.push('personal');
    }
    const addressFilled = zipCode && city && address && number;
    const addressHasErrors = !!(errors.zipCode || errors.city || errors.address || errors.number);
    if (addressFilled && !addressHasErrors) {
      completed.push('address');
    }

    let paymentFilled = false;
    if (paymentMethod === 'pix' || paymentMethod === 'boleto') {
      paymentFilled = true;
    } else if (paymentMethod === 'cartao') {
      paymentFilled = !!(cardHolder && cardNumber && cardExpiry && cardCvv && installments);
    } else if (paymentMethod === 'dois-cartoes') {
      paymentFilled = !!(
        cardHolder && cardNumber && cardExpiry && cardCvv && installments &&
        cardHolder2 && cardNumber2 && cardExpiry2 && cardCvv2 && installments2 &&
        amount1 && amount2
      );
    }
    const paymentHasErrors = !!(
      errors.cardHolder || errors.cardNumber || errors.cardExpiry || errors.cardCvv || errors.installments ||
      errors.cardHolder2 || errors.cardNumber2 || errors.cardExpiry2 || errors.cardCvv2 || errors.installments2 ||
      errors.amount1 || errors.amount2 || errors.paymentMethod
    );
    if (paymentFilled && !paymentHasErrors) {
      completed.push('payment');
    }
    return completed;
  }, [
    fullName, email, cpf, phone, zipCode, city, address, number,
    paymentMethod,
    cardHolder, cardNumber, cardExpiry, cardCvv, installments,
    cardHolder2, cardNumber2, cardExpiry2, cardCvv2, installments2,
    amount1, amount2,
    errors.fullName, errors.email, errors.cpf, errors.phone,
    errors.zipCode, errors.city, errors.address, errors.number,
    errors.cardHolder, errors.cardNumber, errors.cardExpiry, errors.cardCvv, errors.installments,
    errors.cardHolder2, errors.cardNumber2, errors.cardExpiry2, errors.cardCvv2, errors.installments2,
    errors.amount1, errors.amount2, errors.paymentMethod,
  ]);

  const handleCheckout = async (billing: CheckoutFormData) => {
    if (!cart || cart.products.length === 0) return;
    
    setIsProcessing(true);

    try {
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

      toast.success('Pedido finalizado com sucesso!', {
        description: 'Aguarde a confirmação do pedido!'
      });

      navigate('/confirmation', { state: { order: orderData } });
    } catch (error) {
      toast.error('Erro ao processar o pedido', {
        description: 'Ocorreu um problema ao finalizar sua compra. Tente novamente.'
      });
    } finally {
      setIsProcessing(false);
    }
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
      <Jumbotron onSelectPromo={handlePromoSelect} />
      <main className="flex-1 py-5 md:py-8">
        <div className="app-container">
          <div className="mb-5 md:mb-7">
            <h1 className="text-xl md:text-2xl font-semibold">Finalizar Compra</h1>
            <p className="text-sm text-gray-600 mt-1">Preencha seus dados para concluir o pedido</p>
          </div>

          <Breadcrumb
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />

          <FormProvider {...methods}>
            <div className="grid lg:grid-cols-12 gap-5 md:gap-6 xl:gap-8">
              <div className="lg:col-span-7">
                <CheckoutForm
                  handleSubmit={handleCheckout}
                  currentStep={currentStep}
                  onStepChange={handleStepClick}
                  isProcessing={isProcessing}
                />
              </div>
              <aside className="lg:col-span-5">
                <div className="lg:sticky lg:top-8">
                  <OrderSummary isLocked={currentStep === 'resume'} />
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
