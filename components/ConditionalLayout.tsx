'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if current route is admin-related
  const isAdminRoute = pathname.startsWith('/admin') || 
                       pathname.startsWith('/admin-login') || 
                       pathname.startsWith('/admin-access');

  // For admin routes, render children without navbar/footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // For normal routes, render with navbar and footer
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