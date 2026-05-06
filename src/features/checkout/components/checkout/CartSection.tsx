import { Minus, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { brlCurrency } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import { type Product } from '../../types';

export function CartSection() {
  const { cart, removeItem, updateQuantity } = useCart();
  
  return (
    <Card className="p-6">
      <h2 className="text-2xl mb-6">Carrinho de Compras</h2>

      <div className="space-y-4">
        {cart?.products.map((item: Product) => (
          <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
            <img
              src={item.image}
              alt={item.imageAlt}
              className="w-24 h-24 object-cover rounded"
            />

            <div className="flex-1">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-lg mt-2">
                {brlCurrency.format(item.price)}
              </p>
            </div>

            <div className="flex flex-col items-end justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
