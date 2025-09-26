import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Team Members API
export const teamMembersAPI = {
  getAll: () => api.get('/team-members'),
  getById: (id) => api.get(`/team-members/${id}`),
  create: (data) => api.post('/team-members', data),
  update: (id, data) => api.put(`/team-members/${id}`, data),
  delete: (id) => api.delete(`/team-members/${id}`),
};

// Courses API
export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

// Study Abroad API
export const studyAbroadAPI = {
  getAll: () => api.get('/study-abroad'),
  getById: (id) => api.get(`/study-abroad/${id}`),
  create: (data) => api.post('/study-abroad', data),
  update: (id, data) => api.put(`/study-abroad/${id}`, data),
  delete: (id) => api.delete(`/study-abroad/${id}`),
};

// Contact Info API
export const contactInfoAPI = {
  get: () => api.get('/contact-info'),
  update: (data) => api.put('/contact-info', data),
  addSocial: (data) => api.post('/contact-info/socials', data),
  removeSocial: (socialId) => api.delete(`/contact-info/socials/${socialId}`),
};

export default api;


