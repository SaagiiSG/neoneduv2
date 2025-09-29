'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from './ImageUpload';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

interface TeamMemberFormProps {
  member?: TeamMember | null;
  onSubmit: (data: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

export default function TeamMemberForm({ member, onSubmit, onCancel }: TeamMemberFormProps) {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    role: member?.role || '',
    image: member?.image || '',
    bio: member?.bio || '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
    setErrors(prev => ({ ...prev, image: '' })); // Clear error on change
  };

  // Helper function to check if a field has been modified
  const isFieldModified = (fieldName: string) => {
    if (!member) return false;
    return formData[fieldName as keyof typeof formData] !== member[fieldName as keyof typeof member];
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Image is required';
    }
    
    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
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
      await onSubmit(formData);
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
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold text-black">
            Full Name *
          </label>
          <div className="relative">
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full h-12 text-base text-black pr-10 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : isFieldModified('name') ? 'border-orange-400 focus:border-orange-500 focus:ring-orange-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
              disabled={isSubmitting}
              placeholder={member ? `Current: ${member.name}` : "Enter team member's full name"}
              onFocus={(e) => {
                if (member && e.target.value === member.name) {
                  e.target.select();
                }
              }}
            />
            {member && formData.name === member.name && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Current</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, name: '' }))}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Clear field"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            )}
            {member && isFieldModified('name') && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Modified</span>
              </div>
            )}
          </div>
          {errors.name && <p className="text-sm text-red-600 flex items-center mt-1">
            <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
            {errors.name}
          </p>}
        </div>

        {/* Role Field */}
        <div className="space-y-2">
          <label htmlFor="role" className="block text-sm font-semibold text-black">
            Position/Role *
          </label>
          <div className="relative">
            <Input
              id="role"
              name="role"
              type="text"
              value={formData.role}
              onChange={handleInputChange}
              className={`w-full h-12 text-base text-black pr-10 ${errors.role ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : isFieldModified('role') ? 'border-orange-400 focus:border-orange-500 focus:ring-orange-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
              disabled={isSubmitting}
              placeholder={member ? `Current: ${member.role}` : "e.g., CEO, Teacher, Marketing Manager"}
              onFocus={(e) => {
                if (member && e.target.value === member.role) {
                  e.target.select();
                }
              }}
            />
            {member && formData.role === member.role && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Current</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: '' }))}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Clear field"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            )}
            {member && isFieldModified('role') && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Modified</span>
              </div>
            )}
          </div>
          {errors.role && <p className="text-sm text-red-600 flex items-center mt-1">
            <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
            {errors.role}
          </p>}
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-black">
            Profile Photo *
          </label>
          <ImageUpload
            currentImage={formData.image}
            onImageChange={handleImageChange}
            folder="team-members"
            className={errors.image ? 'border-red-500' : ''}
          />
          {errors.image && <p className="text-sm text-red-600 flex items-center mt-1">
            <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
            {errors.image}
          </p>}
        </div>

        {/* Bio Field */}
        <div className="space-y-2">
          <label htmlFor="bio" className="block text-sm font-semibold text-black">
            Bio/Description *
          </label>
          <div className="relative">
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className={`w-full text-base text-black resize-none pr-20 ${errors.bio ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : isFieldModified('bio') ? 'border-orange-400 focus:border-orange-500 focus:ring-orange-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
              rows={4}
              disabled={isSubmitting}
              placeholder={member ? `Current bio: ${member.bio.substring(0, 50)}${member.bio.length > 50 ? '...' : ''}` : "Write a brief description about this team member..."}
              onFocus={(e) => {
                if (member && e.target.value === member.bio) {
                  e.target.select();
                }
              }}
            />
            {member && formData.bio === member.bio && (
              <div className="absolute top-3 right-3 flex items-center space-x-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Current</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, bio: '' }))}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Clear field"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            )}
            {member && isFieldModified('bio') && (
              <div className="absolute top-3 right-3">
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Modified</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center text-sm">
            {errors.bio ? (
              <p className="text-red-600 flex items-center">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {errors.bio}
              </p>
            ) : (
              <p className="text-gray-600">Brief description of the team member</p>
            )}
            <p className="text-gray-600">{formData.bio.length}/500</p>
          </div>
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
            className="flex items-center space-x-2 h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{member ? 'Update Member' : 'Add Member'}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}