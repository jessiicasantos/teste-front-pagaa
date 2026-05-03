import { Lock } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <a href="/" className="flex flex-col">
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
            </a>
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
