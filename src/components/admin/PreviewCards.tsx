'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';
import { TeamMember, Course, StudyAbroadProgram } from '@/lib/types';

// Team Member Preview Card
export function TeamMemberCard({ member, onEdit, onDelete }: {
  member: TeamMember;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={member.image || '/placeholder-team.png'}
          alt={member.name}
          width={300}
          height={224}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={onEdit}
            className="p-2.5 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 shadow-lg"
            title="Edit member"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2.5 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white hover:text-red-600 transition-all duration-200 shadow-lg"
            title="Delete member"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-xl text-black leading-tight">{member.name}</h3>
            <div className="mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {member.role}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            {member.ditem1 && (
              <p className="text-gray-600 text-sm leading-relaxed">
                • {member.ditem1}
              </p>
            )}
            {member.ditem2 && (
              <p className="text-gray-600 text-sm leading-relaxed">
                • {member.ditem2}
              </p>
            )}
            {member.ditem3 && (
              <p className="text-gray-600 text-sm leading-relaxed">
                • {member.ditem3}
              </p>
            )}
            {member.bio && (
              <p className="text-gray-500 text-xs leading-relaxed italic mt-2">
                {member.bio}
              </p>
            )}
            {!member.ditem1 && !member.ditem2 && !member.ditem3 && !member.bio && (
              <p className="text-gray-400 text-sm italic">No description available</p>
            )}
          </div>
        </div>
        
        {/* Bottom Border Accent */}
        <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}

// Course Preview Card
export function CourseCard({ course, onEdit, onDelete }: {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        <Image
          src={course.image || '/placeholder-course.png'}
          alt={course.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={onEdit}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900">{course.title}</h3>
        <p className="text-green-600 font-medium">{course.category}</p>
        <p className="text-gray-600 text-sm mt-2 line-clamp-3">{course.description}</p>
        {course.link && (
          <a 
            href={course.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 text-sm hover:underline mt-2 inline-block"
          >
            View Course →
          </a>
        )}
      </div>
    </motion.div>
  );
}

// Study Abroad Preview Card
export function StudyAbroadCard({ program, onEdit, onDelete }: {
  program: StudyAbroadProgram;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
    >
      <div className="relative">
        <Image
          src={program.image || '/placeholder-country.png'}
          alt={program.country}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={onEdit}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="font-bold text-xl">{program.country}</h3>
          <p className="text-sm opacity-90">{program.program_name}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm line-clamp-3">{program.description}</p>
        {program.link && (
          <a 
            href={program.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 text-sm hover:underline mt-2 inline-block"
          >
            Learn More →
          </a>
        )}
      </div>
    </motion.div>
  );
}



