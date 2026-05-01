import { useQuery, useQueryClient } from '@tanstack/react-query';
import { checkoutService } from '../services/checkoutService';
import type { Cart } from '../types';
import { useEffect } from 'react';

const CART_STORAGE_KEY = 'local-cart-items';

export function useCart() {
  const queryClient = useQueryClient();
  const { data: cart, error, isFetching, isPending, isError, isSuccess } = useQuery({
    queryKey: ['cart'],
    queryFn: checkoutService.getCart,
    initialData: () => {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);

        return saved ? JSON.parse(saved) : undefined;
      } catch(error) {
        console.error('Erro ao carregar carrinho do localStorage', error);
        return undefined;
      }
    },
    staleTime: Infinity, // cache infinity
    refetchOnWindowFocus: false, // do not refetch when the window is focused
    retry: 2, // retry failed requests up to 2 times
  });

  useEffect(() => {
    if(cart) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch(error) {
        console.error('Erro ao salvar carrinho no localStorage', error);
      }
    }
  }, [cart]);

  const setCart = ( cart: Cart ) => {
    const hasItems = cart.products.length > 0;
    const shippingFee = hasItems ? 15.90 : 0;
    const taxRate = 0.05;
    const discount = cart.coupon ? cart.coupon.discount : 0;

    cart.subtotal = cart.products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cart.shipping = shippingFee;
    cart.taxes = Math.max(0, (cart.subtotal - discount) * taxRate);
    cart.total = Math.max(0, cart.subtotal - discount + shippingFee + cart.taxes);

    queryClient.setQueryData(['cart'], cart);
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    if (!cart) return;

    setCart({
      ...cart,
      products: cart.products.map((p: any) => p.id === id ? {...p, quantity} : p)
    })
  };

  const removeItem = (id: string) => {
    if (!cart) return;
    setCart({...cart, products: cart.products.filter((p: any) => p.id !== id)})
  };

  const applyCoupon = (code: string) => {
    if (!cart) return false;
    
    const subtotal = cart.subtotal ?? 0;
    const validCoupons: { [key: string]: number } = {
      'DESCONTO10': subtotal * 0.1,
      'BEMVINDO': 20,
      'FRETEGRATIS': 15.90
    };

    const discount = validCoupons[code.toUpperCase()];
      if (discount) {
        setCart({
          ...cart,
          coupon: { code: code.toUpperCase(), discount }
        });
        return true;
      }
      return false;
  };

  const removeCoupon = () => {
    if (!cart) return;
    setCart({
      ...cart,
      coupon: undefined
    });
  };

  const clearCart = async () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    
    await queryClient.resetQueries({
      queryKey: ['cart']
    })
  };

  return {
    cart,
    setCart,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    clearCart,
    error,
    isFetching,
    isPending,
    isError,
    isSuccess,
  };
}