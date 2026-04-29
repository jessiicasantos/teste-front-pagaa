import { useQuery, QueryClient, useQueryClient } from '@tanstack/react-query';
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

    cart.subtotal = cart.products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cart.discount = cart.coupon ? cart.coupon.discount : 0;
    cart.taxes = (cart.subtotal - cart.discount) * taxRate;
    cart.total = cart.subtotal - cart.discount + shippingFee + cart.taxes;

    queryClient.setQueryData(['cart'], cart);
  }

  return {
    cart,
    setCart,
    error,
    isFetching,
    isPending,
    isError,
    isSuccess,
  };
}