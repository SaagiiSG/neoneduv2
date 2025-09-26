'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import SidebarLayout from '@/components/admin/SidebarLayout';
import StudyAbroadCard from '@/components/admin/StudyAbroadCard';
import StudyAbroadForm from '@/components/admin/StudyAbroadForm';

interface StudyAbroadProgram {
  id: string;
  program_name: string;
  country: string;
  description: string;
  link: string;
  created_at: string;
  updated_at: string;
}

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
      dotbg: imageInfo.dotbg
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
          <div className="flex items-center space-x-3">
            <Globe className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Study Abroad Programs</h1>
              <p className="text-gray-600">Manage your study abroad destinations and programs</p>
            </div>
          </div>
          <button
            onClick={handleAddProgram}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Program</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Programs</p>
                <p className="text-2xl font-bold text-gray-900">{programs.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">A</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Countries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(programs.map(p => p.country)).size}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Programs</p>
                <p className="text-2xl font-bold text-gray-900">{programs.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-[516px] bg-gray-300"></div>
              </div>
            ))}
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No study abroad programs</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first study abroad program.</p>
            <div className="mt-6">
              <button
                onClick={handleAddProgram}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Program
              </button>
            </div>
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