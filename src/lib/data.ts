import { createClient } from '@supabase/supabase-js';
import { TeamMember, Course, StudyAbroadProgram, HistoryItem } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fetch team members from database
export async function getTeamMembers() {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

// Fetch courses from database
export async function getCourses() {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

// Fetch study abroad programs from database
export async function getStudyAbroadPrograms() {
  try {
    const { data, error } = await supabase
      .from('study_abroad')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching study abroad programs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching study abroad programs:', error);
    return [];
  }
}

// Fetch history data from database
export async function getHistoryData() {
  try {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .order('year', { ascending: true });

    if (error) {
      console.error('Error fetching history data:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching history data:', error);
    return [];
  }
}

// Transform database data to match your original format
export function transformTeamData(dbData: TeamMember[]) {
  // Define the specific order for team members (using exact names from database)
  const teamOrder = [
    'Dalantai.E',
    'Anar.P', 
    'Enkhjin. G',
    'Kherlen. Sh',
    'Mandakhjargal.E',
    'Enkhjin. T',
    'Yumjir. Ts'
  ];

  return dbData
    .map(member => ({
      name: member.name,
      image: member.image,
      position: member.role,
      ditem1: member.bio,
      ditem2: '',
      ditem3: ''
    }))
    .sort((a, b) => {
      const indexA = teamOrder.indexOf(a.name);
      const indexB = teamOrder.indexOf(b.name);
      
      // If both names are in the order list, sort by their position in the list
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If only one name is in the order list, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // If neither name is in the order list, sort alphabetically
      return a.name.localeCompare(b.name);
    });
}

export function transformCourseData(dbData: Course[]) {
  // Define the specific order for courses
  const courseOrder = [
    'General English',
    'IELTS Preparation', 
    'Academic English'
  ];

  return dbData
    .map(course => ({
      name: course.title,
      duration: course.duration || (course.description?.includes('months') ? 
        course.description.match(/\d+ months/)?.[0] || '4 months' : '4 months'),
      image: course.image || (course.title === 'General English' ? '/classroom2.svg' :
             course.title === 'IELTS Preparation' ? '/classroom1.png' :
             course.title === 'Academic English' ? '/office.svg' :
             course.category === 'General English' ? '/classroom2.svg' :
             course.category === 'IELTS Preparation' ? '/classroom1.png' :
             course.category === 'Academic English' ? '/office.svg' :
             '/office.svg'),
      levelItem1: course.levelitem1 || (course.description?.includes('Beginner') ? 'Beginner' :
                  course.description?.includes('Upper Intermediate') ? 'Upper Intermediate' :
                  'Research methodology'),
      levelItem2: course.levelitem2 || (course.description?.includes('Intermediate') ? 'Intermediate' :
                  course.description?.includes('Advanced') ? 'Advanced' :
                  'Academic writing')
    }))
    .sort((a, b) => {
      // Sort by category first
      const categoryA = courseOrder.indexOf(a.name) !== -1 ? courseOrder.indexOf(a.name) : 999;
      const categoryB = courseOrder.indexOf(b.name) !== -1 ? courseOrder.indexOf(b.name) : 999;
      
      if (categoryA !== categoryB) {
        return categoryA - categoryB;
      }
      
      // If same category or not in list, sort alphabetically
      return a.name.localeCompare(b.name);
    });
}

export function transformStudyAbroadData(dbData: StudyAbroadProgram[]) {
  return dbData.map((program) => {
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

    // Use uploaded image if available, otherwise fall back to country-based image
    const uploadedImage = program.image;
    const countryImageInfo = countryImageMap[program.country] || {
      image: '/Neon Edu v3 (2)/china.svg', // fallback
      dotbg: '/china dots.svg'
    };
    
    const imageInfo = {
      image: uploadedImage || countryImageInfo.image,
      dotbg: countryImageInfo.dotbg
    };

    // Split the description into two parts: main description and universities
    const description = program.description || '';
    let mainDescription = description;
    let universities = '';

    // Check if description uses pipe separator (new format)
    if (description.includes('|')) {
      const parts = description.split('|');
      mainDescription = parts[0].trim();
      universities = parts[1].trim();
    } else {
      // Fallback to pattern matching for old format
      const universityPatterns = [
        /(\d+\+ universities? and colleges?)$/i,
        /(James Cook University[^.]*)$/i,
        /(Sejong University[^.]*)$/i,
        /(INTI international University[^.]*)$/i,
        /(\d+\+ Universities? and colleges?)$/i,
        /(University of Miskolc[^.]*)$/i
      ];

      for (const pattern of universityPatterns) {
        const match = description.match(pattern);
        if (match) {
          universities = match[1];
          mainDescription = description.replace(pattern, '').trim();
          break;
        }
      }

      // If no pattern matched, try to split on common separators
      if (!universities) {
        const parts = description.split(/\.\s*(?=\d+\+)|\.\s*(?=James Cook)|\.\s*(?=Sejong)|\.\s*(?=INTI)|\.\s*(?=University of)/i);
        if (parts.length >= 2) {
          mainDescription = parts[0].trim();
          universities = parts[1].trim();
        }
      }
    }

    return {
      country: program.country,
      description: mainDescription || 'Study opportunities available',
      universities: universities || 'Contact us for more information',
      image: imageInfo.image,
      dotbg: imageInfo.dotbg
    };
  });
}
