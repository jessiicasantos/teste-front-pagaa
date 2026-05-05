import React from 'react';
import { cn } from '@/lib/utils';
import { getCardBrand, type CardBrand } from '../../utils/cardUtils';

interface VisualCreditCardProps {
  number?: string;
  name?: string;
  expiry?: string;
  cvv?: string;
  isFlipped?: boolean;
  className?: string;
}

const BrandLogo = ({ brand }: { brand: CardBrand }) => {
  switch (brand) {
    case 'visa':
      return (
        <svg viewBox="0 0 48 48" className="h-8 w-auto fill-white">
          <path d="M33.64 31.76h-4.4l2.76-15.52h4.4l-2.76 15.52zm11.36-15.08c-.84-.32-2.12-.68-3.72-.68-4.12 0-7.04 2.2-7.08 5.32-.04 2.32 2.08 3.6 3.64 4.36 1.64.76 2.16 1.28 2.16 1.96 0 1.04-1.24 1.52-2.4 1.52-1.6 0-2.44-.24-3.76-.84l-.52-.24-.56 3.44c.92.44 2.64.8 4.44.84 4.4 0 7.24-2.16 7.28-5.52.04-1.84-1.08-3.24-3.48-4.4-1.44-.72-2.32-1.2-2.32-1.92 0-.68.76-1.4 2.4-1.4 1.36-.04 2.36.28 3.12.6l.36.16.84-3.64zm-19.8 0h-3.44c-1.08 0-1.88.32-2.36 1.44L13.16 31.76h4.64l.92-2.52h5.68l.52 2.52h4.08l-3.56-15.52zm-3.32 10.32l1.8-4.96 1.04 4.96h-2.84zM7.16 16.68L2.52 16c-.08-.04-.16-.08-.24-.12l-.08-.04-.04-.04v-.12h8.04l1.32 8.76 1.6-9.76h4.68l-3.28 15.52H9.28l-2.12-13.52z" />
        </svg>
      );
    case 'mastercard':
      return (
        <svg viewBox="0 0 48 48" className="h-8 w-auto">
          <circle cx="18" cy="24" r="15" fill="#EB001B" fillOpacity="0.8" />
          <circle cx="30" cy="24" r="15" fill="#F79E1B" fillOpacity="0.8" />
          <path d="M24 13.06c-3.1 2.76-5.06 6.78-5.06 10.94s1.96 8.18 5.06 10.94c3.1-2.76 5.06-6.78 5.06-10.94s-1.96-8.18-5.06-10.94z" fill="#FF5F00" />
        </svg>
      );
    case 'amex':
      return (
        <div className="bg-[#0070d1] text-white font-bold text-[10px] p-1 rounded-sm leading-none flex items-center justify-center h-8 w-12">
          AMEX
        </div>
      );
    case 'elo':
      return (
        <div className="bg-black text-white font-bold text-[10px] p-1 rounded-sm leading-none flex items-center justify-center h-8 w-12 italic border border-gray-600">
          ELO
        </div>
      );
    case 'hipercard':
      return (
        <div className="bg-[#b3131b] text-white font-bold text-[10px] p-1 rounded-sm leading-none flex items-center justify-center h-8 w-14 italic">
          HIPERCARD
        </div>
      );
    default:
      return (
        <div className="border border-white/30 rounded-md h-8 w-12 flex items-center justify-center">
          <div className="w-6 h-4 bg-white/20 rounded-sm" />
        </div>
      );
  }
};

export const VisualCreditCard: React.FC<VisualCreditCardProps> = ({
  number = '',
  name = '',
  expiry = '',
  cvv = '',
  isFlipped = false,
  className,
}) => {
  const brand = getCardBrand(number);
  
  const displayNum = number.padEnd(19, '•').replace(/\d/g, (d, i) => (i < 15 ? '•' : d));
  // Mostramos apenas os últimos 4 dígitos se o número estiver completo, senão mostramos os pontos
  const maskNumber = (num: string) => {
    const clean = num.replace(/\s/g, '');
    let masked = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) masked += ' ';
      if (clean[i]) {
        masked += clean[i];
      } else {
        masked += '•';
      }
    }
    return masked;
  };

  return (
    <div className={cn("perspective-1000 w-full max-w-[340px] h-[200px]", className)}>
      <div 
        className={cn(
          "relative w-full h-full transition-transform duration-500 preserve-3d cursor-default",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-[#1a1836] via-[#2d2a5d] to-[#d433bb] p-6 text-white shadow-2xl overflow-hidden border border-white/20">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg width="180" height="180" viewBox="0 0 100 100" className="fill-white">
              <circle cx="100" cy="0" r="100" />
            </svg>
          </div>
          <div className="absolute -bottom-10 -left-10 p-4 opacity-5">
            <svg width="200" height="200" viewBox="0 0 100 100" className="fill-white">
              <circle cx="0" cy="100" r="100" />
            </svg>
          </div>
          
          <div className="relative h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              {/* Chip */}
              <div className="w-11 h-9 bg-gradient-to-br from-[#f8e0f4] via-[#f2c1ea] to-[#e584d6] rounded-md overflow-hidden relative shadow-inner">
                <div className="absolute inset-0 border border-black/5 flex flex-col">
                  <div className="h-1/3 border-b border-black/10" />
                  <div className="h-1/3 border-b border-black/10" />
                  <div className="flex-1 flex">
                    <div className="w-1/2 border-r border-black/10" />
                    <div className="flex-1" />
                  </div>
                </div>
              </div>
              <BrandLogo brand={brand} />
            </div>

            <div className="space-y-4">
              <div className="text-xl tracking-[0.25em] font-mono font-semibold drop-shadow-md">
                {maskNumber(number)}
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-1 max-w-[70%]">
                  <p className="text-[9px] uppercase tracking-widest opacity-70 leading-none font-semibold">Titular</p>
                  <p className="text-sm font-semibold tracking-wider truncate uppercase drop-shadow-sm">
                    {name || 'NOME NO CARTÃO'}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] uppercase tracking-widest opacity-70 leading-none font-semibold">Validade</p>
                  <p className="text-sm font-semibold tracking-wider drop-shadow-sm">
                    {expiry || 'MM/AA'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-[#1a1836] to-[#2d2a5d] shadow-2xl overflow-hidden border border-white/20 rotate-y-180">
          <div className="mt-8 h-11 w-full bg-[#030213]/90" />
          <div className="mt-6 px-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-9 bg-white/10 rounded flex items-center justify-end px-3 border border-white/5">
                <div className="w-full h-6 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              </div>
              <div className="w-14 h-9 bg-white rounded-md flex items-center justify-center text-[#1a1836] font-mono font-bold shadow-lg">
                {cvv || '•••'}
              </div>
            </div>
            <p className="mt-4 text-[7px] text-white/40 italic leading-tight">
              Este cartão é pessoal e intransferível. O uso deste cartão está sujeito aos termos do contrato do emissor. Se encontrado, favor devolver ao banco emissor.
            </p>
          </div>
          <div className="absolute bottom-6 right-6 opacity-30">
            <BrandLogo brand={brand} />
          </div>
        </div>
      </div>
    </div>
  );
};
