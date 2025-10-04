'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';
import Logo from './Logo';
import UserProfileDropdown from './UserProfileDropdown';
import LogoutIcon from '@mui/icons-material/Logout';

// Icon aliases
const LogOut = LogoutIcon;

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);

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
                      pathname.startsWith('/nfc/') ||
                      pathname.startsWith('/product-selection') ||
                      pathname.startsWith('/choose-plan') ||
                      pathname.startsWith('/welcome-to-linkist') ||
                      pathname.startsWith('/verify-mobile') ||
                      pathname.startsWith('/verify-login');

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
        } else if (response.status === 401) {
          // User not authenticated - this is expected, don't log error
          setUserData(null);
        }
      } catch (error) {
        // Only log network errors, not expected 401s
        if (error instanceof Error && error.message !== 'Failed to fetch') {
          console.error('Auth check error:', error);
        }
        setUserData(null);
      }
    };

    // Check onboarding status from localStorage
    const userOnboarded = localStorage.getItem('userOnboarded') === 'true';
    setIsOnboarded(userOnboarded);

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

  // For inner pages, render with simple header (only logo + logout after onboarding)
  if (isInnerPage) {
    // Only show logout on these pages (after user has completed onboarding)
    const showLogout = pathname.startsWith('/product-selection') ||
                       pathname.startsWith('/nfc/') ||
                       pathname.startsWith('/account') ||
                       pathname.startsWith('/choose-plan') ||
                       pathname.startsWith('/checkout') ||
                       pathname.startsWith('/confirm-payment');

    return (
      <>
        <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 h-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
            <Link href="/">
              <Logo width={140} height={45} noLink={true} />
            </Link>
            {showLogout && (
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

  // Check if it's the landing or home page (which has its own footer and navbar)
  const isLandingPage = pathname === '/landing' || pathname === '/';

  // For normal routes, render with navbar and footer (except landing/home page)
  return (
    <>
      {!isLandingPage && <Navbar />}
      <main className={`${!isLandingPage ? 'pt-16' : ''} flex-grow min-h-0`}>
        {children}
      </main>
      {!isLandingPage && <Footer />}
    </>
  );
}