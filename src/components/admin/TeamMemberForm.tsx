'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from './ImageUpload';

import { TeamMember } from '@/lib/types';

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
    ditem1: member?.ditem1 || '',
    ditem2: member?.ditem2 || '',
    ditem3: member?.ditem3 || '',
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
    
    // At least one description item is required
    if (!formData.bio.trim() && !formData.ditem1.trim() && !formData.ditem2.trim() && !formData.ditem3.trim()) {
      newErrors.bio = 'At least one description item is required';
    }
    
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }
    
    if (formData.ditem1 && formData.ditem1.length > 200) {
      newErrors.ditem1 = 'Description item 1 must be less than 200 characters';
    }
    
    if (formData.ditem2 && formData.ditem2.length > 200) {
      newErrors.ditem2 = 'Description item 2 must be less than 200 characters';
    }
    
    if (formData.ditem3 && formData.ditem3.length > 200) {
      newErrors.ditem3 = 'Description item 3 must be less than 200 characters';
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

        {/* Description Items */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-black">
              Description Items *
            </label>
            <p className="text-xs text-gray-500">Add up to 3 key points about this team member</p>
          </div>
          
          {/* Description Item 1 */}
          <div className="space-y-2">
            <label htmlFor="ditem1" className="block text-sm font-medium text-gray-700">
              Item 1 (e.g., Education)
            </label>
            <div className="relative">
              <Input
                id="ditem1"
                name="ditem1"
                type="text"
                value={formData.ditem1}
                onChange={handleInputChange}
                className={`w-full h-12 text-base text-black pr-10 ${errors.ditem1 ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : isFieldModified('ditem1') ? 'border-orange-400 focus:border-orange-500 focus:ring-orange-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                disabled={isSubmitting}
                placeholder={member ? `Current: ${member.ditem1?.substring(0, 30)}${(member.ditem1?.length ?? 0) > 30 ? '...' : ''}` : "e.g., PhD in Educational Leadership (2020), Monash University, Australia"}
                onFocus={(e) => {
                  if (member && e.target.value === member.ditem1) {
                    e.target.select();
                  }
                }}
              />
              {member && formData.ditem1 === member.ditem1 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Current</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, ditem1: '' }))}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Clear field"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}
              {member && isFieldModified('ditem1') && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Modified</span>
                </div>
              )}
            </div>
            {errors.ditem1 && <p className="text-sm text-red-600 flex items-center mt-1">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {errors.ditem1}
            </p>}
          </div>

          {/* Description Item 2 */}
          <div className="space-y-2">
            <label htmlFor="ditem2" className="block text-sm font-medium text-gray-700">
              Item 2 (e.g., Additional Education)
            </label>
            <div className="relative">
              <Input
                id="ditem2"
                name="ditem2"
                type="text"
                value={formData.ditem2}
                onChange={handleInputChange}
                className={`w-full h-12 text-base text-black pr-10 ${errors.ditem2 ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : isFieldModified('ditem2') ? 'border-orange-400 focus:border-orange-500 focus:ring-orange-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                disabled={isSubmitting}
                placeholder={member ? `Current: ${member.ditem2?.substring(0, 30)}${(member.ditem2?.length ?? 0) > 30 ? '...' : ''}` : "e.g., iMBA in International Business (2014), National Taiwan University"}
                onFocus={(e) => {
                  if (member && e.target.value === member.ditem2) {
                    e.target.select();
                  }
                }}
              />
              {member && formData.ditem2 === member.ditem2 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Current</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, ditem2: '' }))}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Clear field"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}
              {member && isFieldModified('ditem2') && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Modified</span>
                </div>
              )}
            </div>
            {errors.ditem2 && <p className="text-sm text-red-600 flex items-center mt-1">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {errors.ditem2}
            </p>}
          </div>

          {/* Description Item 3 */}
          <div className="space-y-2">
            <label htmlFor="ditem3" className="block text-sm font-medium text-gray-700">
              Item 3 (e.g., Previous Education)
            </label>
            <div className="relative">
              <Input
                id="ditem3"
                name="ditem3"
                type="text"
                value={formData.ditem3}
                onChange={handleInputChange}
                className={`w-full h-12 text-base text-black pr-10 ${errors.ditem3 ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : isFieldModified('ditem3') ? 'border-orange-400 focus:border-orange-500 focus:ring-orange-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                disabled={isSubmitting}
                placeholder={member ? `Current: ${member.ditem3?.substring(0, 30)}${(member.ditem3?.length ?? 0) > 30 ? '...' : ''}` : "e.g., MA (2009) and BS (2008), University of the Humanities, Mongolia"}
                onFocus={(e) => {
                  if (member && e.target.value === member.ditem3) {
                    e.target.select();
                  }
                }}
              />
              {member && formData.ditem3 === member.ditem3 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Current</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, ditem3: '' }))}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Clear field"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}
              {member && isFieldModified('ditem3') && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Modified</span>
                </div>
              )}
            </div>
            {errors.ditem3 && <p className="text-sm text-red-600 flex items-center mt-1">
              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {errors.ditem3}
            </p>}
          </div>

          {/* Legacy Bio Field (Optional) */}
        <div className="space-y-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Additional Bio (Optional)
          </label>
          <div className="relative">
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className={`w-full text-base text-black resize-none pr-20 ${errors.bio ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : isFieldModified('bio') ? 'border-orange-400 focus:border-orange-500 focus:ring-orange-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                rows={3}
              disabled={isSubmitting}
                placeholder={member ? `Current bio: ${member.bio?.substring(0, 50)}${(member.bio?.length ?? 0) > 50 ? '...' : ''}` : "Additional information about this team member..."}
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
                <p className="text-gray-600">Additional information (optional)</p>
            )}
            <p className="text-gray-600">{formData.bio.length}/500</p>
            </div>
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