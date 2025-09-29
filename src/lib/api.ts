import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('supabase.auth.token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('supabase.auth.token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Team Members API
export const teamMembersAPI = {
  getAll: () => api.get('/team-members'),
  getById: (id: string) => api.get(`/team-members/${id}`),
  create: (data: any) => api.post('/team-members', data),
  update: (id: string, data: any) => api.put(`/team-members/${id}`, data),
  delete: (id: string) => api.delete(`/team-members/${id}`),
};

// Courses API
export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getById: (id: string) => api.get(`/courses/${id}`),
  create: (data: any) => api.post('/courses', data),
  update: (id: string, data: any) => api.put(`/courses/${id}`, data),
  delete: (id: string) => api.delete(`/courses/${id}`),
};

// Study Abroad API
export const studyAbroadAPI = {
  getAll: () => api.get('/study-abroad'),
  getById: (id: string) => api.get(`/study-abroad/${id}`),
  create: (data: any) => api.post('/study-abroad', data),
  update: (id: string, data: any) => api.put(`/study-abroad/${id}`, data),
  delete: (id: string) => api.delete(`/study-abroad/${id}`),
};


export default api;


