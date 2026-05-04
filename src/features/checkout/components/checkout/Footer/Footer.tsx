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
                    viewBox="0 0 72 72"
                    fill="currentColor"
                    className="linkedin-icon"
                  >
                    <path d="M24.7612 55.999V28.3354H15.5433V55.999H24.7621H24.7612ZM20.1542 24.5591C23.3679 24.5591 25.3687 22.4348 25.3687 19.7801C25.3086 17.065 23.3679 15 20.2153 15C17.0605 15 15 17.065 15 19.7799C15 22.4346 17.0001 24.5588 20.0938 24.5588H20.1534L20.1542 24.5591ZM29.8633 55.999H39.0805V40.5521C39.0805 39.7264 39.1406 38.8985 39.3841 38.3088C40.0502 36.6562 41.5668 34.9455 44.1138 34.9455C47.4484 34.9455 48.7831 37.4821 48.7831 41.2014V55.999H58V40.1376C58 31.6408 53.4532 27.6869 47.3887 27.6869C42.4167 27.6869 40.233 30.4589 39.0198 32.347H39.0812V28.3364H29.8638C29.9841 30.9316 29.8631 56 29.8631 56L29.8633 55.999Z" />
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
