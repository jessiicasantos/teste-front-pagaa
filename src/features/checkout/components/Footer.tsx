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
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 hover:border-[#1877f2] hover:bg-[#1877f2] transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook w-4 h-4 text-gray-600 group-hover:text-white transition-colors"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 hover:border-transparent hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 transition-all duration-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram w-4 h-4 text-gray-600 group-hover:text-white transition-colors"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg></a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 hover:border-[#1da1f2] hover:bg-[#1da1f2] transition-all duration-300"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter w-4 h-4 text-gray-600 group-hover:text-white transition-colors"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a>
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
