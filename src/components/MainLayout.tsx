import { Header } from '@/features/Header/Header';
import { Footer } from '@/features/Footer/Footer';
import { Outlet } from 'react-router';

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
        <main className="flex-1">
          <Outlet />
        </main>
      <Footer />
    </div>
  );
}
