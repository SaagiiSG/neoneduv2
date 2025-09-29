'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Course {
  id: string;
  title: string;
  description?: string;
  link?: string;
  category?: string;
  duration?: string;
  levelitem1?: string;
  levelitem2?: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

interface CourseFormProps {
  course?: Course | null;
  onSubmit: (data: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}


export default function CourseForm({ course, onSubmit, onCancel }: CourseFormProps) {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    duration: course?.duration || '',
    levelitem1: course?.levelitem1 || '',
    levelitem2: course?.levelitem2 || '',
    image: course?.image || ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    }

    if (!formData.levelitem1.trim()) {
      newErrors.levelitem1 = 'Level item 1 is required';
    }

    if (!formData.levelitem2.trim()) {
      newErrors.levelitem2 = 'Level item 2 is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Prepare data for database - only include fields that exist in current schema
      const submitData = {
        title: formData.title,
        description: `${formData.duration} - ${formData.levelitem1}, ${formData.levelitem2}`,
        link: 'https://neonedu.com', // Valid URL required by database constraint
        category: formData.duration, // Use duration as category for now
        image: formData.image || null
      };
      
      await onSubmit(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (2MB max for faster uploads)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB for faster uploads');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'courses');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await response.json();
      setFormData(prev => ({ ...prev, image: url }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl border border-gray-100 shadow-lg"
        >
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <ArrowLeft className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">
                  {course ? 'Edit Course' : 'Add New Course'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {course ? 'Update course information' : 'Add a new course to your catalog'}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-semibold text-black">
                Course Title *
              </label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full h-12 text-base text-black ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'}`}
                placeholder="Enter course title"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black">
                Course Image
              </label>
              
              {formData.image ? (
                <div className="space-y-4">
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
                    <Image
                      src={formData.image}
                      alt="Course preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="h-4 w-4" />
                      <span>{isUploading ? 'Uploading...' : 'Change Image'}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={removeImage}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50/50 transition-all duration-200 group"
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                      <p className="text-sm text-gray-600">Uploading...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-4 bg-gray-100 rounded-full group-hover:bg-green-100 transition-colors">
                        <ImageIcon className="h-8 w-8 text-gray-400 group-hover:text-green-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                          Click to upload course image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG up to 2MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="duration" className="block text-sm font-semibold text-black">
                Duration *
              </label>
              <Input
                id="duration"
                type="text"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                className={`w-full h-12 text-base text-black ${errors.duration ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'}`}
                placeholder="e.g., 4 months, 6 weeks, 12 weeks"
                disabled={isSubmitting}
              />
              {errors.duration && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.duration}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="levelitem1" className="block text-sm font-semibold text-black">
                Level Item 1 *
              </label>
              <Input
                id="levelitem1"
                type="text"
                value={formData.levelitem1}
                onChange={(e) => handleChange('levelitem1', e.target.value)}
                className={`w-full h-12 text-base text-black ${errors.levelitem1 ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'}`}
                placeholder="e.g., Beginner, Intermediate, Advanced"
                disabled={isSubmitting}
              />
              {errors.levelitem1 && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.levelitem1}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="levelitem2" className="block text-sm font-semibold text-black">
                Level Item 2 *
              </label>
              <Input
                id="levelitem2"
                type="text"
                value={formData.levelitem2}
                onChange={(e) => handleChange('levelitem2', e.target.value)}
                className={`w-full h-12 text-base text-black ${errors.levelitem2 ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'}`}
                placeholder="e.g., Upper Intermediate, Academic writing, Research methodology"
                disabled={isSubmitting}
              />
              {errors.levelitem2 && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                  {errors.levelitem2}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-8 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex items-center space-x-2 h-12 px-6 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-12 px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {course ? 'Update Course' : 'Create Course'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

