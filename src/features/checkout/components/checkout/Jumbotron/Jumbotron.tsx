import { Tag } from 'lucide-react';
import './Jumbotron.css';

interface JumbotronProps {
  onSelectPromo: (code: string) => void;
}

const promo = {
  code: 'DESCONTO10',
  description: 'Ganhe 10% de desconto em toda a sua compra',
};

export function Jumbotron({ onSelectPromo }: JumbotronProps) {
  return (
    <div className="jumbotron" onClick={() => onSelectPromo(promo.code)}>
      <div className="app-container content">
        <div className="icon">
          <Tag />
        </div>
        <p className="description">{promo.description}</p>
        <div className="badge">
          <span className="code">{promo.code}</span>
          <span className="cta">• Clique para aplicar</span>
        </div>
      </div>
    </div>
  );
}
