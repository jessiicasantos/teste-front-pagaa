import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from './Header';

import { Footer } from './Footer';
import { CheckoutForm } from './checkout/CheckoutForm';
import { OrderSummary } from './checkout/OrderSummary';

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CouponData {
  code: string;
  discount: number;
}

export interface FormData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  zipCode: string;
  cardHolder: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

const initialCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Vestido Floral Primavera',
    description: 'Vestido longo com estampa floral',
    price: 129.90,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop'
  },
  {
    id: '2',
    name: 'Blusa Básica Premium',
    description: 'Blusa de algodão 100% premium',
    price: 79.90,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400&h=500&fit=crop'
  },
  {
    id: '3',
    name: 'Calça Jeans Skinny',
    description: 'Calça jeans com elastano',
    price: 159.90,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop'
  }
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [coupon, setCoupon] = useState<CouponData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingFee = 15.90;
  const taxRate = 0.05;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = coupon ? coupon.discount : 0;
  const subtotalAfterDiscount = subtotal - discount;
  const taxes = subtotalAfterDiscount * taxRate;
  const total = subtotalAfterDiscount + shippingFee + taxes;

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
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

  const handleCheckout = async (formData: Partial<FormData>) => {
    setIsProcessing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const orderData = {
      id: Math.random().toString(36).substr(2, 9),
      status: 'completed' as const,
      items: cartItems,
      billing: formData,
      coupons: coupon ? [coupon] : [],
      subtotal,
      discount,
      shipping: shippingFee,
      taxes,
      total,
      createdAt: new Date().toISOString()
    };

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
              <CheckoutForm onSubmit={handleCheckout} />
            </div>

            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-8">
                <OrderSummary
                  items={cartItems}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  subtotal={subtotal}
                  discount={discount}
                  shipping={shippingFee}
                  taxes={taxes}
                  total={total}
                  coupon={coupon}
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
