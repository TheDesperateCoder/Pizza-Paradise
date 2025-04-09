import axios from "axios";

// Update the base URL to port 3001 to match your backend
const API = axios.create({
  baseURL: "http://localhost:3001/api",
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