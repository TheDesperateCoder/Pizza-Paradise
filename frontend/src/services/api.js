import axios from 'axios';

// Use direct URL instead of import to avoid potential configuration issues
const API_BASE_URL = 'http://localhost:3001/api';

const API = axios.create({ 
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add request interceptor for authentication
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/signup', userData); // Changed from register to signup
export const sendOTP = (email) => API.post('/auth/sendotp', { email });

// User endpoints
export const fetchPizzas = () => API.get('/user/pizzas');
export const placeOrder = (orderData) => API.post('/user/order', orderData);
export const getOrderStatus = (orderId) => API.get(`/user/order-status/${orderId}`);
export const getUserProfile = () => API.get('/user/profile');

export default API;