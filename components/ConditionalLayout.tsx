'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Check if current route is admin-related
  const isAdminRoute = pathname.startsWith('/admin') ||
                       pathname.startsWith('/admin-login') ||
                       pathname.startsWith('/admin-access');

  // Check if current route is an inner page (checkout flow, account, etc.)
  const isInnerPage = pathname.startsWith('/checkout') ||
                      pathname.startsWith('/confirm-payment') ||
                      pathname.startsWith('/thank-you') ||
                      pathname.startsWith('/account') ||
                      pathname.startsWith('/verify-email') ||
                      pathname.startsWith('/nfc/');

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.clear();
      document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      router.push('/landing');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // For admin routes, render children without navbar/footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // For inner pages, render with simple header (only logout)
  if (isInnerPage) {
    return (
      <>
        <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 h-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
            <Link href="/landing" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">Linkist NFC</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-sm sm:text-base text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </header>
        <main className="pt-16 flex-grow min-h-0">
          {children}
        </main>
      </>
    );
  }

  // For normal routes (home page), render with navbar and footer
  return (
    <>
      <Navbar />
      <main className="pt-16 flex-grow min-h-0">
        {children}
      </main>
      <Footer />
    </>
  );
}