'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from './ImageUpload';

interface StudyAbroadProgram {
  id: string;
  program_name: string;
  country: string;
  description: string;
  universities: string;
  link: string;
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
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const handleImageChange = (imageUrl: string) => {
    // For study abroad, we don't have image upload yet, but keeping the structure
    console.log('Image uploaded:', imageUrl);
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
      
      await onSubmit({
        ...formData,
        description: combinedDescription
      });
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
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {program ? 'Edit Study Abroad Program' : 'Add Study Abroad Program'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Program Name Field */}
        <div>
          <label htmlFor="program_name" className="block text-sm font-medium text-gray-700 mb-1">
            Program Name
          </label>
          <Input
            id="program_name"
            name="program_name"
            type="text"
            value={formData.program_name}
            onChange={handleInputChange}
            className="w-full"
            disabled={isSubmitting}
          />
        </div>

        {/* Country Field */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country *
          </label>
          <Input
            id="country"
            name="country"
            type="text"
            value={formData.country}
            onChange={handleInputChange}
            className={`w-full ${errors.country ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          />
          {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`w-full ${errors.description ? 'border-red-500' : ''}`}
            rows={3}
            disabled={isSubmitting}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          <p className="mt-1 text-sm text-gray-500">This will be the main heading on the card</p>
        </div>

        {/* Universities Field */}
        <div>
          <label htmlFor="universities" className="block text-sm font-medium text-gray-700 mb-1">
            Universities Information *
          </label>
          <Textarea
            id="universities"
            name="universities"
            value={formData.universities}
            onChange={handleInputChange}
            className={`w-full ${errors.universities ? 'border-red-500' : ''}`}
            rows={2}
            disabled={isSubmitting}
          />
          {errors.universities && <p className="mt-1 text-sm text-red-600">{errors.universities}</p>}
          <p className="mt-1 text-sm text-gray-500">This will be the supporting text on the card</p>
        </div>

        {/* Link Field */}
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
            Link (Optional)
          </label>
          <Input
            id="link"
            name="link"
            type="url"
            value={formData.link}
            onChange={handleInputChange}
            className="w-full"
            disabled={isSubmitting}
          />
          <p className="mt-1 text-sm text-gray-500">External link for more information</p>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
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