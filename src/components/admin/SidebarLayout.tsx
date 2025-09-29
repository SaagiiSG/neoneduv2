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
  const [sessionExpired, setSessionExpired] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Session timeout configuration (2 hours = 7200000 ms)
  const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;
  const [lastActivity, setLastActivity] = useState(Date.now());

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // Check if session exists and is valid
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      
      // Set last activity time
      setLastActivity(Date.now());
    };
    getUser();
  }, [router]);

  // Session timeout effect
  React.useEffect(() => {
    const checkSessionTimeout = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      
      if (timeSinceLastActivity > SESSION_TIMEOUT) {
        setSessionExpired(true);
        handleLogout(true);
      }
    };

    // Check session timeout every minute
    const interval = setInterval(checkSessionTimeout, 60000);
    
    // Update last activity on user interaction
    const updateActivity = () => setLastActivity(Date.now());
    
    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      clearInterval(interval);
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [lastActivity]);

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

  const handleLogout = async (isSessionExpired = false) => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('admin.sidebar.collapsed');
      
      if (isSessionExpired) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.success('Logged out successfully');
      }
      
      router.push('/admin/login');
    } catch (error) {
      toast.error('Error logging out');
      router.push('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <motion.div 
        className="fixed inset-0 z-50 lg:hidden"
        initial={false}
        animate={{ display: sidebarOpen ? 'block' : 'none' }}
      >
        <motion.div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75" 
          onClick={() => setSidebarOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: sidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div 
          className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl"
          initial={{ x: -256 }}
          animate={{ x: sidebarOpen ? 0 : -256 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
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
        </motion.div>
      </motion.div>

      {/* Desktop sidebar */}
      <motion.div 
        className="hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col"
        animate={{ width: collapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col flex-grow bg-white shadow-lg">
          <div className={`flex h-16 items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 border-b border-gray-200`}>
            <motion.h1 
              className="text-xl font-bold text-gray-900"
              initial={false}
              animate={{ opacity: collapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              style={{ position: collapsed ? 'absolute' : 'static', pointerEvents: collapsed ? 'none' : 'auto' }}
            >
              Neon Edu Admin
            </motion.h1>
            <motion.button
              onClick={toggleCollapsed}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 z-10"
              aria-label="Toggle sidebar"
            >
              <motion.div
                animate={{ rotate: collapsed ? 0 : 180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronRight className="h-5 w-5" />
              </motion.div>
            </motion.button>
          </div>
          <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-4'} py-4 space-y-2`}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`${collapsed ? '' : 'mr-3'} h-5 w-5 ${isActive ? item.color : 'text-gray-400'}`} />
                    <motion.span
                      initial={false}
                      animate={{ opacity: collapsed ? 0 : 1 }}
                      transition={{ duration: 0.2 }}
                      className={collapsed ? 'absolute pointer-events-none' : ''}
                    >
                      {item.name}
                    </motion.span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
          <div className={`border-t border-gray-200 ${collapsed ? 'p-2' : 'p-4'}`}>
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3 mb-3'}`}>
              <User className="h-5 w-5 text-gray-400" />
              <motion.span
                initial={false}
                animate={{ opacity: collapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className={collapsed ? 'absolute pointer-events-none' : 'text-sm text-gray-600'}
              >
                {user?.email}
              </motion.span>
            </div>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex ${collapsed ? 'justify-center' : ''} w-full items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200`}
            >
              <LogOut className={`${collapsed ? '' : 'mr-3'} h-5 w-5`} />
              <motion.span
                initial={false}
                animate={{ opacity: collapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className={collapsed ? 'absolute pointer-events-none' : ''}
              >
                Logout
              </motion.span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div 
        className="lg:pl-20"
        animate={{ paddingLeft: collapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
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
      </motion.div>
    </div>
  );
}


