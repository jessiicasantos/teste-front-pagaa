import * as React from 'react';
import { Sparkles, Gift, Tag } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface PromoBannerProps {
  onSelectPromo: (code: string) => void;
}

interface Promo {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: typeof Sparkles;
  gradient: string;
}

const promos: Promo[] = [
  {
    id: '1',
    code: 'DESCONTO10',
    title: '10% de Desconto',
    description: 'Ganhe 10% de desconto em toda a sua compra',
    icon: Tag,
    gradient: 'from-purple-600 via-purple-500 to-pink-500',
  },
  {
    id: '2',
    code: 'BEMVINDO',
    title: 'Boas-vindas',
    description: 'R$ 20 de desconto para novos clientes',
    icon: Sparkles,
    gradient: 'from-blue-600 via-blue-500 to-cyan-500',
  },
  {
    id: '3',
    code: 'FRETEGRATIS',
    title: 'Frete Grátis',
    description: 'Economize no frete para qualquer região',
    icon: Gift,
    gradient: 'from-emerald-600 via-emerald-500 to-teal-500',
  },
];

export function PromoBanner({ onSelectPromo }: PromoBannerProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // const plugin = React.useMemo(
  //   () => Autoplay({ delay: 4000, stopOnInteraction: true }),
  //   []
  // );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    onSelect();
    api.on('select', onSelect);
    
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <div className="w-full relative overflow-hidden">
      <Carousel
        setApi={setApi}
        // plugins={[plugin]}
        className="w-full"
        // onMouseEnter={() => plugin.stop()}
        // onMouseLeave={() => plugin.reset()}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="-ml-0">
          {promos.map((promo) => {
            const Icon = promo.icon;
            return (
                <CarouselItem key={promo.id}  className={cn(
                      "bg-gradient-to-r px-2 py-3 cursor-pointer transition-all hover:brightness-110",
                      promo.gradient
                )}
                onClick={() => onSelectPromo(promo.code)}
              >
                  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-sm font-bold text-white">
                        {promo.title}
                      </h2>
                      <p className="text-white/90 text-sm mb-1">
                        {promo.description}
                      </p>
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm">
                        <span className="text-white font-mono font-semibold tracking-wider">
                          {promo.code}
                        </span>
                        <span className="text-white/80 text-sm">
                          • Clique para aplicar
                        </span>
                      </div>
                    </div>
                  </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      
      {/* Pagination dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {promos.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              current === index ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"
            )}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
