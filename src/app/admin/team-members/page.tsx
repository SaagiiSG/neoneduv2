'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import SidebarLayout from '@/components/admin/SidebarLayout';
import { TeamMemberCard } from '@/components/admin/PreviewCards';
import TeamMemberForm from '@/components/admin/TeamMemberForm';
import { authenticatedApiCall } from '@/lib/apiClient';
import { TeamMember } from '@/lib/types';


export default function TeamMembersPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const fetchTeamMembers = async () => {
    try {
      const data = await authenticatedApiCall('/api/team-members') as {success: boolean, data: TeamMember[], error?: string};
      if (data.success) {
        setTeamMembers(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch team members');
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleAddMember = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) {
      return;
    }

    try {
      await authenticatedApiCall(`/api/team-members/${id}`, {
        method: 'DELETE',
      });
      
      toast.success('Team member deleted successfully');
      fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
    }
  };

  const handleFormSubmit = async (formData: TeamMember) => {
    try {
      const url = editingMember ? `/api/team-members/${editingMember.id}` : '/api/team-members';
      const method = editingMember ? 'PUT' : 'POST';

      await authenticatedApiCall(url, {
        method,
        body: JSON.stringify(formData),
      });

      toast.success(editingMember ? 'Team member updated successfully' : 'Team member added successfully');
      setShowForm(false);
      setEditingMember(null);
      fetchTeamMembers();
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error('Failed to save team member');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  if (showForm) {
    return (
      <SidebarLayout>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
              <h2 className="text-2xl font-bold text-black">
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
              <p className="text-gray-600 mt-1">
                {editingMember ? 'Update team member information' : 'Add a new team member to your organization'}
              </p>
              </div>
            </div>
            <TeamMemberForm
              member={editingMember}
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
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-black">Team Members</h1>
              <p className="text-gray-600 mt-1">Manage your team members and their information</p>
            </div>
          </div>
          <button
            onClick={handleAddMember}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Add Member</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-black">{teamMembers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                <span className="text-white font-bold text-sm">CEO</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Leadership</p>
                <p className="text-2xl font-bold text-black">
                  {teamMembers.filter(m => m.role.toLowerCase().includes('ceo') || m.role.toLowerCase().includes('founder')).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Teachers</p>
                <p className="text-2xl font-bold text-black">
                  {teamMembers.filter(m => m.role.toLowerCase().includes('teacher')).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300"></div>
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
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">No team members yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Start building your team by adding your first team member. Showcase their expertise and build trust with your audience.</p>
            <button
              onClick={handleAddMember}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Team Member
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                onEdit={() => handleEditMember(member)}
                onDelete={() => handleDeleteMember(member.id!)}
              />
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}