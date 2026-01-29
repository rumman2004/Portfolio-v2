import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('admin');
            window.location.href = '/admin/login';
            toast.error('Session expired. Please login again.');
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (data) => api.post('/auth/register', data),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

// About API - FIXED
export const aboutAPI = {
    get: () => api.get('/about'),
    createOrUpdate: (data) => api.post('/about', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    // Add alias for convenience
    update: (data) => api.post('/about', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

// Projects API
export const projectsAPI = {
    getAll: (params) => api.get('/projects', { params }),
    getOne: (id) => api.get(`/projects/${id}`),
    create: (data) => api.post('/projects', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => api.put(`/projects/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/projects/${id}`),
};

// Experience API
export const experienceAPI = {
    getAll: () => api.get('/experiences'),
    getOne: (id) => api.get(`/experiences/${id}`),
    create: (data) => api.post('/experiences', data),
    update: (id, data) => api.put(`/experiences/${id}`, data),
    delete: (id) => api.delete(`/experiences/${id}`),
};

// Certificates API
export const certificatesAPI = {
    getAll: () => api.get('/certificates'),
    getOne: (id) => api.get(`/certificates/${id}`),
    create: (data) => api.post('/certificates', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => api.put(`/certificates/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/certificates/${id}`),
};

// Skills API
export const skillsAPI = {
    getAll: (params) => api.get('/skills', { params }),
    getGrouped: () => api.get('/skills/grouped'),
    getOne: (id) => api.get(`/skills/${id}`),
    create: (data) => api.post('/skills', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => api.put(`/skills/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/skills/${id}`),
};

// Socials API
export const socialsAPI = {
    getAll: (params) => api.get('/socials', { params }),
    getOne: (id) => api.get(`/socials/${id}`),
    create: (data) => api.post('/socials', data),
    update: (id, data) => api.put(`/socials/${id}`, data),
    delete: (id) => api.delete(`/socials/${id}`),
    toggleVisibility: (id) => api.patch(`/socials/${id}/toggle`),
};

// Contacts API
export const contactsAPI = {
    getAll: (params) => api.get('/contacts', { params }),
    getOne: (id) => api.get(`/contacts/${id}`),
    create: (data) => api.post('/contacts', data),
    markAsRead: (id) => api.patch(`/contacts/${id}/read`),
    markAsReplied: (id) => api.patch(`/contacts/${id}/replied`),
    delete: (id) => api.delete(`/contacts/${id}`),
    getStats: () => api.get('/contacts/stats'),
};

export default api;
