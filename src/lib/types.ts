// Team member types
export interface TeamMember {
  id?: string;
  name: string;
  role?: string;
  image: string;
  bio?: string;
  position?: string;
  ditem1?: string;
  ditem2?: string;
  ditem3?: string;
  created_at?: string;
  updated_at?: string;
  order?: number;
}

// Course types
export interface Course {
  id?: string;
  title: string;
  description: string;
  link?: string;
  category?: string;
  duration: string;
  levelitem1?: string;
  levelitem2?: string;
  image: string;
  created_at?: string;
  updated_at?: string;
  order?: number;
}

// Study abroad types
export interface StudyAbroadProgram {
  id?: string;
  programName?: string;
  program_name?: string;
  country: string;
  description: string;
  universities: string;
  image: string;
  dotbg: string;
  link?: string;
  created_at?: string;
  updated_at?: string;
  order?: number;
}

// History types
export interface HistoryItem {
  id?: string;
  year: string;
  description: string;
  order?: number;
}

// API types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Auth types
export interface User {
  id: string;
  email?: string;
  [key: string]: unknown;
}

export interface Session {
  user: User;
  expires_at?: number;
  [key: string]: unknown;
}

export interface AuthContext {
  session: Session;
  user: User;
}

// Cloudinary upload result
export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: unknown;
}
