'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import SidebarLayout from '@/components/admin/SidebarLayout';
import StudyAbroadCard from '@/components/admin/StudyAbroadCard';
import StudyAbroadForm from '@/components/admin/StudyAbroadForm';
import { StudyAbroadProgram } from '@/lib/types';

export default function StudyAbroadPage() {
  const [programs, setPrograms] = useState<StudyAbroadProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<StudyAbroadProgram | null>(null);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/study-abroad');
      const data = await response.json();
      if (data.success) {
        setPrograms(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch study abroad programs');
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error('Failed to fetch study abroad programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleAddProgram = () => {
    setEditingProgram(null);
    setShowForm(true);
  };

  const handleEditProgram = (program: StudyAbroadProgram) => {
    setEditingProgram(program);
    setShowForm(true);
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm('Are you sure you want to delete this study abroad program?')) {
      return;
    }

    try {
      const response = await fetch(`/api/study-abroad/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Study abroad program deleted successfully');
        fetchPrograms();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete study abroad program');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('Failed to delete study abroad program');
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const url = editingProgram ? `/api/study-abroad/${editingProgram.id}` : '/api/study-abroad';
      const method = editingProgram ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingProgram ? 'Study abroad program updated successfully' : 'Study abroad program added successfully');
        setShowForm(false);
        setEditingProgram(null);
        fetchPrograms();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save study abroad program');
      }
    } catch (error) {
      console.error('Error saving program:', error);
      toast.error('Failed to save study abroad program');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProgram(null);
  };

  // Transform programs for display
  const transformedPrograms = programs.map(program => {
    // Split description into main description and universities
    let description = program.description;
    let universities = '';
    
    if (description.includes('|')) {
      const parts = description.split('|');
      description = parts[0].trim();
      universities = parts[1].trim();
    }

    // Map country names to correct image paths
    const countryImageMap: {[key: string]: {image: string, dotbg: string}} = {
      'Australia': {
        image: '/Australia Background.svg',
        dotbg: '/australiaDots.svg'
      },
      'Singapore': {
        image: '/Neon Edu v3 (2)/singapiore.svg',
        dotbg: '/singapore dots.svg'
      },
      'South Korea': {
        image: '/Neon Edu v3 (2)/korea.svg',
        dotbg: '/korea dots.svg'
      },
      'Malaysia': {
        image: '/Neon Edu v3 (2)/malas.svg',
        dotbg: '/malas dots.svg'
      },
      'China': {
        image: '/Neon Edu v3 (2)/china.svg',
        dotbg: '/china dots.svg'
      },
      'Hungary': {
        image: '/Neon Edu v3 (2)/hungray.svg',
        dotbg: '/hungary dots.svg'
      }
    };

    const imageInfo = countryImageMap[program.country] || {
      image: '/Neon Edu v3 (2)/china.svg',
      dotbg: '/china dots.svg'
    };

    return {
      id: program.id,
      country: program.country,
      description: description || 'Study opportunities available',
      universities: universities || 'Contact us for more information',
      image: imageInfo.image,
      dotbg: imageInfo.dotbg,
      uploadedImage: program.image
    };
  });

  if (showForm) {
    return (
      <SidebarLayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <StudyAbroadForm
              program={editingProgram}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">Study Abroad Programs</h1>
              <p className="text-gray-600 mt-1">Manage your study abroad destinations and programs</p>
            </div>
          </div>
          <button
            onClick={handleAddProgram}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Add Program</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Programs</p>
                <p className="text-2xl font-bold text-black">{programs.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Countries</p>
                <p className="text-2xl font-bold text-black">
                  {new Set(programs.map(p => p.country)).size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Programs</p>
                <p className="text-2xl font-bold text-black">{programs.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-[516px] bg-gradient-to-br from-gray-200 to-gray-300"></div>
              </div>
            ))}
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <Globe className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">No study abroad programs yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Start building your study abroad portfolio by adding your first program. Showcase international opportunities to students.</p>
            <button
              onClick={handleAddProgram}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Program
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {transformedPrograms.map((program) => (
              <StudyAbroadCard
                key={program.id}
                country={program}
                onEdit={() => handleEditProgram(programs.find(p => p.id === program.id)!)}
                onDelete={() => handleDeleteProgram(program.id)}
              />
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}