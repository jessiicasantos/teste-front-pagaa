import { BrowserRouter, Routes, Route } from 'react-router';
import { CheckoutPage } from './pages/CheckoutPage/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage/ConfirmationPage';
import { MainLayout } from './components/MainLayout';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<CheckoutPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </ThemeProvider>
  );
}