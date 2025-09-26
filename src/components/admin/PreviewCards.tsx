'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';

// Team Member Preview Card
export function TeamMemberCard({ member, onEdit, onDelete }: {
  member: any;
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
          src={member.image || '/placeholder-team.png'}
          alt={member.name}
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
        <h3 className="font-semibold text-lg text-gray-900">{member.name}</h3>
        <p className="text-blue-600 font-medium">{member.role}</p>
        <p className="text-gray-600 text-sm mt-2 line-clamp-3">{member.bio}</p>
      </div>
    </motion.div>
  );
}

// Course Preview Card
export function CourseCard({ course, onEdit, onDelete }: {
  course: any;
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
  program: any;
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

// Contact Info Preview Card
export function ContactInfoCard({ contactInfo, onEdit }: {
  contactInfo: any;
  onEdit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
        <button
          onClick={onEdit}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          <Edit className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-3">
        {contactInfo?.address && (
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-gray-700">{contactInfo.address}</span>
          </div>
        )}
        
        {contactInfo?.phone && (
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-gray-700">{contactInfo.phone}</span>
          </div>
        )}
        
        {contactInfo?.email && (
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-gray-700">{contactInfo.email}</span>
          </div>
        )}
        
        {contactInfo?.contact_info_socials && contactInfo.contact_info_socials.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-gray-900 mb-2">Social Media</h4>
            <div className="space-y-2">
              {contactInfo.contact_info_socials.map((social: any, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <a 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {social.platform}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}


