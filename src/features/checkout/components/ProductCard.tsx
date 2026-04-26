import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "../types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="flex gap-4 py-6 border-b border-slate-100 last:border-0">
      <div className="relative w-24 h-32 bg-slate-50 rounded-md overflow-hidden flex-shrink-0 border border-slate-100">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover mix-blend-multiply" 
        />
      </div>

      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-sm sm:text-base text-slate-800 truncate sm:line-clamp-2 sm:whitespace-normal">
              {product.title}
            </h3>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-between items-end mt-4">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
            <button className="px-2 py-1 text-slate-500 hover:bg-slate-200 transition-colors">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-9 text-center text-xs font-bold text-slate-700">
              {product.amount}
            </span>
            <button className="px-2 py-1 text-slate-500 hover:bg-slate-200 transition-colors">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-400 font-medium">Preço unitário</p>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">
              R$ {product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}