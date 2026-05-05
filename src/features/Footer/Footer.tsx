import { Phone, Mail, User } from 'lucide-react';
import { Link } from 'react-router';
import './Footer.css';

export function Footer() {
  return (
    <footer>
      <div className="app-container">
        <div className="top">
          <div className="left about-us">
            <h3>Sobre nós</h3>
            <ul>
              <li>
                <Link to="#" className='link-quem-somos'>
                  <User size={16} />
                  Quem somos
                </Link>
              </li>
            </ul>
          </div>

          <div className="center contact">
            <h3>Contato</h3>
            <ul>
              <li>
                <Link
                  to="tel:+5511936196153"
                >
                  <Phone size={16} />
                  (11) 93619-6153
                </Link>
              </li>
              <li>
                <Link
                  to="mailto:contato@pagaa.com.br"
                >
                  <Mail size={16} />
                  contato@pagaa.com.br
                </Link>
              </li>
            </ul>
          </div>

          <div className="right social">
            <h3>Redes sociais</h3>
            <ul>
              <li>
                <Link
                  to="https://www.instagram.com/pagaa.pagamentos?igsh=cnJwbDU0am16dGR3&utm_source=qr"
                  target="_blank"
                  className="social-link instagram-link group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="instagram-icon"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  to="https://www.linkedin.com/company/pagaa"
                  target="_blank"
                  className="group social-link linkedin-link"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="linkedin-icon"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="bottom copyright">
          <p>
            © 2026 Pagaa. todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
