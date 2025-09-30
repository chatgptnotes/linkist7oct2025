'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 h-16 w-full shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Linkist</span>
          </Link>
        </div>

        {/* Desktop Navigation Items */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="#" 
            className="text-black text-base font-medium hover:text-gray-600 transition-colors duration-300"
          >
            About
          </Link>
          <Link 
            href="#" 
            className="text-black text-base font-medium hover:text-gray-600 transition-colors duration-300"
          >
            Support
          </Link>
          <Link 
            href="/admin-login" 
            className="text-black text-base font-medium hover:text-gray-600 transition-colors duration-300"
          >
            Login
          </Link>
          <Link
            href="/nfc/configure"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-base font-semibold transition-colors duration-300"
          >
            Order Now
          </Link>
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
            <Link 
              href="#" 
              className="block text-black text-base font-medium hover:text-gray-600 transition-colors duration-300 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="#" 
              className="block text-black text-base font-medium hover:text-gray-600 transition-colors duration-300 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Support
            </Link>
            <Link 
              href="/admin-login" 
              className="block text-black text-base font-medium hover:text-gray-600 transition-colors duration-300 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/nfc/configure"
              className="block bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg text-base font-semibold transition-colors duration-300 text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Order Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}