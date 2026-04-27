import { BrowserRouter, Routes, Route } from 'react-router';
import { CheckoutPage } from './features/checkout/components/CheckoutPage';
import { ConfirmationPage } from './features/checkout/components/ConfirmationPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CheckoutPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
      </Routes>
    </BrowserRouter>
  );
}