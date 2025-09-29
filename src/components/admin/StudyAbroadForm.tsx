'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Globe, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface StudyAbroadProgram {
  id: string;
  program_name: string;
  country: string;
  description: string;
  universities: string;
  link: string;
  image?: string;
}

interface StudyAbroadFormProps {
  program?: StudyAbroadProgram | null;
  onSubmit: (data: Partial<StudyAbroadProgram>) => void;
  onCancel: () => void;
}

export default function StudyAbroadForm({ program, onSubmit, onCancel }: StudyAbroadFormProps) {
  const [formData, setFormData] = useState({
    program_name: program?.program_name || '',
    country: program?.country || '',
    description: program?.description || '',
    universities: program?.universities || '',
    link: program?.link || '',
    image: program?.image || '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
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
      formData.append('folder', 'study-abroad');

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

  const validateForm = () => {
    let newErrors: {[key: string]: string} = {};
    
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.universities.trim()) {
      newErrors.universities = 'Universities information is required';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Background photo is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Combine description and universities for database storage
      const combinedDescription = `${formData.description}|${formData.universities}`;
      
      // Prepare data for database
      const submitData = {
        program_name: formData.program_name,
        country: formData.country,
        description: combinedDescription,
        universities: formData.universities,
        image: formData.image || null,
        link: 'https://neonedu.com' // Default link since database requires it
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
          <Globe className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-black">
            {program ? 'Edit Study Abroad Program' : 'Add Study Abroad Program'}
          </h2>
          <p className="text-gray-600 mt-1">
            {program ? 'Update program information' : 'Add a new study abroad program'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Program Name Field */}
        <div className="space-y-2">
          <label htmlFor="program_name" className="block text-sm font-semibold text-black">
            Program Name
          </label>
          <Input
            id="program_name"
            name="program_name"
            type="text"
            value={formData.program_name}
            onChange={handleInputChange}
            className="w-full h-12 text-base text-black border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            placeholder="Enter program name (optional)"
            disabled={isSubmitting}
          />
          <p className="text-sm text-gray-600">Optional: Specific program name</p>
        </div>


        {/* Country Field */}
        <div className="space-y-2">
          <label htmlFor="country" className="block text-sm font-semibold text-black">
            Country *
          </label>
          <Input
            id="country"
            name="country"
            type="text"
            value={formData.country}
            onChange={handleInputChange}
            className={`w-full h-12 text-base text-black ${errors.country ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'}`}
            placeholder="e.g., Australia, Singapore, South Korea"
            disabled={isSubmitting}
          />
          {errors.country && (
            <p className="text-sm text-red-600 flex items-center mt-1">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {errors.country}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-semibold text-black">
            Description *
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`w-full text-base text-black resize-none ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'}`}
            rows={3}
            placeholder="Describe the study abroad opportunities..."
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="text-sm text-red-600 flex items-center mt-1">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {errors.description}
            </p>
          )}
          <p className="text-sm text-gray-600">This will be the main heading on the card</p>
        </div>

        {/* Universities Field */}
        <div className="space-y-2">
          <label htmlFor="universities" className="block text-sm font-semibold text-black">
            Universities Information *
          </label>
          <Textarea
            id="universities"
            name="universities"
            value={formData.universities}
            onChange={handleInputChange}
            className={`w-full text-base text-black resize-none ${errors.universities ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'}`}
            rows={2}
            placeholder="List universities or educational institutions..."
            disabled={isSubmitting}
          />
          {errors.universities && (
            <p className="text-sm text-red-600 flex items-center mt-1">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {errors.universities}
            </p>
          )}
          <p className="text-sm text-gray-600">This will be the supporting text on the card</p>
        </div>

        {/* Image Upload Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-black">
            Upload Background Photo *
          </label>
          
          {formData.image ? (
            <div className="relative">
              <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                <Image
                  src={formData.image}
                  alt="Uploaded image"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                disabled={isSubmitting || isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-colors group"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isSubmitting || isUploading}
              />
              <div className="text-center">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
                ) : (
                  <div className="p-3 bg-purple-100 rounded-full mb-3 group-hover:bg-purple-200 transition-colors">
                    <ImageIcon className="h-6 w-6 text-purple-600" />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
                    {isUploading ? 'Uploading...' : 'Click to upload background image'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 2MB
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {errors.image && (
            <p className="text-sm text-red-600 flex items-center mt-1">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {errors.image}
            </p>
          )}
          
          <p className="text-sm text-gray-600">Upload a background image for the study abroad program card</p>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
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
            className="flex items-center space-x-2 h-12 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{program ? 'Update Program' : 'Add Program'}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}