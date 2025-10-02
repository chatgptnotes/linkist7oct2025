'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Logo from './Logo';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking for session cookie
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(data.isAuthenticated);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 h-16 w-full shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Logo width={140} height={45} />

        {/* Desktop Navigation Items */}
        <div className="hidden md:flex items-center gap-8">
          {!isLoggedIn ? (
            <>
              <Link
                href="/templates"
                className="text-black text-base font-medium hover:text-gray-600 transition-colors duration-300"
              >
                Templates
              </Link>
              <Link
                href="/landing#pricing"
                className="text-black text-base font-medium hover:text-gray-600 transition-colors duration-300"
              >
                Pricing
              </Link>
              <Link
                href="/founding-member"
                className="text-black text-base font-medium hover:text-gray-600 transition-colors duration-300"
              >
                Founding Member
              </Link>
              <Link
                href="/landing#features"
                className="text-black text-base font-medium hover:text-gray-600 transition-colors duration-300"
              >
                Features
              </Link>
              <Link
                href="/login"
                className="text-black text-base font-medium hover:text-gray-600 transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-base font-semibold transition-colors duration-300"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/templates"
                className="text-black text-base font-medium hover:text-gray-600 transition-colors duration-300"
              >
                Templates
              </Link>
              <Link
                href="/account"
                className="text-black text-base font-medium hover:text-gray-600 transition-colors duration-300"
              >
                Dashboard
              </Link>
              <Link
                href="/product-selection"
                className="text-black text-base font-medium hover:text-gray-600 transition-colors duration-300"
              >
                New Card
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-base font-semibold transition-colors duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
          <div className="px-4 py-4 space-y-4">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/templates"
                  className="block text-black text-base font-medium hover:text-gray-600 transition-colors duration-300 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Templates
                </Link>
                <Link
                  href="/landing#pricing"
                  className="block text-black text-base font-medium hover:text-gray-600 transition-colors duration-300 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/founding-member"
                  className="block text-black text-base font-medium hover:text-gray-600 transition-colors duration-300 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Founding Member
                </Link>
                <Link
                  href="/landing#features"
                  className="block text-black text-base font-medium hover:text-gray-600 transition-colors duration-300 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="/login"
                  className="block text-black text-base font-medium hover:text-gray-600 transition-colors duration-300 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg text-base font-semibold transition-colors duration-300 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/templates"
                  className="block text-black text-base font-medium hover:text-gray-600 transition-colors duration-300 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Templates
                </Link>
                <Link
                  href="/account"
                  className="block text-black text-base font-medium hover:text-gray-600 transition-colors duration-300 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/product-selection"
                  className="block text-black text-base font-medium hover:text-gray-600 transition-colors duration-300 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  New Card
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg text-base font-semibold transition-colors duration-300 text-center"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
