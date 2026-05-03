import { Tag } from 'lucide-react';

interface PromoBannerProps {
  onSelectPromo: (code: string) => void;
}

const promo = {
  code: 'DESCONTO10',
  description: 'Ganhe 10% de desconto em toda a sua compra',
};

export function PromoBanner({ onSelectPromo }: PromoBannerProps) {
  return (
    <div
      className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 px-2 py-2 cursor-pointer transition-all hover:brightness-110 animate-promo-slide origin-top"
      onClick={() => onSelectPromo(promo.code)}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap flex-row items-center justify-center gap-3">
        <div className="flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-full p-1.5">
          <Tag className="w-4 h-4 text-white" />
        </div>
        <p className="text-white/90 text-sm">{promo.description}</p>
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-0.5 rounded-full text-sm">
          <span className="text-white font-mono font-semibold tracking-wider">
            {promo.code}
          </span>
          <span className="text-white/80 text-sm">• Clique para aplicar</span>
        </div>
      </div>
    </div>
  );
}
