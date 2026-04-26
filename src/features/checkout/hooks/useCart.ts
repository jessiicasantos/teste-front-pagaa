import { useQuery } from '@tanstack/react-query';
import { checkoutService } from '../services/checkoutService';

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: checkoutService.getCart,
    staleTime: 1000 * 60 * 5, // 5 minutes of cache
    refetchOnWindowFocus: false, // do not refetch when the window is focused
    retry: 2, // retry failed requests up to 2 times
  });
}