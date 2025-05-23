import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add token to requests
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

// Auth APIs
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');

// Post APIs
export const createPost = (data) => api.post('/posts/create', data);
export const getPosts = () => api.get('/posts');
export const getPost = (id) => api.get(`/posts/${id}`);
export const editPost = (id, data) => api.put(`/posts/edit/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/delete/${id}`);
export const getUserPosts = () => api.get('/posts/user');

export default api;