import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('househunt_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle auth errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('househunt_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Properties
export const getProperties = (params) => API.get('/properties', { params });
export const getPropertyById = (id) => API.get(`/properties/${id}`);
export const createProperty = (data) => API.post('/properties', data);
export const updateProperty = (id, data) => API.put(`/properties/${id}`, data);
export const deleteProperty = (id) => API.delete(`/properties/${id}`);
export const getMyProperties = () => API.get('/properties/my');

// Admin - Properties
export const getPendingProperties = () => API.get('/properties/admin/pending');
export const getAllPropertiesAdmin = () => API.get('/properties/admin/all');
export const approveProperty = (id) => API.put(`/properties/admin/approve/${id}`);
export const rejectProperty = (id) => API.put(`/properties/admin/reject/${id}`);

// Bookings
export const createBooking = (data) => API.post('/bookings', data);
export const getMyBookings = () => API.get('/bookings');
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);

// Admin - Bookings & Users
export const getAllBookings = () => API.get('/bookings/admin/all');
export const getAllUsers = () => API.get('/bookings/admin/users');

export default API;
