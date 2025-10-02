'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';
import Logo from './Logo';
import UserProfileDropdown from './UserProfileDropdown';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

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

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAuth();
  }, [pathname]);

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

  // For inner pages, render with simple header (with user dropdown)
  if (isInnerPage) {
    return (
      <>
        <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 h-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
            <Link href="/">
              <Logo width={140} height={45} noLink={true} />
            </Link>
            {userData ? (
              <UserProfileDropdown userData={userData} />
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-sm sm:text-base text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </header>
        <main className="pt-16 flex-grow min-h-0">
          {children}
        </main>
      </>
    );
  }

  // Check if it's the landing page (which has its own footer)
  const isLandingPage = pathname === '/landing';

  // For normal routes (home page), render with navbar and footer (except landing page)
  return (
    <>
      <Navbar />
      <main className="pt-16 flex-grow min-h-0">
        {children}
      </main>
      {!isLandingPage && <Footer />}
    </>
  );
}