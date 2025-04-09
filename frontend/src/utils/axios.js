import axios from "axios";
import API_BASE_URL from "../config/api";

// Create axios instance with dynamic base URL from config
const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

// Add request interceptor for auth tokens if needed
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;