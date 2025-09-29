'use client';

import { useEffect } from 'react';
import { UserStore } from '@/lib/user-store';

export default function AdminInitializer() {
  useEffect(() => {
    // Initialize admin user on app start
    UserStore.initializeAdmin();
  }, []);

  return null; // This component doesn't render anything
}
