import { Phone, Mail, User} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-5">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-start gap-8 mb-6">
           <div className="left flex items-center gap-8">
            <div>
              <h3 className="font-semibold mb-3">Sobre nós</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a
                    href="/quem-somos"
                    className="flex items-center gap-2 text-gray-600 hover:text-accent/90 transition-colors text-sm"
                  >
                    <User className="w-4 h-4" />
                    <span>Quem somos</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="center">
            <h3 className="font-semibold mb-3">Contato</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="tel:08007776666"
                  className="flex items-center gap-2 text-gray-600 hover:text-accent/90 transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>0800 777 6666</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@shopstyle.com.br"
                  className="flex items-center gap-2 text-gray-600 hover:text-accent/90 transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>contato@shopstyle.com.br</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="right">
            <h3 className="font-semibold mb-3">Redes sociais</h3>
            <ul className="space-y-2 text-sm text-gray-600 flex gap-4">
              <li>
                <a href="https://www.instagram.com/pagaa.pagamentos?igsh=cnJwbDU0am16dGR3&utm_source=qr" 
                  target="_blank" 
                  className="group flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 hover:border-transparent hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram w-4 h-4 text-gray-600 group-hover:text-white transition-colors">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/pagaa"
                  target="_blank"
                  className="group flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 hover:border-[#1877f2] hover:bg-[#1a1836] transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 72 72" className="relative z-10 transition-all duration-500 group-hover:fill-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path
                      d="M24.7612 55.999V28.3354H15.5433V55.999H24.7621H24.7612ZM20.1542 24.5591C23.3679 24.5591 25.3687 22.4348 25.3687 19.7801C25.3086 17.065 23.3679 15 20.2153 15C17.0605 15 15 17.065 15 19.7799C15 22.4346 17.0001 24.5588 20.0938 24.5588H20.1534L20.1542 24.5591ZM29.8633 55.999H39.0805V40.5521C39.0805 39.7264 39.1406 38.8985 39.3841 38.3088C40.0502 36.6562 41.5668 34.9455 44.1138 34.9455C47.4484 34.9455 48.7831 37.4821 48.7831 41.2014V55.999H58V40.1376C58 31.6408 53.4532 27.6869 47.3887 27.6869C42.4167 27.6869 40.233 30.4589 39.0198 32.347H39.0812V28.3364H29.8638C29.9841 30.9316 29.8631 56 29.8631 56L29.8633 55.999Z"></path>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="copyright border-t pt-6 text-center text-sm text-gray-600">
          <p className="text-sm text-gray-600">
            © 2026 ShopStyle. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
