'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RBAC, Permission, usePermissions } from '@/lib/rbac';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import GroupsIcon from '@mui/icons-material/Groups';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DescriptionIcon from '@mui/icons-material/Description';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import EmailIcon from '@mui/icons-material/Email';
import SettingsIcon from '@mui/icons-material/Settings';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

// Icon aliases
const LayoutDashboard = DashboardIcon;
const Package = Inventory2Icon;
const Users = GroupsIcon;
const ShoppingCart = ShoppingCartIcon;
const FileText = DescriptionIcon;
const BarChart = BarChartIcon;
const UserCheck = PersonAddAlt1Icon;
const Mail = EmailIcon;
const Settings = SettingsIcon;
const CreditCard = CreditCardIcon;
const Menu = MenuIcon;
const X = CloseIcon;
const LogOut = LogoutIcon;
const User = PersonIcon;
const Ticket = ConfirmationNumberIcon;

interface AuthUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  permissions?: Permission[];
  canAccessAdmin?: boolean;
  isAdmin?: boolean;
  isModerator?: boolean;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    permission: Permission.VIEW_STATS,
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: Package,
    permission: Permission.VIEW_ORDERS,
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: Users,
    permission: Permission.VIEW_CUSTOMERS,
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: ShoppingCart,
    permission: Permission.VIEW_ORDERS,
  },
  {
    name: 'Vouchers',
    href: '/admin/vouchers',
    icon: Ticket,
    permission: Permission.VIEW_ORDERS,
  },
  {
    name: 'Content',
    href: '/admin/content',
    icon: FileText,
    permission: Permission.SYSTEM_SETTINGS,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart,
    permission: Permission.VIEW_STATS,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: UserCheck,
    permission: Permission.VIEW_USERS,
  },
  {
    name: 'Communications',
    href: '/admin/communications',
    icon: Mail,
    permission: Permission.SEND_EMAILS,
  },
  {
    name: 'E-commerce',
    href: '/admin/ecommerce',
    icon: CreditCard,
    permission: Permission.SYSTEM_SETTINGS,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    permission: Permission.SYSTEM_SETTINGS,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const { hasPermission, canAccessAdmin } = usePermissions(currentUser);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
        
        if (!data.canAccessAdmin) {
          window.location.href = '/';
          return;
        }
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!canAccessAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const filteredNavigation = navigationItems.filter(item => 
    hasPermission(item.permission)
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 bg-slate-900">
          <div className="flex items-center">
            <div className="text-white font-bold text-xl">Linkist Admin</div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href || 
                             (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-slate-700 text-white'
                      : 'text-white hover:bg-slate-700'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-white' : 'text-white group-hover:text-white'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-slate-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {currentUser?.first_name || currentUser?.email}
                </p>
                <p className="text-xs text-slate-400">
                  {RBAC.getRoleName(currentUser?.role || '')}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-white"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex-1 lg:ml-0">
              <h1 className="text-xl font-semibold text-gray-900">
                {navigationItems.find(item => pathname === item.href)?.name || 'Admin'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {currentUser?.first_name || currentUser?.email}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}