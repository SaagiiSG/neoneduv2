'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Navbar from '@/components/navbar'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, MapPin, Clock } from 'lucide-react'
import { ChevronRight, GraduationCap, Phone, Mail, Facebook, Instagram, ArrowUpRight, Copy, Send, Check} from 'lucide-react'
import Teamcard from '@/components/Teamcard'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { 
  getTeamMembers, 
  getCourses, 
  getStudyAbroadPrograms,
  getHistoryData,
  transformTeamData,
  transformCourseData,
  transformStudyAbroadData
} from '@/lib/data'
import { TeamMember, Course, StudyAbroadProgram, HistoryItem } from '@/lib/types';
import { sendContactEmail } from '@/lib/emailServiceEmailJS'
import { SupabaseProvider } from '@/contexts/SupabaseContext'
import { heroImageUrls, fallbackImageUrls } from '@/lib/imageOptimization'


export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: ''
  })
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)
  const shouldReduceMotion = useReducedMotion()
  
  // Database data state
  const [teamData, setTeamData] = useState<TeamMember[]>([])
  const [courseData, setCourseData] = useState<Course[]>([])
  const [studyAbroadData, setStudyAbroadData] = useState<StudyAbroadProgram[]>([])
  const [historyData, setHistoryData] = useState<HistoryItem[]>([])
  
  // Fetch data from database on component mount - optimized for main page
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Add timeout to prevent hanging on database calls
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 8000) // Reduced timeout for main page
        );

        const dataPromise = Promise.all([
          getTeamMembers(),
          getCourses(),
          getStudyAbroadPrograms(),
          getHistoryData()
        ]);

        const result = await Promise.race([
          dataPromise,
          timeoutPromise
        ]) as [any[], any[], any[], any[]];
        
        const [teamMembers, courses, studyAbroad, history] = result;

        console.log('Raw team data:', teamMembers);
        console.log('Raw course data:', courses);
        
        const transformedTeam = transformTeamData(teamMembers);
        const transformedCourses = transformCourseData(courses);
        
        console.log('Transformed team data:', transformedTeam);
        console.log('Transformed course data:', transformedCourses);
        
        setTeamData(transformedTeam);
        setCourseData(transformedCourses);
        setStudyAbroadData(transformStudyAbroadData(studyAbroad));
        setHistoryData(history || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to empty arrays if database fetch fails
        setTeamData([]);
        setCourseData([]);
        setStudyAbroadData([]);
        setHistoryData([]);
      }
    };

    // Only fetch data if not in admin route
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin')) {
      fetchData();
    }
  }, []);

  const images = useMemo(() => [
    heroImageUrls.neonEduV3,
    heroImageUrls.image4, 
    heroImageUrls.neonEduV3Alt,
    heroImageUrls.neonEduImage
  ], [])

  const timelineData = [
    {
      year: "2015",
      description: "Founded in Ulaanbaatar, Mongolia"
    },
    {
      year: "2017", 
      description: "Began sending students to Australia"
    },
    {
      year: "2022",
      description: "Launched English language teaching programs"
    },
    {
      year: "2023",
      description: "Expanded student placements to Canada and the USA"
    },
    {
      year: "2025",
      description: "Added study destination in China, South Korea, Singapore, Malaysia, and Hungary, and introduced Chinese language teaching"
    }
  ]


  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required'
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
    if (!formData.phone.trim()) errors.phone = 'Phone number is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    if (!formData.message.trim()) errors.message = 'Message is required'
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      try {
        const result = await sendContactEmail(formData)

        if (result.success) {
          alert('Message sent successfully! We will get back to you soon.')
          // Reset form
          setFormData({
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            message: ''
          })
          // Clear any form errors
          setFormErrors({})
        } else {
          alert(`Error: ${result.error || 'Failed to send message'}`)
        }
      } catch (err) {
        console.error('Form submission error:', err)
        alert('Failed to send message. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Copy to clipboard function
  const copyToClipboard = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email)
      setCopiedEmail(email)
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedEmail(null)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy email: ', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = email
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
        setCopiedEmail(email)
        setTimeout(() => {
          setCopiedEmail(null)
        }, 2000)
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr)
      }
      document.body.removeChild(textArea)
    }
  }

  // Scroll functions
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const scrollToServices = () => {
    const element = document.getElementById('services') || document.getElementById('services-desktop')
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // Preload critical images function
  const preloadImages = useCallback(async () => {
    // Only preload essential images, not all database images
    const criticalImages = [
      // Hero carousel images
      ...images,
      // Logo and main assets
      "/Neon Edu Logo.png",
      heroImageUrls.australiaHero,
      "/ourServiceBgDots.svg",
      "/our focus bg.svg"
    ]

    let loadedCount = 0
    const totalImages = criticalImages.length

    const imagePromises = criticalImages.map((src) => {
      return new Promise((resolve) => {
        const img = new window.Image()
        
        // Add timeout to prevent hanging
        const timeout = setTimeout(() => {
          loadedCount++
          setLoadingProgress(Math.round((loadedCount / totalImages) * 100))
          resolve(false)
        }, 5000) // 5 second timeout per image
        
        img.onload = () => {
          clearTimeout(timeout)
          loadedCount++
          setLoadingProgress(Math.round((loadedCount / totalImages) * 100))
          resolve(true)
        }
        img.onerror = () => {
          clearTimeout(timeout)
          loadedCount++
          setLoadingProgress(Math.round((loadedCount / totalImages) * 100))
          resolve(false)
        }
        img.src = src
      })
    })

    try {
      await Promise.all(imagePromises)
      setLoadingProgress(100)
      console.log('Critical images preloaded successfully')
    } catch (error) {
      console.warn('Some critical images failed to preload:', error)
      setLoadingProgress(100) // Force completion even if some images fail
    }
  }, [images])

  // Loading and auto-play functionality
  useEffect(() => {
    // Preload critical images and then hide loading screen
    const loadEverything = async () => {
      try {
        await preloadImages()
        // Add a minimum loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 800))
      } catch (error) {
        console.warn('Loading error:', error)
      } finally {
        // Always hide loading screen after max 10 seconds
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
    }

    loadEverything()

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000) // Change image every 5 seconds

    return () => {
      clearInterval(interval)
    }
  }, [images.length, preloadImages])

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-b from-[#F4F4F4] to-[#FEF3E9] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          <Image 
            src="/Neon Edu Logo.png" 
            alt="Loading..." 
            width={120} 
            height={120}
            priority
          />
          <motion.div
            className="w-8 h-8 border-4 border-[#FF872F] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="flex flex-col items-center gap-2">
            <p className="text-[#616161] text-sm font-montserrat">Loading content...</p>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#FF872F] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <p className="text-[#616161] text-xs font-montserrat">{loadingProgress}%</p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <SupabaseProvider>
      <div className="h-screen bg-transparent flex flex-col items-center justify-start overflow-y-auto bg-gradient-to-b from-[#F4F4F4] to-[#FEF3E9]">
        <Navbar />
        <div className='w-full flex flex-col items-center justify-center'>
        <div className="relative w-full lg:w-[95%] h-auto flex flex-col items-center justify-center lg:mt-16 mt-0 px-4 md:px-8 lg:px-16">
          <div className='w-full flex flex-col-reverse gap-4 md:gap-0 md:flex-row md:justify-between justify-center items-center mt-[140px] z-10'>
          <motion.div 
            className='w-full md:w-full flex flex-col font-clash font-medium gap-3'
            style={{ willChange: 'transform, opacity' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.h1 
              className='text-[27px] text-center md:text-left md:text-[44px] lg:text-[66px] w-full text-nowrap text-[#797979] md:leading-[48px] tracking-normal'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              YOUR GATEWAY 
            </motion.h1>
            <motion.h1 
              className='text-[40px] text-center md:text-left md:text-[64px] lg:text-[92px] md:leading-[68px] text-[#565656] tracking-wide'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              TO GLOBAL
            </motion.h1>
            <motion.h1 
              className='text-[40px] md:text-[64px] lg:text-[92px] text-center md:text-left md:leading-[68px] text-[#2c2c2c] tracking-normal'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              EDUCATION
            </motion.h1>
          </motion.div>
            <motion.div
              style={{ willChange: 'transform, opacity' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Image 
                src="/Neon Edu Logo.png" 
                alt='Logo' 
                width={300} 
                height={300} 
                className='lg:mr-26 w-[250px] h-[250px] md:w-[280px] md:h-[280px] lg:w-[300px] lg:h-[300px] object-contain'
                priority
                loading="eager"
              />
            </motion.div>
          </div>
          <motion.div 
            className='w-[95%] md:w-full border-t-2 border-[#929292] mt-[60px] md:mt-[110px] z-10 '
            style={{ willChange: 'transform, opacity' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className='w-full flex flex-row justify-between items-start md:items-center'>
              <div className='md:w-full pl-1 md:pl-0 flex flex-col md:flex-row items-start justify-start w-[65%] '>
                <motion.div 
                className='md:w-[55%] w-full flex flex-col items-start justify-start py-1 md:py-4'
                style={{ willChange: 'transform, opacity' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <h1 className='text-[#FF872F] text-[14px] md:text-[32px] font-montserrat font-medium leading-[24px] tracking-normal mb-2'>Neon Edu</h1>
                <motion.span 
                  className='hidden md:flex items-center gap-2 text-[#f3f3f3] text-[14px] font-montserrat font-medium leading-[24px] tracking-normal bg-[#373737]/45 px-3 py-1 rounded-full mt-5'
                  style={{ willChange: 'transform, opacity' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                > 
                  <MapPin className='w-4 h-4 inline-flex' /> Mongolia, UB
                </motion.span>
                <motion.span 
                  className='hidden md:flex items-center gap-2 text-[#f3f3f3] text-[14px] font-montserrat font-medium leading-[24px] tracking-normal bg-[#373737]/45 px-3 py-1 rounded-full mt-[12px]'
                  style={{ willChange: 'transform, opacity' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                > 
                  <Clock className='w-4 h-4 inline-flex' /> Since 2015
                </motion.span>
                </motion.div>          
                <motion.div 
                className='md:w-[345px] w-full pt-1 md:py-4 pr-4 pb-16 md:border-r-2 md:border-[#929292]'
                style={{ willChange: 'transform, opacity' }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <motion.p 
                  className='text-[#333333] text-[14px] md:text-[20px] font-montserrat font-medium leading-[24px] tracking-normal mb-4'
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                Become a global citizen! Improve your English, achieve a great IELTS score, and take the next step to study at a world-class university abroad!
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Button onClick={scrollToServices} className='rounded-full bg-transparent text-[#616161] text-[8px] md:text-[12px] lg:text-[16px] px-0 md:py-2 md:px-4 lg:py-4 lg:px-6 border-1 border-[#616161] hover:bg-transparent hover:scale-105 duration-300 ease-in flex gap-1 md:gap-3 p-0 h-5 mb-8' variant='outline'><ArrowRight className='scale-75 md:scale-100 lg:scale-125' /> <p> Explore more </p></Button>
                </motion.div>
                </motion.div>
              </div>
              <div className='h-auto flex md:hidden flex-col items-start justify-start w-[35%] border-l-2 border-[#929292] pl-1 pb-24'>
              <motion.span 
                  className='flex items-center gap-1 text-[#333333] text-[12px] font-montserrat font-medium leading-[24px] tracking-normal bg-[#373737]/0 px-2 py-0.5 rounded-full mt-2'
                  style={{ willChange: 'transform, opacity' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                > 
                  <MapPin className='w-4 h-4 inline-flex' /> Mongolia, UB
                </motion.span>
                <motion.span 
                  className='flex items-center gap-1 text-[#333333] text-[12px] font-montserrat font-medium leading-[24px] tracking-normal bg-[#373737]/0 px-2 py-0.5 rounded-full mt-[12px]'
                  style={{ willChange: 'transform, opacity' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                > 
                  <Clock className='w-4 h-4 inline-flex' /> Since 2015
                </motion.span>
              </div>
            </div>
          </motion.div>
          <motion.div
            className='md:mt-16 absolute top-24 md:right-[64px] right-0 z-0'
            style={{ 
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              transform: 'translate3d(0, 0, 0)'
            }}
            animate={shouldReduceMotion ? {} : { 
              y: [0, -8, 0]
            }}
            transition={shouldReduceMotion ? {} : { 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Image 
              src={heroImageUrls.australiaHero} 
              alt='Australia Dots' 
              width={700} 
              height={663.71}
              loading="lazy"
              unoptimized={true}
              onError={(e) => {
                console.error('Failed to load Australia hero image:', heroImageUrls.australiaHero);
                (e.target as HTMLImageElement).src = fallbackImageUrls.australiaHero;
              }}
              onLoad={() => {
                console.log('Successfully loaded Australia hero image');
              }}
            />
          </motion.div>
        </div>
        <motion.div 
          className='w-full h-[70vh] flex items-start justify-center rounded-4xl overflow-hidden'
          style={{ willChange: 'transform, opacity' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className='w-[90%] h-full  relative rounded-4xl'>
            {/* image carousel with scrolling animation */}
            <div className='absolute top-0 left-0 w-full h-full rounded-4xl overflow-hidden z-10'>
              <div 
                className='flex h-full transition-transform duration-500 ease-out'
                style={{ 
                  transform: `translate3d(-${currentImageIndex * 100}%, 0, 0)`,
                  willChange: 'transform'
                }}
              >
                {images.map((image, index) => (
                  <div 
                    key={index}
                    className='relative w-full h-full flex-shrink-0'
                  >
                    <Image 
                      src={image} 
                      alt={`Image ${index + 1}`} 
                      fill
                      className='object-cover'
                      priority={index === 0}
                      sizes="100vw"
                      unoptimized={true}
                      onError={(e) => {
                        console.error(`Failed to load image ${index + 1}:`, image);
                        // Fallback to original image if any image fails
                        const fallbackImages = [
                          fallbackImageUrls.neonEduV3,
                          fallbackImageUrls.image4,
                          fallbackImageUrls.neonEduV3Alt,
                          fallbackImageUrls.neonEduImage
                        ];
                        (e.target as HTMLImageElement).src = fallbackImages[index];
                      }}
                      onLoad={() => {
                        console.log(`Successfully loaded image ${index + 1}`);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* texts */}
            <div className='absolute top-0 left-0 w-full h-full z-20 flex flex-col items-center justify-between px-2 md:'>
              <motion.div 
                className='w-full flex justify-center items-center z-20 top-4'
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                <div className='bg-[#1f1f1f]/50 backdrop-blur-sm border border-[#747474] px-4 py-2 rounded-[16px] mt-4'>
                  <span className='text-white font-montserrat font-medium text-[16px]'>Neon Edu</span>
                </div>
              </motion.div>
              <motion.div 
                className='w-full flex flex-col items-center justify-center md:gap-6 gap-2 mb-4'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                <motion.div 
                  className='bg-[#1f1f1f]/50 backdrop-blur-sm border border-[#747474] md:px-6 md:py-4 px-1 py-2 rounded-3xl'
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                >
                  <p className='w-fit text-white font-montserrat font-bold text-center text-[14px] md:text-[22px]'>Neon Edu - Your gateway to global education!</p>
                </motion.div>
                {/* interactive dots */}
                <motion.div 
                  className='bg-[#1f1f1f]/50 backdrop-blur-sm border border-[#747474] p-1 rounded-full'
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                >
                  <div className='flex gap-2'>
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ease-in-out hover:scale-125 ${
                          index === currentImageIndex 
                            ? 'bg-white' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        {/* our service */}
        <section 
          id="services"
          className='w-full h-auto md:h-[800px] lg:h-[500px] flex md:flex-row flex-col gap-6 md:gap-0 py-12 md:py-0 items-center md:justify-center  justify-start relative'
        >
        <motion.div 
          className='w-full h-full flex md:flex-row flex-col gap-6 md:gap-0 py-12 md:py-0 items-center md:justify-center  justify-start relative'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
              <motion.div
                className='absolute top-8 right-[64px] z-10'
                style={{ willChange: 'transform, opacity' }}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Image 
                  src="/ourServiceBgDots.svg" 
                  alt='Our Service' 
                  width={643} 
                  height={489}
                  loading="lazy"
                  unoptimized={true}
                  onError={(e) => {
                    console.error('Failed to load ourServiceBgDots.svg');
                  }}
                  onLoad={() => {
                    console.log('Successfully loaded ourServiceBgDots.svg');
                  }}
                />
              </motion.div>
            
            {/* Mobile Header - Only visible on mobile */}
            <motion.div 
              id="services"
              className='md:hidden w-[90%] flex justify-center z-30'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <div className='border-b-2 border-[#BBBBBB] w-full flex justify-center pb-4'>
                <p className='text-[#333333] text-[24px] font-clash font-medium leading-[24px] tracking-normal text-center'> 
                  Our Services
                </p>
              </div>
            </motion.div>

            <motion.div 
              id="services-desktop"
              className='z-20 w-[90%] flex flex-col md:flex-row items-start justify-start gap-6 md:gap-10 md:border-t-2 border-[#BBBBBB] md:relative md:bottom-auto'
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <motion.div 
                className='hidden md:flex w-[25%] flex-col items-center justify-start pr-10 pt-10'
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              >
                <p className='text-[#333333] text-[32px] font-clash font-medium leading-[24px] tracking-normal'> 
                  Our Services
                </p>
              </motion.div>
              <div className='hidden md:block w-[2px] md:h-[600px] lg:h-[40vh] bg-[#BBBBBB]'>.</div>
              <motion.div 
                className='w-full md:w-[75%] flex flex-col md:flex-col lg:flex-row text-[#333333] gap-6 pt-0 md:gap-8 lg:gap-10 md:pt-8 lg:pt-12 px-0 md:px-6'
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              >
                  <motion.div 
                    className='w-full md:w-full lg:w-[50%] h-full flex flex-col items-center justify-center text-center'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
                  >
                    <motion.header 
                      className='text-[#333333] text-[20px] font-clash font-medium leading-[24px] tracking-normal border-b-2 border-[#333333] w-full text-left'
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.4, delay: 1.2, ease: "easeOut" }}
                    >
                      01
                    </motion.header>
                    <h1 className='text-[24px] md:text-[28px] font-clash font-medium leading-8 tracking-normal mt-[38px]'>English Language <br /> Courses</h1>
                    <p className='text-[18px] text-[#ff872f] font-medium my-4'>*</p> 
                    <div className='flex flex-col md:flex-row font-montserrat text-[14px] text-[#2c2c2c] gap-2 md:gap-3 font-medium'>
                      <p>General English</p>
                      <p>IELTS preparation</p>
                      <p>Academic English</p>
                    </div>
                    <button onClick={() => scrollToSection('courses')} className='flex items-center justify-center gap-2 text-[#2c2c2c] text-[14px] font-montserrat font-medium leading-[24px] tracking-normal mt-[38px] hover:text-[#FF872F] transition-colors cursor-pointer'>
                      <span>Find a Course</span>
                      <p className='text-[#2c2c2c] text-sm font-montserrat font-light leading-[24px] tracking-normal'>
                      <ChevronRight className='font-light'/>
                      </p>
                    </button>
                  </motion.div>
                  <motion.div 
                    className='w-full md:w-full lg:w-[50%] h-full flex flex-col items-center justify-center text-center'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
                  >
                    <motion.header 
                      className='text-[#333333] text-[20px] font-clash font-medium leading-[24px] tracking-normal border-b-2 border-[#333333] w-full text-left'
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.4, delay: 1.4, ease: "easeOut" }}
                    >
                      02
                    </motion.header>
                    <h1 className='text-[24px] md:text-[28px] font-clash font-medium leading-8 tracking-normal mt-[38px]'>Education Agency
                     <br /> Services</h1>
                    <p className='text-[18px] text-[#ff872f] font-medium my-4'>*</p> 
                    <div className='flex flex-col md:flex-row font-montserrat text-[14px] text-[#2c2c2c] gap-2 md:gap-3 font-medium'>
                      <p>Education counseling</p>
                      <p>Study application</p>
                      <p>Visa application</p>
                    </div>
                    <button onClick={() => scrollToSection('studyabroad')} className='flex items-center justify-center gap-2 text-[#2c2c2c] text-[14px] font-montserrat font-medium leading-[24px] tracking-normal mt-[38px] hover:text-[#FF872F] transition-colors cursor-pointer'>
                      <span>Study Abroad</span>
                      <p className='text-[#2c2c2c] text-sm font-montserrat font-light leading-[24px] tracking-normal'>
                      <ChevronRight className='font-light'/>
                      </p>
                    </button>
                  </motion.div>
                  
              </motion.div>
            </motion.div>
        </motion.div>
        </section>
        {/* Our focus  */}
        <motion.div 
          className='w-full h-auto md:h-screen flex md:flex-row flex-col gap-6 md:gap-0 py-12 md:py-0 items-center md:justify-center justify-start relative'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
              <Image 
                src="/our focus bg.svg" 
                alt='Our Focus' 
                width={800} 
                height={500}
                className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0'
              />
              <motion.div className='w-full h-full flex flex-col items-center justify-center relative z-10'>
            {/* Mobile Header - Only visible on mobile */}
            <motion.div 
              className='md:hidden w-[90%] flex justify-center z-30 mb-7'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <div className='border-b-2 border-[#BBBBBB] w-full flex justify-center pb-4'>
                <p className='text-[#333333] text-[24px] font-clash font-medium leading-[24px] tracking-normal text-center'> 
                  Our Focus 
                </p>
              </div>
            </motion.div>

          <motion.div 
              className='z-20 w-[90%] h-auto flex flex-col md:flex-row-reverse items-start justify-start gap-6 md:gap-10 md:border-t-2 border-[#BBBBBB] md:relative md:bottom-auto'
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <motion.div 
                className='hidden md:flex w-[25%] h-full flex-col items-center justify-start pr-10 pt-10'
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                <p className='text-[#333333] text-[32px] font-clash font-medium leading-[24px] tracking-normal'> 
                  Our Focus 
                </p>
              </motion.div>
              <div className='hidden md:block w-[2px] h-[35vh] bg-[#BBBBBB]'>.</div>
              <motion.div 
                className='w-full md:w-[75%] flex flex-col items-center justify-center md:flex-row text-[#333333] gap-6 pt-0 md:gap-10 md:pt-12 px-0 md:px-6'
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              >
                  <motion.div 
                    className='w-full md:w-[50%] h-full flex flex-col items-start justify-start text-center'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                  >
                    <p className='text-[22px] text-[#ff872f] font-medium -mb-4'>*</p> 
                    <p className='text-[20px] md:text-[22px] text-left pl-2'>Helping students improve their English and Academic English skills</p>
                    
                  </motion.div>
                  <motion.div 
                    className='w-full md:w-[50%] h-full flex flex-col items-start justify-start text-center'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
                  >
                   
                    <p className='text-[22px] text-[#ff872f] font-medium -mb-4'>*</p> 
                    <p className='text-[20px] md:text-[22px] text-left pl-2 '>Guiding them step by step toward studying at top universities abroad</p>
                  </motion.div>
                  
              </motion.div>
            </motion.div>
              <motion.div 
              className='w-[98%] h-fit flex flex-col items-center justify-center mt-12 md:mt-20 px-4'
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              
              <div className='w-fit h-fit relative'>
                <motion.p 
                  className='absolute top-0 left-0 text-[24px] text-[#ff872f] font-medium'
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
                >
                  *
                </motion.p>
                <motion.h1 
                  className='text-[22px] text-left md:text-[24px] md:text-center text-[#333333] ml-4 md:ml-3 mt-4 leading-relaxed font-medium'
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                >
                  We are always open to establishing strategic partnerships with <br className='hidden md:block' /> leading educational institutions and professional, ethical agencies <br className='hidden md:block' /> worldwide.
                </motion.h1>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
              >
                <Button onClick={() => scrollToSection('contact')} className='rounded-full bg-transparent text-[#616161] border-1 border-[#616161] hover:bg-transparent hover:scale-105 duration-300 ease-in flex-row-reverse mt-6' variant='outline'><ArrowRight className='w-4 h-4' /> <p> contact us </p></Button>
              </motion.div>     
              </motion.div>
            </motion.div> 
          </motion.div>

          {/* history */}
          <motion.div 
            id="about"
            className='w-full min-h-screen flex items-start justify-center py-4 text-[#333333]'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
          <motion.div 
            className='w-[90%] h-full flex items-start lg:border-t-2 lg:border-[#bbbbbb] lg:flex-row flex-col'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <motion.div 
              className='hidden lg:block w-1/4 min-h-screen font-clash text-[#333333] font-medium text-[32px] pt-8 pl-3 border-r-2 border-[#bbbbbb]'
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            > 
              Our History
            </motion.div> 
            <motion.div 
              className='block lg:hidden w-full font-clash text-[#333333]  font-medium text-[24px] md:text-[32px] text-center border-b-2 border-[#bbbbbb]'
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            > 
              Our History
            </motion.div> 

           <section className='w-full h-full flex flex-col items-start justify-start'>
              {(() => {
                const currentTimeline = historyData.length > 0 ? historyData : timelineData;
                return currentTimeline.map((item, index) => (
                <motion.div 
                  key={item.year || (item as any).id} 
                  className={`${index === 0 ? 'pt-8' : 'pt-2'} lg:pl-12 pl-2 w-full h-full flex items-start justify-start gap-5`}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.6, ease: "easeOut" }}
                >
                  <motion.div 
                    className='flex flex-col items-center justify-start gap-2'
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.8, ease: "easeOut" }}
                  >
                    <div className='w-6 h-6 border-4 border-[#000000] rounded-full'></div>
                    
                      <div className='w-1 h-[118px] bg-[#000000] rounded-full'></div>
                    
                    {index === currentTimeline.length - 1 && (
                      <div className='w-6 h-6 border-4 border-[#000000] rounded-full'></div>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 1.0, ease: "easeOut" }}
                  >
                    <div className='text-[20px] font-montserrat font-medium'>
                      <p className='text-[#ff872f] -mb-6 -ml-2'>*</p>
                      <h2>{item.year}</h2>
                    </div>
                    <p className='text-[18px] font-clash font-medium mt-4 pl-2'>{(item as any).event || item.description}</p>
                  </motion.div>
                </motion.div>
              ));
              })()}
            </section>
            </motion.div>
           </motion.div>
           <motion.div 
             id="ourteam"
             className='w-full h-auto flex flex-col gap-8 sm:gap-12 lg:gap-14 items-center justify-center py-16 sm:py-20 lg:py-30 px-4 sm:px-6 lg:px-8'
             initial={{ opacity: 1 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true, amount: 0.1 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
           >
            <motion.h1 
              className='text-[24px] sm:text-[28px] lg:text-[32px] font-clash font-medium text-[#333333] text-center'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              Our Team
            </motion.h1>
            <motion.div 
              className='w-[98%] h-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 gap-y-8 items-start justify-items-stretch'
              initial={{ opacity: 1 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                {teamData.map((item, index) => (
                 <motion.div
                   key={index}
                   style={{ willChange: 'transform, opacity' }}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, amount: 0.2 }}
                   transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                 >
                   <Teamcard name={item.name} image={item.image} position={item.position || ''} ditem1={item.ditem1 || ''} ditem2={item.ditem2 || ''} ditem3={item.ditem3 || ''} />
                 </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.section 
              id="courses"
              className='pb-30 w-full flex flex-col items-center justify-center'
              initial={{ opacity: 1 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className='w-[95%] flex items-center justify-center py-10 border-b-4 border-[#BBBBBB] mb-6'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                <header className='text-[24px] sm:text-[28px] lg:text-[32px] font-clash font-medium text-[#333333]'>Find a Course</header>
              </motion.div>
              <motion.div 
                className='w-[95%] h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch justify-items-center'
                initial={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                {courseData.map((course, index) => (
                  <motion.div 
                    key={index} 
                    className='h-[280px] w-full max-w-[400px] flex flex-col items-start justify-start rounded-3xl relative overflow-hidden py-4 px-5'
                    style={{ willChange: 'transform, opacity' }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <div className='w-full h-full absolute top-0 left-0 z-10 bg-gradient-to-r from-black/65 from-30% to-transparent to-100% '></div>
                    <Image 
                      src={course.image} 
                      alt={course.title} 
                      className='absolute top-0 left-0 w-full h-full object-cover'
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className='z-50'>
                        <div>
                            <h1 className='text-[40px] font-montserrat font-medium text-[#DFDFDF] -tracking-[0.2rem]'>{course.title}</h1>
                            <p className='text-[12px] font-montserrat font-medium text-[#E0E0E0] tracking-[0%] -mt-2 ml-1'>{course.duration}</p>
                        </div>
                        <div className='absolute bottom-8 left-4 flex flex-col items-start gap-6'>

                          <div className='flex items-center gap-2'>
                            <GraduationCap className='text-white' />
                            <p className='text-[14px] font-montserrat font-medium text-[#E0E0E0] tracking-[0%]'>Difficulty :</p>
                          </div>
                          <div className='flex flex-col items-start gap-2'>
                            <p className='text-[16px] font-montserrat font-medium text-[#E0E0E0] tracking-[0%]'>{course.levelitem1}</p>
                            <p className='text-[16px] font-montserrat font-medium text-[#E0E0E0] tracking-[0%]'>{course.levelitem2}</p>
                          </div>
                        </div>
                        <Button onClick={() => scrollToSection('contact')} className='absolute bottom-4 right-4 rounded-full border-1 border-[#BCBCBC] bg-white/20 backdrop-blur-sm hover:bg-white/30 hover:scale-105 duration-300 ease-in text-white'> 
                            <span className='text-white'>Apply Now</span> 
                            <ChevronRight className='w-4 h-4 text-white' /> 
                        </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
            <motion.section 
              id="studyabroad"
              className='w-full  flex flex-col items-center justify-center'
              initial={{ opacity: 1 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className='w-[100%] flex items-center justify-center py-10 border-b-4 border-[#BBBBBB]'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                <header className='text-[24px] sm:text-[28px] lg:text-[32px] font-clash font-medium text-[#333333]'>Study Abroad</header>
              </motion.div>
               <motion.div 
                 className='w-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-0'
                 initial={{ opacity: 1 }}
                 whileInView={{ opacity: 1 }}
                 viewport={{ once: true, amount: 0.1 }}
                 transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
               >
                 {studyAbroadData.map((country, index) => (
                   <motion.div 
                     key={index} 
                     className='w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[416px] xl:h-[516px] flex flex-col justify-center relative z-10 pl-6 sm:pl-8 md:pl-10 overflow-hidden'
                     style={{ willChange: 'transform, opacity' }}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, amount: 0.2 }}
                     transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                   >
                     <div className='w-full flex flex-col items-start justify-start relative overflow-hidden px-3 sm:px-4 md:px-5 pb-6 sm:pb-8 z-50 border-l-2 border-[#dbdbdb]'>
                       <h2 className='text-[24px] sm:text-[28px] md:text-[32px] font-clash font-medium text-[#FFFFFF]/90 tracking-[0%] mb-4 sm:mb-6 md:mb-9'>{country.country}</h2>
                       <h1 className='w-full max-w-[350px] sm:max-w-[400px] text-[20px] sm:text-[26px] md:text-[32px] font-montserrat font-medium text-[#FFFFFF] tracking-[0%] leading-tight'>{country.description}</h1>
                       <p className='text-[16px] sm:text-[20px] md:text-[24px] font-montserrat font-regular text-[#FFFFFF] tracking-[0%] mt-4 sm:mt-5 md:mt-6 leading-relaxed'>{country.universities}</p>
                     </div>
                     <div className='w-full h-full absolute bg-black/45 left-0 top-0 z-20'></div>
                     <Image 
                       src={country.image} 
                       alt="" 
                       className='absolute top-0 left-0 w-full h-full object-cover'
                       fill
                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     />
                     <Image 
                       src={country.dotbg} 
                       alt="" 
                       className='absolute top-4 sm:top-6 md:top-8 -right-8 sm:-right-12 md:-right-14 w-full h-full z-30'
                       fill
                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     /> 
                   </motion.div>
                 ))}
               </motion.div>
            </motion.section>
            <motion.section 
              id="contact"
              className='w-full flex flex-col items-center justify-center pt-16 sm:pt-24 lg:pt-32 pb-8 sm:pb-12 text-[#333333] px-4 sm:px-6 lg:px-8'
              initial={{ opacity: 1 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.header 
                className='text-[24px] sm:text-[28px] lg:text-[32px] font-clash font-medium text-[#333333] mb-8 sm:mb-10 lg:mb-12 text-center'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                Contact Us
              </motion.header>

              <motion.article 
                className='w-full max-w-7xl flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12 xl:gap-24'
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                
                <div className='w-full lg:w-[50%] flex flex-col gap-6 sm:gap-8 lg:gap-10'>
                  <section>
                    <div className='h-[28px] sm:h-[32px] flex items-center justify-start border-b-1 border-[#FF872F]'>
                      <h1 className='text-[16px] sm:text-[18px] lg:text-[20px] font-clash font-medium text-[#333333]'>Contact Information</h1>
                    </div> 
                      <div className='flex flex-col items-start justify-start gap-4 sm:gap-5 lg:gap-7 mt-4 sm:mt-5 lg:mt-7'>
                        <div className='flex items-start sm:items-center justify-start gap-2 text-[14px] sm:text-[16px]'> 
                          <Phone className='w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0' /> 
                          <p className='break-words'>Phone numbers: (+976) 9906-7781, (+976) 9906-5562</p>
                        </div>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 text-[14px] sm:text-[16px]'> 
                          <Mail className='w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0' /> 
                          <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                            <span className='flex items-center justify-start gap-2'>
                              <p>neon.edu.mn@gmail.com</p> 
                              <button 
                                onClick={() => copyToClipboard('neon.edu.mn@gmail.com')}
                                className='hover:text-[#FF872F] transition-colors'
                                aria-label='Copy email address'
                              >
                                {copiedEmail === 'neon.edu.mn@gmail.com' ? (
                                  <Check className='w-4 h-4 text-green-500' />
                                ) : (
                                  <Copy className='w-4 h-4' />
                                )}
                              </button>
                            </span> 
                            <span className='flex items-center justify-start gap-2'>
                              <p>hello@neonedu.net</p> 
                              <button 
                                onClick={() => copyToClipboard('hello@neonedu.net')}
                                className='hover:text-[#FF872F] transition-colors'
                                aria-label='Copy email address'
                              >
                                {copiedEmail === 'hello@neonedu.net' ? (
                                  <Check className='w-4 h-4 text-green-500' />
                                ) : (
                                  <Copy className='w-4 h-4' />
                                )}
                              </button>
                            </span>
                          </div>
                        </div>
                        <div className='flex items-center justify-start gap-2 text-[14px] sm:text-[16px]'> 
                          <Facebook className='w-4 h-4 sm:w-5 sm:h-5' /> 
                          <a href="https://www.facebook.com/neon.edu.mn" className='hover:text-[#FF872F] transition-colors'>neon.edu.mn</a> 
                          <ArrowUpRight className='w-4 h-4' /> 
                        </div>
                        <div className='flex items-center justify-start gap-2 text-[14px] sm:text-[16px]'> 
                          <Instagram className='w-4 h-4 sm:w-5 sm:h-5' /> 
                          <a href="https://www.instagram.com/neon.edu.mn/" className='hover:text-[#FF872F] transition-colors'>@neon.edu.mn</a> 
                          <ArrowUpRight className='w-4 h-4' /> 
                        </div>
                      </div>
                  </section>
                  <section>
                  <div className='h-[28px] sm:h-[32px] flex items-center justify-start border-b-1 border-[#FF872F]'>
                      <h1 className='text-[16px] sm:text-[18px] lg:text-[20px] font-clash font-medium text-[#333333]'>Send a message</h1>
                    </div> 

                        <form onSubmit={handleSubmit} className='mt-4 sm:mt-5 lg:mt-6'>
                          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4'>
                            <div>
                              <Input 
                                type="text" 
                                name="firstName"
                                placeholder='First Name' 
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className={`placeholder:text-xs text-sm sm:text-base ${formErrors.firstName ? 'border-red-500 rounded-xl border-1 bg-[#FAFAFA] h-[40px] sm:h-[42px]' : ' rounded-xl border-1 border-[#BBBBBB] bg-[#FAFAFA] h-[40px] sm:h-[42px]'}`}
                                required
                              />
                              {formErrors.firstName && <p className='text-red-500 text-xs sm:text-sm mt-1'>{formErrors.firstName}</p>}
                            </div>
                            <div>
                              <Input 
                                type="text" 
                                name="lastName"
                                placeholder='Last Name' 
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className={`placeholder:text-xs text-sm sm:text-base ${formErrors.lastName ? 'border-red-500 rounded-xl border-1 bg-[#FAFAFA] h-[40px] sm:h-[42px]' : ' rounded-xl border-1 border-[#BBBBBB] bg-[#FAFAFA] h-[40px] sm:h-[42px]'}`}
                                required
                              />
                              {formErrors.lastName && <p className='text-red-500 text-xs sm:text-sm mt-1'>{formErrors.lastName}</p>}
                            </div>
                          </div>
                          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4'>
                            <div>
                              <Input 
                                type="tel" 
                                name="phone"
                                placeholder='(+976) Phonenumber' 
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`placeholder:text-xs text-sm sm:text-base ${formErrors.phone ? 'border-red-500 rounded-xl border-1 bg-[#FAFAFA] h-[40px] sm:h-[42px]' : ' rounded-xl border-1 border-[#BBBBBB] bg-[#FAFAFA] h-[40px] sm:h-[42px]'}`}
                                required
                              />
                              {formErrors.phone && <p className='text-red-500 text-xs sm:text-sm mt-1'>{formErrors.phone}</p>}
                            </div>
                            <div>
                              <Input 
                                type="email" 
                                name="email"
                                placeholder='Email' 
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`placeholder:text-xs text-sm sm:text-base ${formErrors.email ? 'border-red-500 rounded-xl border-1 bg-[#FAFAFA] h-[40px] sm:h-[42px]' : ' rounded-xl border-1 border-[#BBBBBB] bg-[#FAFAFA] h-[40px] sm:h-[42px]'}`}
                                required
                              />
                              {formErrors.email && <p className='text-red-500 text-xs sm:text-sm mt-1'>{formErrors.email}</p>}
                            </div>
                          </div>
                          <div className='mb-3 sm:mb-4'>
                            <Textarea 
                              name="message"
                              placeholder='Message' 
                              value={formData.message}
                              onChange={handleInputChange}
                              className={`min-h-[100px] sm:min-h-[120px] placeholder:text-xs text-sm sm:text-base ${formErrors.message ? 'border-red-500 rounded-xl border-1 bg-[#FAFAFA]' : ' rounded-xl border-1 border-[#BBBBBB] bg-[#FAFAFA]'}`}
                              required
                            />
                            {formErrors.message && <p className='text-red-500 text-xs sm:text-sm mt-1'>{formErrors.message}</p>}
                          </div>
                          <Button type="submit" disabled={isSubmitting} className='w-full sm:w-auto rounded-xl bg-[#fafafa] text-[#333333] border-1 border-[#bbbbbb] hover:bg-transparent hover:scale-105 duration-300 ease-in text-sm sm:text-base px-6 py-2 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed'> 
                            {isSubmitting ? 'Sending...' : 'Send'} 
                            <Send className='w-4 h-4 inline-block ml-2' /> 
                          </Button>
                        </form>
                  </section>
                </div>
                <div className='w-full lg:w-[50%] h-full flex flex-col items-start justify-start mt-8 lg:mt-0'>
                    <div className='w-full h-[28px] sm:h-[32px] flex items-center justify-start border-b-1 border-[#FF872F]'>
                      <h1 className='text-[16px] sm:text-[18px] lg:text-[20px] font-clash font-medium text-[#333333]'>Location</h1>
                    </div> 

                  <div className='mt-4 sm:mt-5 lg:mt-7'>
                    <p className='text-[14px] sm:text-[15px] lg:text-[16px] font-montserrat font-medium text-[#333333] tracking-[0%] leading-relaxed'>Neon Edu : <br /> Sukhbaatar District 8th Khoroo <br /> Batmunkh street 39-1 Gurvan Erdene Tuv #402 <br /> Ulaanbaatar 14192 Mongolia</p>
                  </div>
                  <div className='mt-6 sm:mt-8 lg:mt-10 w-full rounded-2xl sm:rounded-3xl lg:rounded-4xl overflow-hidden h-[250px] sm:h-[300px] lg:h-[350px] border-1 border-[#BBBBBB]'>
                    {/* google map */}
                      <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2673.538206173558!2d106.91999257725143!3d47.925972171220955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d96935f61cb2431%3A0xf704cb48c78c1e77!2zTmVvbiBFZHUgKNCd0LXQvtC9INCt0LTRjik!5e0!3m2!1sen!2smn!4v1758022918760!5m2!1sen!2smn" 
                        width="100%" 
                        height="100%" 
                        style={{border:0}} 
                        allowFullScreen={false} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                  </div>
                </div>
              </motion.article>
            </motion.section>
            <motion.footer 
              className='w-full h-auto flex flex-col lg:flex-row items-start lg:items-center justify-start relative gap-6 lg:gap-8 bg-[#333333] text-[#FAFAFA] py-8 sm:py-10 lg:py-14 px-4 sm:px-6 lg:px-8 xl:pl-22'
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className='w-full lg:w-auto flex flex-col items-start justify-start gap-4 sm:gap-5 lg:gap-6'>
                  <Image 
                    src="/Neon Edu Logo.png" 
                    alt="logo" 
                    width={48} 
                    height={48}
                    className='sm:w-16 sm:h-16'
                    loading="lazy"
                  />
                  <div className='w-full flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 text-[14px] sm:text-[16px]'> 
                    <Phone className='text-[#FF872F] w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0' /> 
                    <p className='break-words'>(+976) 9906-7781, (+976) 9906-5562</p>
                  </div>
                  <div className='flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 text-[14px] sm:text-[16px]'> 
                    <Mail className='text-[#FF872F] w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0' /> 
                    <div className='flex flex-col sm:flex-row gap-2 sm:gap-4'>
                      <span className='flex items-center justify-start gap-2'>
                        <p>neon.edu.mn@gmail.com</p>  
                      </span> 
                      <span className='flex items-center justify-start gap-2'>
                        <p>hello@neonedu.net</p>
                      </span> 
                    </div>
                  </div>
                  <div className='flex items-center justify-start gap-3'>
                    <Facebook 
                      className='text-[#FF872F] w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:scale-110 transition-transform' 
                      onClick={() => window.open('https://www.facebook.com/neonedu.mn', '_blank')}
                    />
                    <Instagram 
                      className='text-[#FF872F] w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:scale-110 transition-transform'
                      onClick={() => window.open('https://www.instagram.com/neonedu.mn', '_blank')}
                    />
                  </div>
                </div>
               
                <p className='text-[#FAFAFA]/70 text-[12px] sm:text-[14px] lg:text-[16px] font-montserrat font-medium mt-4 lg:mt-0 lg:absolute lg:bottom-2 lg:right-6'>© 2025 Neon Edu</p>
            </motion.footer>
        </div>
      </div>
    </SupabaseProvider>
  )
}
