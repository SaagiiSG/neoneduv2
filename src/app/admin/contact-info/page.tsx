'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Plus, Edit, Trash2, ArrowLeft, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { contactInfoAPI } from '@/lib/api';

interface ContactInfo {
  id: string;
  address: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
  contact_info_socials: Array<{
    id: string;
    platform: string;
    url: string;
  }>;
}

export default function ContactInfoPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showSocialForm, setShowSocialForm] = useState(false);
  const [newSocial, setNewSocial] = useState({ platform: '', url: '' });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await contactInfoAPI.get();
      setContactInfo(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch contact info');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleUpdate = async (data: Partial<ContactInfo>) => {
    try {
      const response = await contactInfoAPI.update(data);
      setContactInfo(response.data.data);
      toast.success('Contact info updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update contact info');
    }
  };

  const handleAddSocial = async () => {
    try {
      await contactInfoAPI.addSocial(newSocial);
      toast.success('Social media link added successfully');
      setNewSocial({ platform: '', url: '' });
      setShowSocialForm(false);
      fetchContactInfo();
    } catch (error) {
      toast.error('Failed to add social media link');
    }
  };

  const handleRemoveSocial = async (socialId: string) => {
    if (!confirm('Are you sure you want to remove this social media link?')) return;

    try {
      await contactInfoAPI.removeSocial(socialId);
      toast.success('Social media link removed successfully');
      fetchContactInfo();
    } catch (error) {
      toast.error('Failed to remove social media link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading contact info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Contact Information</h1>
          </div>
          <p className="text-gray-600">Manage your company contact details and social media links</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Contact Details</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editing ? (
              <ContactEditForm
                contactInfo={contactInfo}
                onSave={handleUpdate}
                onCancel={() => setEditing(false)}
              />
            ) : (
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{contactInfo?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(contactInfo?.email || '', 'Email')}
                    className="p-2 text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    {copiedField === 'Email' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{contactInfo?.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(contactInfo?.phone || '', 'Phone')}
                    className="p-2 text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    {copiedField === 'Phone' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                {/* Address */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">{contactInfo?.address}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(contactInfo?.address || '', 'Address')}
                    className="p-2 text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    {copiedField === 'Address' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Social Media</h2>
              <button
                onClick={() => setShowSocialForm(!showSocialForm)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Link
              </button>
            </div>

            {showSocialForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Platform (e.g., Facebook, Instagram)"
                    value={newSocial.platform}
                    onChange={(e) => setNewSocial(prev => ({ ...prev, platform: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    value={newSocial.url}
                    onChange={(e) => setNewSocial(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddSocial}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowSocialForm(false)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {contactInfo?.contact_info_socials?.map((social) => (
                <div key={social.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-medium text-sm">
                        {social.platform.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{social.platform}</p>
                      <p className="text-sm text-gray-600 truncate max-w-xs">{social.url}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveSocial(social.id)}
                    className="p-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {!contactInfo?.contact_info_socials?.length && (
                <div className="text-center py-8 text-gray-500">
                  <p>No social media links added yet</p>
                  <button
                    onClick={() => setShowSocialForm(true)}
                    className="mt-2 text-orange-600 hover:text-orange-700"
                  >
                    Add your first social media link
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Contact Edit Form Component
function ContactEditForm({ contactInfo, onSave, onCancel }: {
  contactInfo: ContactInfo | null;
  onSave: (data: Partial<ContactInfo>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    email: contactInfo?.email || '',
    phone: contactInfo?.phone || '',
    address: contactInfo?.address || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows={3}
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

