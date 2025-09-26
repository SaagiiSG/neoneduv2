'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Globe, 
  Phone, 
  Menu, 
  X, 
  LogOut, 
  User,
  Home,
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: Home,
    color: 'text-blue-600'
  },
  {
    name: 'Team Members',
    href: '/admin/team-members',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    name: 'Courses',
    href: '/admin/courses',
    icon: BookOpen,
    color: 'text-green-600'
  },
  {
    name: 'Study Abroad',
    href: '/admin/study-abroad',
    icon: Globe,
    color: 'text-purple-600'
  },
  {
    name: 'Contact Info',
    href: '/admin/contact-info',
    icon: Phone,
    color: 'text-orange-600'
  },
  {
    name: 'History',
    href: '/admin/history',
    icon: Clock,
    color: 'text-indigo-600'
  }
];

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  React.useEffect(() => {
    const saved = localStorage.getItem('admin.sidebar.collapsed');
    if (saved === 'true') {
      setCollapsed(true);
    }
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('admin.sidebar.collapsed', next ? 'true' : 'false');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('supabase.auth.token');
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Neon Edu Admin</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? item.color : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex ${collapsed ? 'lg:w-20' : 'lg:w-64'} lg:flex-col`}>
        <div className="flex flex-col flex-grow bg-white shadow-lg">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <h1 className={`text-xl font-bold text-gray-900 transition-opacity ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>Neon Edu Admin</h1>
            <button
              onClick={toggleCollapsed}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </div>
          <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-4'} py-4 space-y-2`}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`${collapsed ? '' : 'mr-3'} h-5 w-5 ${isActive ? item.color : 'text-gray-400'}`} />
                  {!collapsed && item.name}
                </Link>
              );
            })}
          </nav>
          <div className={`border-t border-gray-200 ${collapsed ? 'p-2' : 'p-4'}`}>
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3 mb-3'}`}>
              <User className="h-5 w-5 text-gray-400" />
              {!collapsed && <span className="text-sm text-gray-600">{user?.email}</span>}
            </div>
            <button
              onClick={handleLogout}
              className={`flex ${collapsed ? 'justify-center' : ''} w-full items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
            >
              <LogOut className={`${collapsed ? '' : 'mr-3'} h-5 w-5`} />
              {!collapsed && 'Logout'}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}


