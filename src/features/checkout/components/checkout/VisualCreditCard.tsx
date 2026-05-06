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
        <svg viewBox="0 0 32 32" className="h-8 w-auto fill-white">
          <title>visa</title>
          <path d="M15.854 11.329l-2.003 9.367h-2.424l2.006-9.367zM26.051 17.377l1.275-3.518 0.735 3.518zM28.754 20.696h2.242l-1.956-9.367h-2.069c-0.003-0-0.007-0-0.010-0-0.459 0-0.853 0.281-1.019 0.68l-0.003 0.007-3.635 8.68h2.544l0.506-1.4h3.109zM22.429 17.638c0.010-2.473-3.419-2.609-3.395-3.714 0.008-0.336 0.327-0.694 1.027-0.785 0.13-0.013 0.28-0.021 0.432-0.021 0.711 0 1.385 0.162 1.985 0.452l-0.027-0.012 0.425-1.987c-0.673-0.261-1.452-0.413-2.266-0.416h-0.001c-2.396 0-4.081 1.275-4.096 3.098-0.015 1.348 1.203 2.099 2.122 2.549 0.945 0.459 1.262 0.754 1.257 1.163-0.006 0.63-0.752 0.906-1.45 0.917-0.032 0.001-0.071 0.001-0.109 0.001-0.871 0-1.691-0.219-2.407-0.606l0.027 0.013-0.439 2.052c0.786 0.315 1.697 0.497 2.651 0.497 0.015 0 0.030-0 0.045-0h-0.002c2.546 0 4.211-1.257 4.22-3.204zM12.391 11.329l-3.926 9.367h-2.562l-1.932-7.477c-0.037-0.364-0.26-0.668-0.57-0.82l-0.006-0.003c-0.688-0.338-1.488-0.613-2.325-0.786l-0.066-0.011 0.058-0.271h4.124c0 0 0.001 0 0.001 0 0.562 0 1.028 0.411 1.115 0.948l0.001 0.006 1.021 5.421 2.522-6.376z"></path>
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
        <svg viewBox="0 0 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" className="h-8 w-auto">
          <defs>
            <path d="M2.27464661e-14,0 L254.693878,3.04336596e-14 L254.693878,160.344259 C255.3267,161.198982 255.762422,162.157626 256,163.39634 L256,168.36419 C255.762422,169.608049 255.3267,170.691008 254.693878,171.604678 L254.693878,256 L0,256 L0,192 L0,64 L2.27464661e-14,0 Z" id="path-1"></path>
            <radialGradient cx="16.6089694%" cy="17.3718345%" fx="16.6089694%" fy="17.3718345%" r="118.520308%" id="radialGradient-3">
              <stop stopColor="#88CDE7" offset="0%"></stop>
              <stop stopColor="#2274AD" offset="100%"></stop>
            </radialGradient>
          </defs>
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g>
              <mask id="mask-2" fill="white">
                <use xlinkHref="#path-1"></use>
              </mask>
              <polygon fill="url(#radialGradient-3)" mask="url(#mask-2)" points="0 256 256 256 256 0 0 0"></polygon>
            </g>
            <path d="M22.9367474,110.957581 L18.0381744,99.0628738 L13.1694447,110.957581 L22.9367474,110.957581 Z M130.730933,106.238068 C129.763156,106.788039 128.599265,106.847725 127.196627,106.847725 L118.507949,106.847725 L118.507949,100.205448 L127.311738,100.205448 C128.569422,100.205448 129.874002,100.252345 130.722406,100.712785 C131.63476,101.168962 132.214574,102.094106 132.214574,103.36458 C132.214574,104.681951 131.651814,105.709415 130.730933,106.238068 L130.730933,106.238068 Z M192.677204,110.957581 L187.748788,99.0628738 L182.850215,110.957581 L192.677204,110.957581 Z M77.2047505,123.858436 L69.876076,123.858436 L69.8334427,100.465511 L59.4777997,123.858436 L53.2021692,123.858436 L42.7911028,100.414351 L42.7911028,123.858436 L28.2488639,123.858436 L25.5118023,117.190578 L10.6199698,117.190578 L7.85732813,123.858436 L0.085266719,123.858436 L12.8710112,93.951134 L23.5080344,93.951134 L35.6628051,122.285265 L35.6628051,93.951134 L47.3486089,93.951134 L56.6938413,114.257403 L65.2972532,93.951134 L77.2047505,93.951134 L77.2047505,123.858436 Z M106.404338,123.858436 L82.5211304,123.858436 L82.5211304,93.951134 L106.404338,93.951134 L106.404338,100.205448 L89.6877981,100.205448 L89.6877981,105.572988 L105.995058,105.572988 L105.995058,111.720718 L89.6877981,111.695138 L89.6877981,117.668072 L106.404338,117.668072 L106.404338,123.858436 Z M140.088955,102.030156 C140.088955,106.758195 136.908507,109.25651 135.066746,109.994067 C136.627127,110.595198 137.953024,111.626925 138.575471,112.522225 C139.585882,113.980286 139.786258,115.344554 139.786258,117.975032 L139.786258,123.858436 L132.572694,123.858436 L132.551377,120.098173 C132.551377,118.320362 132.721911,115.728254 131.39175,114.295773 C130.347233,113.225676 128.774062,113.003982 126.19048,113.003982 L118.507949,113.003982 L118.507949,123.858436 L111.362598,93.951134 L127.831865,93.951134 C131.4557,93.951134 134.162918,94.0705074 136.47791,95.4006682 C138.750268,96.7223024 140.088955,98.6791736 140.088955,102.034419" fill="#FFFFFF"></path>
          </g>
        </svg>
      );
    case 'elo':
      return (
        <svg viewBox="0 -140 780 780" version="1.1" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
          <path d="M41.68,0h698.14c23.027,0,41.68,18.983,41.68,42.42v414.66c0,23.437-18.652,42.42-41.68,42.42H41.68 C18.652,499.5,0,480.517,0,457.08V42.42C0,18.983,18.652,0,41.68,0z" />
          <path d="m167.25 181.4c6.8-2.3 14.1-3.5 21.7-3.5 33.2 0 60.9 23.601 67.2 54.9l47-9.6c-10.8-53.2-57.8-93.301-114.2-93.301-12.9 0-25.3 2.101-36.9 6l15.2 45.501z" fill="#FFF100" />
          <path d="m111.75 333.8l31.8-36c-14.2-12.6-23.1-30.9-23.1-51.4 0-20.399 8.9-38.8 23.1-51.3l-31.8-35.899c-24.1 21.399-39.3 52.5-39.3 87.3 0 34.699 15.2 65.898 39.3 87.299z" fill="#00A3DF" />
          <path d="m256.15 260.2c-6.4 31.3-34 54.8-67.2 54.8-7.6 0-14.9-1.2-21.8-3.5l-15.2 45.5c11.6 3.899 24.1 6 37 6 56.4 0 103.4-40 114.2-93.2l-47-9.6z" fill="#EE4023" />
          <path d="m459.75 292.4c-7.8 7.601-18.3 12.2-29.9 12-8-0.1-15.399-2.5-21.6-6.5l-15.601 24.801c10.7 6.699 23.2 10.699 36.801 10.899 19.699 0.3 37.699-7.5 50.8-20.2l-20.5-21zm-28.2-101.1c-39.2-0.6-71.6 30.8-72.2 70-0.2 14.7 4 28.5 11.5 39.9l128.8-55.101c-7.2-30.899-34.8-54.2-68.1-54.799m-42.7 75.599c-0.2-1.6-0.3-3.3-0.3-5 0.4-23.1 19.4-41.6 42.5-41.199 12.6 0.199 23.8 5.899 31.3 14.899l-73.5 31.3zm151.3-107.6v137.3l23.801 9.9-11.301 27.1-23.6-9.8c-5.3-2.3-8.9-5.8-11.6-9.8-2.601-4-4.601-9.601-4.601-17v-137.7h27.301zm85.901 63.5c4.2-1.4 8.6-2.1 13.3-2.1 20.3 0 37.101 14.399 41 33.5l28.7-5.9c-6.6-32.5-35.3-56.9-69.7-56.9-7.899 0-15.5 1.301-22.5 3.601l9.2 27.799zm-33.901 92.9l19.4-21.9c-8.7-7.7-14.1-18.9-14.1-31.4s5.5-23.699 14.1-31.3l-19.4-21.899c-14.699 13-24 32.1-24 53.3s9.301 40.199 24 53.199zm88.201-44.801c-3.899 19.101-20.8 33.5-41 33.5-4.6 0-9.1-0.8-13.3-2.199l-9.3 27.8c7.1 2.399 14.7 3.7 22.6 3.7 34.4 0 63.101-24.4 69.7-56.9l-28.7-5.901z" fill="#ffffff" />
        </svg>
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
  
  // Mostramos apenas os últimos 4 dígitos se o número estiver completo, senão mostramos os pontos
  const maskNumber = (num: string, cardBrand: CardBrand) => {
    const clean = num.replace(/\D/g, '');
    const isAmex = cardBrand === 'amex';
    const maxLength = isAmex ? 15 : 16;
    
    let masked = '';
    for (let i = 0; i < maxLength; i++) {
      // Adiciona espaços baseados no padrão da bandeira
      if (isAmex) {
        if (i === 4 || i === 10) masked += ' ';
      } else {
        if (i > 0 && i % 4 === 0) masked += ' ';
      }
      
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
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl bg-gradient-to-t from-[#1a1836] via-[#2d2a5d] to-[#d433bb] p-6 text-white shadow-2xl overflow-hidden border border-white/20">
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
                {maskNumber(number, brand)}
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
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl bg-gradient-to-t from-[#d433bb] via-[#2d2a5d] to-[#1a1836] shadow-2xl overflow-hidden border border-white/20 rotate-y-180">
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
