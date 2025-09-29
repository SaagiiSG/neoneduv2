'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, BookOpen, Globe, ArrowRight, Clock } from 'lucide-react';
import SidebarLayout from '@/components/admin/SidebarLayout';
import { createClient } from '@supabase/supabase-js';
import { User } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const adminSections = [
  {
    title: 'Team Members',
    description: 'Manage your team members, their roles, and bios',
    icon: Users,
    href: '/admin/team-members',
    color: 'bg-blue-500'
  },
  {
    title: 'Find a Course',
    description: 'Add, edit, or remove courses offered',
    icon: BookOpen,
    href: '/admin/courses',
    color: 'bg-green-500'
  },
  {
    title: 'Study Abroad',
    description: 'Manage study abroad programs and destinations',
    icon: Globe,
    href: '/admin/study-abroad',
    color: 'bg-purple-500'
  },
  {
    title: 'History',
    description: 'Add and edit company timeline events',
    icon: Clock,
    href: '/admin/history',
    color: 'bg-indigo-500'
  }
];

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">
                Welcome back, {user?.email?.split('@')[0] || 'Admin'}!
              </h1>
              <p className="text-gray-600">
                Manage your Neon Edu content and settings from this dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-black mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={section.href} className="block">
                  <div className={`${section.color} text-white rounded-xl shadow-lg p-6 h-48 flex flex-col justify-between transform hover:scale-105 hover:shadow-xl transition-all duration-200 hover:-translate-y-1`}>
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <section.icon className="h-8 w-8" />
                      </div>
                      <ArrowRight className="h-5 w-5 opacity-80" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                      <p className="text-sm opacity-90">{section.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}