'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('top')
    const [isScrolling, setIsScrolling] = useState(false)

    const navItems = [
        {
            label: 'Home',
            href: '#',
            scrollTo: 'top'
        },
        {
            label: 'About',
            href: '#about',
            scrollTo: 'about'
        },
        {
            label: 'Our Team',
            href: '#ourteam',
            scrollTo: 'ourteam'
        },
        {
            label: 'Courses',
            href: '#courses',
            scrollTo: 'courses'
        },
        {
            label: 'Study Abroad',
            href: '#studyabroad',
            scrollTo: 'studyabroad'
        },
        {
            label: 'Contact',
            href: '#contact',
            scrollTo: 'contact'
        }
    ]

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    const handleNavClick = async (e: React.MouseEvent<HTMLAnchorElement>, scrollTo: string) => {
        e.preventDefault()
        closeMenu()
        
        setIsScrolling(true)
        
        try {
            if (scrollTo === 'top') {
                // Find the scrollable container (the main page div with overflow-y-auto)
                const scrollContainer = document.querySelector('.overflow-y-auto') as HTMLElement
                if (scrollContainer) {
                    await smoothScrollTo(scrollContainer, 0)
                } else {
                    await smoothScrollTo(window, 0)
                }
            } else {
                // For services, try both mobile and desktop versions
                const elementIds = scrollTo === 'services' ? ['services', 'services-desktop'] : [scrollTo]
                
                for (const elementId of elementIds) {
                    const element = document.getElementById(elementId)
                    if (element) {
                        await smoothScrollToElement(element)
                        break
                    }
                }
            }
        } finally {
            setTimeout(() => {
                setIsScrolling(false)
            }, 500)
        }
    }

    // Smooth scroll helper functions
    const smoothScrollTo = (element: HTMLElement | Window, targetY: number): Promise<void> => {
        return new Promise((resolve) => {
            const startY = 'scrollTop' in element ? element.scrollTop : element.scrollY
            const distance = targetY - startY
            const duration = Math.min(Math.abs(distance) / 2, 1000) // Max 1 second, slower for mobile
            let startTime: number | null = null

            const animation = (currentTime: number) => {
                if (startTime === null) startTime = currentTime
                const timeElapsed = currentTime - startTime
                const progress = Math.min(timeElapsed / duration, 1)
                
                // Easing function for smoother animation
                const ease = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2

                const currentY = startY + distance * ease
                
                if ('scrollTop' in element) {
                    element.scrollTop = currentY
                } else {
                    element.scrollTo(0, currentY)
                }

                if (progress < 1) {
                    requestAnimationFrame(animation)
                } else {
                    resolve()
                }
            }

            requestAnimationFrame(animation)
        })
    }

    const smoothScrollToElement = (element: HTMLElement): Promise<void> => {
        return new Promise((resolve) => {
            const scrollContainer = document.querySelector('.overflow-y-auto') as HTMLElement
            const container = scrollContainer || window
            const targetY = element.offsetTop - 100 // Offset for navbar
            
            if ('scrollTop' in container) {
                smoothScrollTo(container, targetY).then(resolve)
            } else {
                smoothScrollTo(container, targetY).then(resolve)
            }
        })
    }

    // Scroll spy effect with throttling for better performance
    useEffect(() => {
        let ticking = false
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const sections = ['services', 'courses', 'about', 'ourteam', 'studyabroad', 'contact']
                    // Get scroll position from the scrollable container
                    const scrollContainer = document.querySelector('.overflow-y-auto') as HTMLElement
                    const scrollPosition = scrollContainer ? scrollContainer.scrollTop + 150 : window.scrollY + 150

                    // Check if we're at the top
                    if (scrollPosition < 300) {
                        setActiveSection('top')
                        ticking = false
                        return
                    }

                    // Find the current section
                    let currentSection = 'top'
                    for (const section of sections) {
                        // For services, check both mobile and desktop versions
                        const elementIds = section === 'services' ? ['services', 'services-desktop'] : [section]
                        
                        for (const elementId of elementIds) {
                            const element = document.getElementById(elementId)
                            if (element) {
                                const elementTop = element.offsetTop
                                const elementBottom = elementTop + element.offsetHeight
                                
                                if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
                                    currentSection = section
                                    break
                                }
                            }
                        }
                        if (currentSection !== 'top') break
                    }
                    
                    setActiveSection(currentSection)
                    ticking = false
                })
                ticking = true
            }
        }

        // Initial call to set active section
        handleScroll()
        
        // Listen to the scrollable container with throttling
        const scrollContainer = document.querySelector('.overflow-y-auto') as HTMLElement
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
            return () => scrollContainer.removeEventListener('scroll', handleScroll)
        } else {
            window.addEventListener('scroll', handleScroll, { passive: true })
            return () => window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <nav className='flex justify-between border-b-2 border-[#929292] items-center p-3 px-8 md:p-4 md:px-12 lg:px-16 absolute top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm'>
            <div>
                <a 
                    href="#" 
                    onClick={(e) => !isScrolling && handleNavClick(e, 'top')}
                    className={`transition-opacity duration-200 ${isScrolling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <Image 
                        src="/Neon Edu Logo.png" 
                        alt="logo" 
                        width={50} 
                        height={50}
                        className="w-[40px] h-[40px] md:w-[45px] md:h-[45px] lg:w-[50px] lg:h-[50px]"
                    />
                </a>
            </div>
            
            {/* Desktop Menu */}
            <div className='hidden md:flex gap-4 md:gap-5 lg:gap-6 h-[18px] md:h-[20px]'>
                {navItems.map((item) => {
                    const isActive = activeSection === item.scrollTo
                    const isDisabled = isScrolling
                    
                    return (
                        <a 
                            key={item.href} 
                            href={item.href} 
                            onClick={(e) => !isDisabled && handleNavClick(e, item.scrollTo)}
                            className={`h-[18px] md:h-[20px] font-montserrat text-[14px] md:text-[15px] lg:text-[16px] font-medium flex flex-col items-start justify-start overflow-hidden group transition-opacity duration-200 ${
                                isActive ? 'text-[#FF872F]' : 'text-[#2c2c2c]'
                            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <p className={`group-hover:-translate-y-[24px] duration-300 ease-in ${isActive ? 'text-[#FF872F]' : ''}`}>
                                {item.label}
                            </p>
                            <p className='group-hover:-translate-y-[24px] duration-300 ease-out text-[#FF872F]'>
                                {item.label}
                            </p>
                        </a>
                    )
                })}
            </div>

            {/* Mobile Burger Menu Button */}
            <div className='md:hidden'>
                <button
                    onClick={toggleMenu}
                    className='flex flex-col justify-center items-center w-8 h-8 sm:w-9 sm:h-9 space-y-1 sm:space-y-1.5 z-50 relative touch-manipulation'
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                    <motion.span 
                        className='block w-6 h-0.5 sm:w-7 sm:h-0.5 bg-[#2c2c2c]'
                        animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.3, ease: "linear" }}
                    ></motion.span>
                    <motion.span 
                        className='block w-6 h-0.5 sm:w-7 sm:h-0.5 bg-[#2c2c2c]'
                        animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                        transition={{ duration: 0.3, ease: "linear" }}
                    ></motion.span>
                    <motion.span 
                        className='block w-6 h-0.5 sm:w-7 sm:h-0.5 bg-[#2c2c2c]'
                        animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                        transition={{ duration: 0.3, ease: "linear" }}
                    ></motion.span>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        className="fixed inset-0 z-40 md:hidden  "
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "linear" }}
                        onClick={closeMenu}
                    >
                        {/* Menu Panel */}
                        <motion.div 
                            className="absolute top-0 right-0 w-1/2 sm:w-2/5 md:w-1/3 bg-white/70 backdrop-blur-3xl shadow-2xl border-2 border-white/80 rounded-bl-4xl"
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            transition={{ 
                                duration: 0.6, 
                                ease: [0.25, 0.46, 0.45, 0.94],
                                type: "spring",
                                stiffness: 100,
                                damping: 15,
                                delay: isMenuOpen ? 0 : 0.5 // Delay container exit until items are gone
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className='flex flex-col items-center pt-16 sm:pt-20 py-4 pb-6 sm:pb-8 space-y-4 sm:space-y-6'>
                                {navItems.map((item, index) => (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ 
                                            opacity: 0, 
                                            y: -20, 
                                            scale: 0.9,
                                            transition: {
                                                duration: 0.3,
                                                ease: [0.25, 0.46, 0.45, 0.94],
                                                delay: (navItems.length - 1 - index) * 0.1 // Reverse stagger for closing
                                            }
                                        }}
                                        transition={{ 
                                            duration: 0.5, 
                                            ease: [0.25, 0.46, 0.45, 0.94],
                                            delay: index * 0.1,
                                            type: "spring",
                                            stiffness: 200,
                                            damping: 20
                                        }}
                                        className="text-center"
                                    >
                                        <a 
                                            href={item.href} 
                                            onClick={(e) => !isScrolling && handleNavClick(e, item.scrollTo)}
                                            className={`font-montserrat text-[16px] sm:text-[18px] font-medium hover:text-[#FF872F] transition-all duration-300 ease-linear block ${
                                                activeSection === item.scrollTo ? 'text-[#FF872F]' : 'text-[#2c2c2c]'
                                            } ${isScrolling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} touch-manipulation`}
                                        >
                                            {item.label}
                                        </a>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar

