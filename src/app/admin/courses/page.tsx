'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import CourseForm from '@/components/admin/CourseForm';
import { coursesAPI } from '@/lib/api';
import SidebarLayout from '@/components/admin/SidebarLayout';
import { Course } from '@/lib/types';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getAll();
      setCourses(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Ensure required fields have defaults
      const courseData = {
        ...data,
        duration: data.duration || '',
        description: data.description || '',
        image: data.image || '',
        title: data.title || ''
      };
      await coursesAPI.create(courseData);
      toast.success('Course created successfully');
      setShowForm(false);
      fetchCourses();
    } catch (error) {
      toast.error('Failed to create course');
    }
  };

  const handleUpdate = async (id: string, data: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Ensure required fields have defaults
      const courseData = {
        ...data,
        duration: data.duration || '',
        description: data.description || '',
        image: data.image || '',
        title: data.title || ''
      };
      await coursesAPI.update(id, courseData);
      toast.success('Course updated successfully');
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      toast.error('Failed to update course');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      await coursesAPI.delete(id);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  if (showForm) {
    return (
      <CourseForm
        onSubmit={handleCreate}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  if (editingCourse && editingCourse.id) {
    return (
      <CourseForm
        course={editingCourse}
        onSubmit={(data) => handleUpdate(editingCourse.id!, data)}
        onCancel={() => setEditingCourse(null)}
      />
    );
  }

  return (
    <SidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">Courses</h1>
              <p className="text-gray-600 mt-1">Manage your educational courses and programs</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Add Course</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-black">{courses.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <span className="text-white font-bold text-sm">CAT</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-black">
                  {new Set(courses.map(c => c.category)).size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-black">{courses.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Start building your course catalog by adding your first course. Showcase your educational offerings to students.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => {
              // Transform course data to match main page structure
              const transformedCourse = {
                name: course.title,
                duration: course.duration || (course.description?.includes('months') ? 
                  course.description.match(/\d+ months/)?.[0] || '4 months' : '4 months'),
                image: course.image || (course.title === 'General English' ? '/classroom2.svg' :
                       course.title === 'IELTS Preparation' ? '/classroom1.png' :
                       course.title === 'Academic English' ? '/office.svg' :
                       course.category === 'General English' ? '/classroom2.svg' :
                       course.category === 'IELTS Preparation' ? '/classroom1.png' :
                       '/office.svg'),
                levelItem1: course.levelitem1 || (course.description?.includes('Beginner') ? 'Beginner' :
                            course.description?.includes('Upper Intermediate') ? 'Upper Intermediate' :
                            'Research methodology'),
                levelItem2: course.levelitem2 || (course.description?.includes('Intermediate') ? 'Intermediate' :
                            course.description?.includes('Advanced') ? 'Advanced' :
                            'Academic writing')
              };

              return (
                <motion.div 
                  key={course.id}
                  className='h-[280px] w-full max-w-[400px] flex flex-col items-start justify-start rounded-3xl relative overflow-hidden py-4 px-5 group'
                  style={{ willChange: 'transform, opacity' }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* EXACT structure from main page.tsx */}
                  <div className='w-full h-full absolute top-0 left-0 z-10 bg-gradient-to-r from-black/65 from-30% to-transparent to-100% '></div>
                  <img 
                    src={transformedCourse.image} 
                    alt={transformedCourse.name} 
                    className='absolute top-0 left-0 w-full h-full object-cover'
                    loading="lazy"
                    decoding="async"
                  />
                  <div className='z-50'>
                      <div>
                          <h1 className='text-[40px] font-montserrat font-medium text-[#DFDFDF] -tracking-[0.2rem]'>{transformedCourse.name}</h1>
                          <p className='text-[12px] font-montserrat font-medium text-[#E0E0E0] tracking-[0%] -mt-2 ml-1'>{transformedCourse.duration}</p>
                      </div>
                      <div className='absolute bottom-8 left-4 flex flex-col items-start gap-6'>

                        <div className='flex items-center gap-2'>
                          <BookOpen className='h-4 w-4 text-[#E0E0E0]' />
                          <p className='text-[14px] font-montserrat font-medium text-[#E0E0E0] tracking-[0%]'>Difficulty :</p>
                        </div>
                        <div className='flex flex-col items-start gap-2'>
                          <p className='text-[16px] font-montserrat font-medium text-[#E0E0E0] tracking-[0%]'>{transformedCourse.levelItem1}</p>
                          <p className='text-[16px] font-montserrat font-medium text-[#E0E0E0] tracking-[0%]'>{transformedCourse.levelItem2}</p>
                        </div>
                      </div>
                      
                      {/* Admin Controls - Team Member Style */}
                      <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                        <button
                          onClick={() => setEditingCourse(course)}
                          className="p-2.5 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 shadow-lg"
                          title="Edit course"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-2.5 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white hover:text-red-600 transition-all duration-200 shadow-lg"
                          title="Delete course"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}


