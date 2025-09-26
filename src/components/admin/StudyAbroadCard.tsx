'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';

interface StudyAbroadCardProps {
  country: {
    id: string;
    country: string;
    description: string;
    universities: string;
    image: string;
    dotbg: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export default function StudyAbroadCard({ country, onEdit, onDelete }: StudyAbroadCardProps) {
  const [showControls, setShowControls] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative group cursor-pointer"
      style={{ width: '400px', height: '516px' }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Main Card Content - Exact copy from page.tsx */}
      <div className="w-full h-full flex flex-col justify-center relative z-10 pl-10 overflow-hidden">
        <div className="w-full flex flex-col items-start justify-start relative overflow-hidden px-5 pb-8 z-50 border-l-2 border-[#dbdbdb]">
          <h2 className="text-[32px] font-clash font-medium text-[#FFFFFF]/90 tracking-[0%] mb-9">
            {country.country}
          </h2>
          <h1 className="w-full max-w-[400px] text-[32px] font-montserrat font-medium text-[#FFFFFF] tracking-[0%] leading-tight">
            {country.description}
          </h1>
          <p className="text-[24px] font-montserrat font-regular text-[#FFFFFF] tracking-[0%] mt-6 leading-relaxed">
            {country.universities}
          </p>
        </div>
        
        {/* Background overlay */}
        <div className="w-full h-full absolute bg-black/45 left-0 top-0 z-20"></div>
        
        {/* Background image */}
        <img 
          src={country.image} 
          alt={country.country} 
          className="absolute top-0 left-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        
        {/* Dots background */}
        <img 
          src={country.dotbg} 
          alt="" 
          className="absolute top-8 -right-14 w-full h-full z-30"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Admin Controls Overlay */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-4 right-4 z-50 flex space-x-2"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
            title="Edit country"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
            title="Delete country"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}


