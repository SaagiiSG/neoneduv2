'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, BookOpen, Globe, Phone, ArrowRight, Clock } from 'lucide-react';
import SidebarLayout from '@/components/admin/SidebarLayout';

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
    title: 'Contact Info',
    description: 'Update address, phone, email, and social links',
    icon: Phone,
    href: '/admin/contact-info',
    color: 'bg-orange-500'
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
  return (
    <SidebarLayout>
      <div className="space-y-8">
        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={section.href} className="block">
                  <div className={`${section.color} text-white rounded-lg shadow-md p-6 h-48 flex flex-col justify-between transform hover:scale-105 transition-transform duration-200`}>
                    <div className="flex justify-between items-start">
                      <section.icon className="h-8 w-8" />
                      <ArrowRight className="h-5 w-5" />
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