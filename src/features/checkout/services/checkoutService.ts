import { internalApi } from '@/api/axios';
import type { Cart, Order } from '../types';

export const checkoutService = {
  getCart: async (): Promise<Cart> => {
    const { data } = await internalApi.get<Cart>('/cart');
    return data;
  },

  createOrder: async (order: Order): Promise<Order> => {
    const { data } = await internalApi.post<Order>('/orders', order);
    return data;
  }
};