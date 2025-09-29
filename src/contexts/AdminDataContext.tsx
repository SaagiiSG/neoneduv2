'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getTeamMembers, 
  getCourses, 
  getStudyAbroadPrograms,
  getHistoryData,
  transformTeamData,
  transformCourseData,
  transformStudyAbroadData
} from '@/lib/data';
import { TeamMember, Course, StudyAbroadProgram, HistoryItem } from '@/lib/types';

interface AdminDataContextType {
  teamData: TeamMember[];
  courseData: Course[];
  studyAbroadData: StudyAbroadProgram[];
  historyData: HistoryItem[];
  isLoading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [teamData, setTeamData] = useState<TeamMember[]>([]);
  const [courseData, setCourseData] = useState<Course[]>([]);
  const [studyAbroadData, setStudyAbroadData] = useState<StudyAbroadProgram[]>([]);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching admin data...');
      
      // Add timeout to prevent hanging on database calls
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Admin data fetch timeout')), 15000)
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

      console.log('✅ Admin data fetched successfully');
      
      const transformedTeam = transformTeamData(teamMembers);
      const transformedCourses = transformCourseData(courses);
      
      setTeamData(transformedTeam);
      setCourseData(transformedCourses);
      setStudyAbroadData(transformStudyAbroadData(studyAbroad));
      setHistoryData(history || []);
      
    } catch (error) {
      console.error('❌ Error fetching admin data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch admin data');
      
      // Set empty arrays as fallback
      setTeamData([]);
      setCourseData([]);
      setStudyAbroadData([]);
      setHistoryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <AdminDataContext.Provider 
      value={{ 
        teamData, 
        courseData, 
        studyAbroadData, 
        historyData, 
        isLoading, 
        error,
        refetchData: fetchAdminData 
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
}
