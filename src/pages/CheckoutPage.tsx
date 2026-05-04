import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from '@/features/Header/Header';
import { Footer } from '@/features/Footer/Footer';
import { Jumbotron } from '@/features/Jumbotron/Jumbotron';
import { CheckoutForm } from '@/features/Checkout/components/CheckoutForm/CheckoutForm';
import { CheckoutCart } from '@/features/Checkout/components/CheckoutCart/CheckoutCart';
import { CheckoutStepper } from '@/features/Checkout/components/CheckoutStepper/CheckoutStepper';
import { useCart } from '@/features/Checkout/hooks/useCart';
import { getCheckoutSchema, type CheckoutFormData } from '@/features/Checkout/schemas/checkoutSchema';
import { FORM_STORAGE_KEY } from '@/lib/constants';
import type { Order } from '@/features/Checkout/types';
import { checkoutService } from '@/features/Checkout/services/checkoutService';

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

  const total = cart?.total ?? 0;
  const schema = useMemo(() => getCheckoutSchema(total), [total]);
  const getDraft = JSON.parse(localStorage.getItem(FORM_STORAGE_KEY) || '{}') as Partial<CheckoutFormData>;

  const checkoutForm = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      fullName: getDraft.fullName || '',
      email: getDraft.email || '',
      cpf: getDraft.cpf || '',
      phone: getDraft.phone || '',
      zipCode: getDraft.zipCode || '',
      city: getDraft.city || '',
      address: getDraft.address || '',
      number: getDraft.number || '',
      complement: getDraft.complement || '',
      paymentMethod: 'cartao',
      cardHolder: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      installments: getDraft.installments || '1',
      cardHolder2: '',
      cardNumber2: '',
      cardExpiry2: '',
      cardCvv2: '',
      installments2: getDraft.installments2 || '1',
      amount1: getDraft.amount1 || '',
      amount2: getDraft.amount2 || '',
    }
  });

  const formValues = checkoutForm.watch([
    'fullName', 'email', 'cpf', 'phone',
    'zipCode', 'city', 'address', 'number',
    'paymentMethod',
    'cardHolder', 'cardNumber', 'cardExpiry', 'cardCvv', 'installments',
    'cardHolder2', 'cardNumber2', 'cardExpiry2', 'cardCvv2', 'installments2',
    'amount1', 'amount2',
  ]);

  const { errors } = checkoutForm.formState;

  const saveDraft = (data: Partial<CheckoutFormData>) => {
    const SAFE_FIELDS = [
      'fullName', 'email', 'cpf', 'phone',
      'zipCode', 'city', 'address', 'number',
      'complement', 'installments', 'installments2', 'amount1', 'amount2'
    ] as (keyof CheckoutFormData)[];

    for (const key in data) {
      if (!SAFE_FIELDS.includes(key as keyof CheckoutFormData)) {
        delete data[key as keyof CheckoutFormData];
      }
    }

    return localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
  };

  const completedSteps = useMemo(() => {
     const [
      fullName, email, cpf, phone,
      zipCode, city, address, number,
      paymentMethod,
      cardHolder, cardNumber, cardExpiry, cardCvv, installments,
      cardHolder2, cardNumber2, cardExpiry2, cardCvv2, installments2,
      amount1, amount2,
    ] = formValues;

    saveDraft(checkoutForm.getValues());

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
  }, [formValues, errors]);

  const handleCheckout = async (billing: CheckoutFormData) => {
    if (!cart || cart.products.length === 0) return;
    
    setIsProcessing(true);

    try {
      const orderData: Order = {
        id: Math.random().toString(36).substr(2, 9),
        cart: cart,
        billing: billing,
        status: 'pending' as const,
        createdAt: new Date()
      };

      // Order API call
      const createdOrder = await checkoutService.createOrder(orderData);

      toast.success('Pedido finalizado com sucesso!', {
        description: 'Aguarde a confirmação do pedido!'
      });

      navigate('/confirmation', { state: { order: createdOrder } });
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
          <div className="w-8 h-8 border-4 border-(--accent) border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Jumbotron onSelectPromo={handlePromoSelect} />
      <main className="flex-1 py-5 md:pt-8 pb-11">
        <div className="app-container">
          <div className="mb-5 md:mb-7">
            <h1 className="text-xl md:text-2xl font-semibold">Finalizar Compra</h1>
            <p className="text-sm text-gray-600 mt-1">Preencha seus dados para concluir o pedido</p>
          </div>

          <CheckoutStepper
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />

          <FormProvider {...checkoutForm}>
            <div className="grid lg:grid-cols-12 gap-5 md:gap-6 xl:gap-8">
              <div className="lg:col-span-7">
                <CheckoutForm
                  handleCheckout={handleCheckout}
                  currentStep={currentStep}
                  onStepChange={handleStepClick}
                  isProcessing={isProcessing}
                />
              </div>
              <aside className="lg:col-span-5">
                <div className="lg:sticky lg:top-8">
                  <CheckoutCart isLocked={currentStep === 'resume'} />
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
