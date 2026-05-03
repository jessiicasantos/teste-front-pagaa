import { Lock } from 'lucide-react';
import './Header.css';

export function Header() {
  return (
    <header className="top-header">
      <nav className="app-container">
        <div className="left">
          <a href="/" className="logo">
            <h1>
              pagaa <strong>.</strong>
            </h1>
            <div className="logo-bottom">
              <span className="line" />
              <p>Checkout</p>
            </div>
          </a>
        </div>
        <div className="right">
          <div className="tag-green tag-lock">
            <Lock />
            <span>Compra Segura</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
