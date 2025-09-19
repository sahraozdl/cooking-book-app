'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useUser } from '@/store/UserContext';
import FullPageLoader from '@/components/FullPageLoader';

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useUser();

  if (loading) return <FullPageLoader />;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </header>
      <main className="flex-grow px-4 py-6 bg-orange-50">{children}</main>
      <Footer />
    </div>
  );
};

export default AppWrapper;
