import { Lock } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <svg
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="pagaa ."
              >
                <circle cx="23" cy="23" r="22" fill="#000" />
                <circle cx="23" cy="23" r="21.25" fill="none" stroke="var(--accent)" strokeWidth="0.75" />
                <circle cx="23" cy="23" r="18" fill="none" stroke="var(--accent)" strokeWidth="0.4" strokeOpacity="0.55" />
                <path d="M14 23 L18 23" stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.7" strokeLinecap="round" />
                <path d="M28 23 L32 23" stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.7" strokeLinecap="round" />
                <text
                  x="23"
                  y="31"
                  fontFamily="Georgia, 'Times New Roman', serif"
                  fontSize="22"
                  fontStyle="italic"
                  fontWeight="700"
                  fill="var(--baby-pink)"
                  textAnchor="middle"
                  letterSpacing="0"
                >
                  P
                </text>
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="font-serif italic text-[26px] leading-none tracking-tight text-gray-900">
                pagaa <strong className="text-accent">.</strong>
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="block h-px w-4 bg-accent" />
                <p className="text-[10px] uppercase font-medium tracking-[0.32em] text-gray-500">
                  Checkout
                </p>
                <span className="block h-px w-4 bg-accent" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium">Compra Segura</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
