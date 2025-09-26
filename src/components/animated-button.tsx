'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface AnimatedButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const AnimatedButton = ({ children, className = '', onClick }: AnimatedButtonProps) => {
  return (
    <motion.button
      className={`flex items-center gap-2 rounded-full bg-transparent text-[#616161] border border-[#616161] hover:bg-transparent px-4 py-2 ${className}`}
      style={{ 
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
      onClick={onClick}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="flex items-center gap-2"
        whileHover={{ 
          x: 4,
          transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
        }}
      >
        <span>{children}</span>
        <motion.div
          whileHover={{ 
            x: -4,
            transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
          }}
        >
          <ArrowRight className='w-4 h-4' />
        </motion.div>
      </motion.div>
    </motion.button>
  )
}

export default AnimatedButton
