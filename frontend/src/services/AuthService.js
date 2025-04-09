import axios from 'axios';
import API_BASE_URL from '../config/api';

const API_URL = `${API_BASE_URL}/api/auth`;

class AuthService {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      
      // Check if response contains token and user data
      if (response.data.token) {
        // Store user details and token in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        // Set axios default header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      console.log('Login error in AuthService:', error.response?.data);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/signup`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async sendOTP(email) {
    try {
      const response = await axios.post(`${API_URL}/sendotp`, { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  isAuthenticated() {
    const user = this.getCurrentUser();
    const token = localStorage.getItem('token');
    return !!user && !!token;
  }
}

// Create instance
const authService = new AuthService();

// Export as default
export default authService;