import { useQuery, useQueryClient } from '@tanstack/react-query';
import { checkoutService } from '../services/checkoutService';
import type { Cart } from '../types';

export function useCart() {
  const queryClient = useQueryClient();
  const { data: cart, error, isFetching, isPending, isError, isSuccess } = useQuery({
    queryKey: ['cart'],
    queryFn: checkoutService.getCart,
    staleTime: 1000 * 60 * 5, // 5 minutes of cache
    refetchOnWindowFocus: false, // do not refetch when the window is focused
    retry: 2, // retry failed requests up to 2 times
  });

  const setCart = ( cart: Cart ) => {
    const shippingFee = 15.90;
    const taxRate = 0.05;
    const discount = cart.coupon ? cart.coupon.discount : 0;

    cart.subtotal = cart.products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cart.taxes = (cart.subtotal - discount) * taxRate;
    cart.total = cart.subtotal - discount + shippingFee + cart.taxes;

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
      products: cart.products.map(p => p.id === id ? {...p, quantity} : p)
    })
  };

  const removeItem = (id: string) => {
    if (!cart) return;
    setCart({...cart, products: cart.products.filter(p => p.id !== id)})
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

  return {
    cart,
    setCart,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    error,
    isFetching,
    isPending,
    isError,
    isSuccess,
  };
}