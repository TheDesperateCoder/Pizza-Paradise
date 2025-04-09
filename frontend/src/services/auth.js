import { login, register } from './api';

export const handleLogin = async (credentials) => {
  try {
    const { data } = await login(credentials);
    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const handleRegister = async (userData) => {
  try {
    const { data } = await register(userData);
    return data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};