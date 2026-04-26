import { useCart } from "@/features/checkout/hooks/useCart";
import { ProductCard } from "@/features/checkout/components/ProductCard";

function App() {
  const { data: cart } = useCart()

  return (
    <div className="app-container min-h-screen bg-slate-50">
      <main className="mx-auto px-4 py-8">
        {cart?.products.length === 0 ? (
           <p className="text-center py-10 text-slate-500">Seu carrinho está vazio.</p>
        ) : (
          cart?.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </main>
    </div>
  )
}

export default App;